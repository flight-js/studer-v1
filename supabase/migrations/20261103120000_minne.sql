-- Repetisjon som husker eleven: hvert kort og spørsmål eleven har svart på, får
-- en plan for når det skal komme tilbake. Det eleven bommer på, kommer dagen
-- etter. Det eleven kan, kommer sjeldnere og sjeldnere (se minne_intervall).
--
-- Nøkkelen (kolonnen minne) lages av teksten, ikke av rad-ID-en. Importen sletter
-- og legger inn radene på nytt, så ID-ene endrer seg. Samme kort står også både i
-- temaet og i repetisjonstemaet, og skal huskes som ett. Rettes forklaringen på et
-- kort, beholder eleven planen. Rettes selve begrepet eller spørsmålet, begynner
-- det på nytt. Fagets ID står først, så samme begrep i to fag huskes hver for seg.

alter table public.flashcards add column minne text generated always as (
  split_part(tema_id, ':', 1) || ':' || md5(lower(btrim(regexp_replace(begrep, '\s+', ' ', 'g'))))
) stored;

-- Riktig svar er med fordi noen spørsmål har samme tekst, men ulik fasit.
alter table public.quiz_sporsmal add column minne text generated always as (
  split_part(tema_id, ':', 1) || ':' ||
  md5(lower(btrim(regexp_replace(tekst || '|' || alternativer[riktig + 1], '\s+', ' ', 'g'))))
) stored;

create index flashcards_minne_idx on public.flashcards (minne);
create index quiz_sporsmal_minne_idx on public.quiz_sporsmal (minne);

create table public.minne (
  bruker_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('kort', 'sporsmal')),
  nokkel text not null check (char_length(nokkel) <= 120),
  steg smallint not null check (steg between 0 and 6),
  forfaller date not null,
  sist_ovd timestamptz not null default now(),
  primary key (bruker_id, type, nokkel)
);

create index minne_forfaller_idx on public.minne (bruker_id, forfaller);

alter table public.minne enable row level security;

grant select, insert, update, delete on public.minne to authenticated;

create policy "Brukere kan lese eget minne" on public.minne
  for select to authenticated using ((select auth.uid()) = bruker_id);

create policy "Brukere kan legge inn eget minne" on public.minne
  for insert to authenticated with check ((select auth.uid()) = bruker_id);

create policy "Brukere kan oppdatere eget minne" on public.minne
  for update to authenticated
  using ((select auth.uid()) = bruker_id)
  with check ((select auth.uid()) = bruker_id);

create policy "Brukere kan slette eget minne" on public.minne
  for delete to authenticated using ((select auth.uid()) = bruker_id);

-- «I dag» følger norsk tid, ikke serverens.
create function public.minne_i_dag()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Europe/Oslo')::date;
$$;

-- Antall dager til neste repetisjon for hvert steg.
create function public.minne_intervall(p_steg int)
returns int
language sql
immutable
set search_path = ''
as $$
  select (array[1, 3, 7, 14, 30, 60, 120])[least(p_steg, 6) + 1];
$$;

-- Lagrer svar: [{ "type": "kort", "nokkel": "…", "kan": true }, …].
--
-- Bommer eleven, begynner planen på nytt og det kommer tilbake i morgen. Kan
-- eleven det når det er på tide, går det ett steg videre. Kan eleven det før det
-- er på tide, skjer det ingenting. Da kan ikke en bunke tatt flere ganger samme
-- dag flytte kortet langt frem, og et kort man bommet på og så fikk til, kommer
-- likevel tilbake i morgen. Første gang starter det på steg 2 (en uke) hvis
-- eleven kan det. Kjører med brukerens egne rettigheter, som lagre_resultat.
create function public.husk_svar(p_svar jsonb)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.minne (bruker_id, type, nokkel, steg, forfaller, sist_ovd)
  select distinct on (s.type, s.nokkel)
    auth.uid(),
    s.type,
    s.nokkel,
    case when s.kan then 2 else 0 end,
    public.minne_i_dag() + public.minne_intervall(case when s.kan then 2 else 0 end),
    now()
  from jsonb_to_recordset(p_svar) as s (type text, nokkel text, kan boolean)
  where s.type in ('kort', 'sporsmal') and s.nokkel is not null and s.kan is not null
  order by s.type, s.nokkel, s.kan
  on conflict (bruker_id, type, nokkel) do update
    set steg = case
          when excluded.steg = 0 then 0
          when public.minne.forfaller <= public.minne_i_dag() then least(public.minne.steg + 1, 6)
          else public.minne.steg
        end,
        forfaller = case
          when excluded.steg = 0 then public.minne_i_dag() + 1
          when public.minne.forfaller <= public.minne_i_dag()
            then public.minne_i_dag() + public.minne_intervall(least(public.minne.steg + 1, 6))
          else public.minne.forfaller
        end,
        sist_ovd = now();
$$;

-- Det eleven skal repetere i dag, det svakeste først. Kort og spørsmål som ikke
-- finnes lenger, er ikke med. Reglene på flashcards og quiz_sporsmal gjelder, så
-- uten abonnement er lista tom.
create function public.repetisjon_i_dag()
returns table (type text, nokkel text)
language sql
stable
security invoker
set search_path = ''
as $$
  select m.type, m.nokkel
  from public.minne m
  where m.bruker_id = auth.uid()
    and m.forfaller <= public.minne_i_dag()
    and case m.type
      when 'kort' then exists (select 1 from public.flashcards f where f.minne = m.nokkel)
      else exists (select 1 from public.quiz_sporsmal q where q.minne = m.nokkel)
    end
  order by m.steg, m.forfaller, m.nokkel;
$$;

revoke execute on function public.minne_i_dag() from public, anon;
revoke execute on function public.minne_intervall(int) from public, anon;
revoke execute on function public.husk_svar(jsonb) from public, anon;
revoke execute on function public.repetisjon_i_dag() from public, anon;
grant execute on function public.minne_i_dag() to authenticated;
grant execute on function public.minne_intervall(int) to authenticated;
grant execute on function public.husk_svar(jsonb) to authenticated;
grant execute on function public.repetisjon_i_dag() to authenticated;
