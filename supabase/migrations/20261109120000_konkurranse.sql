-- UTKAST (ikke kjørt): konkurranse på Studer – poeng, rangeringer, skoler og
-- belønninger som kan løses inn hos partnere.
--
-- Prinsipper:
-- - Poeng tjenes bare på serveren: når lagre_resultat lagrer en fullført øving,
--   og når en formelmatch-runde avsluttes. Eleven kan aldri skrive poeng selv.
-- - Tak: hver øving (tema + aktivitet) gir poeng høyst én gang per døgn, og
--   høyst 150 poeng per døgn til sammen (dagsbonus inkludert). Flashcards gir
--   ikke poeng: eleven svarer selv «Kan dette», så det kan ikke sjekkes.
-- - Poengene har ingen pengeverdi, kan ikke kjøpes eller overføres, og kan
--   løses inn i belønninger (se vilkårene).
-- - Eleven velger bare skole. Rangeringer viser fornavnet (første ord i navnet
--   fra registreringen) og skolen, og bare for elever som selv har slått på
--   «Vis fornavnet mitt på rangeringene» – det er av som standard. Skolelista
--   teller alle med valgt skole, men viser bare tall per skole.
--
-- Etter migrasjonen: last inn supabase/skoler.sql (npm run skoler lager den).
-- Belønninger og koder legges inn av Studer med service_role (se nederst).

create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------- Skoler

create table public.skoler (
  id text primary key, -- organisasjonsnummer i Nasjonalt skoleregister
  navn text not null,
  kommune text not null default '',
  fylke text not null default '',
  ungdomstrinn boolean not null default false,
  vgs boolean not null default false,
  aktiv boolean not null default true
);

create index skoler_navn_trgm on public.skoler using gin (navn extensions.gin_trgm_ops);

alter table public.skoler enable row level security;
revoke all on public.skoler from anon, authenticated;
grant select on public.skoler to authenticated;

create policy "Innloggede kan lese aktive skoler" on public.skoler
  for select to authenticated using (aktiv);

-- ---------------------------------------------------------------- Profil

alter table public.profiles
  add column skole_id text references public.skoler (id) on delete set null,
  add column vis_pa_rangering boolean not null default false;

grant update (skole_id, vis_pa_rangering) on public.profiles to authenticated;

-- Navnet som vises på rangeringene: fornavnet (første ord i navnet).
create function public.visningsnavn(p_navn text)
returns text
language sql
immutable
set search_path = ''
as $$
  select coalesce(nullif(split_part(trim(coalesce(p_navn, '')), ' ', 1), ''), 'Elev');
$$;

-- ---------------------------------------------------------------- Belønninger

create table public.belonninger (
  id uuid primary key default gen_random_uuid(),
  partner text not null,
  tittel text not null,
  beskrivelse text not null default '',
  vilkar text not null default '', -- partnerens vilkår, for eksempel minstebeløp
  lenke text, -- nettsiden der koden brukes
  poengpris int not null check (poengpris > 0),
  gyldig_til date,
  aktiv boolean not null default true,
  opprettet timestamptz not null default now()
);

alter table public.belonninger enable row level security;
revoke all on public.belonninger from anon, authenticated;
-- Leses gjennom belonninger_med_lager(), som også viser hvor mange koder som er igjen.

create table public.kuponger (
  id bigint generated always as identity primary key,
  belonning_id uuid not null references public.belonninger (id) on delete cascade,
  kode text not null,
  bruker_id uuid references auth.users (id) on delete set null,
  innlost timestamptz,
  unique (belonning_id, kode)
);

create index kuponger_ledige on public.kuponger (belonning_id) where bruker_id is null;
create index kuponger_bruker on public.kuponger (bruker_id) where bruker_id is not null;

alter table public.kuponger enable row level security;
revoke all on public.kuponger from anon, authenticated;
-- Ingen direkte tilgang: koder deles bare ut av los_inn() og leses med mine_kuponger().

-- ---------------------------------------------------------------- Poeng

create table public.poeng_logg (
  id bigint generated always as identity primary key,
  bruker_id uuid not null references auth.users (id) on delete cascade,
  endring int not null,
  grunn text not null check (grunn in ('oving', 'dagsbonus', 'formelmatch', 'innlosning', 'korrigering')),
  tema_id text,
  aktivitet text,
  belonning_id uuid references public.belonninger (id) on delete set null,
  dag date not null default public.minne_i_dag(),
  tidspunkt timestamptz not null default now()
);

create index poeng_logg_bruker_dag on public.poeng_logg (bruker_id, dag);
create index poeng_logg_dag on public.poeng_logg (dag) where endring > 0;
-- Samme øving gir poeng høyst én gang per døgn.
create unique index poeng_logg_en_gang_per_dag on public.poeng_logg (bruker_id, tema_id, aktivitet, dag)
  where grunn in ('oving', 'formelmatch');
create unique index poeng_logg_en_dagsbonus on public.poeng_logg (bruker_id, dag) where grunn = 'dagsbonus';

alter table public.poeng_logg enable row level security;
revoke all on public.poeng_logg from anon, authenticated;
grant select on public.poeng_logg to authenticated;

create policy "Brukere kan lese egne poeng" on public.poeng_logg
  for select to authenticated using ((select auth.uid()) = bruker_id);

-- Hvor mange dager på rad eleven har tjent poeng (i dag eller i går må være med).
create function public.poeng_streak(p_bruker uuid)
returns int
language sql
stable
security definer
set search_path = ''
as $$
  with dager as (
    select distinct l.dag from public.poeng_logg l
    where l.bruker_id = p_bruker and l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch')
  ), grupper as (
    select dag, dag - (row_number() over (order by dag))::int as gruppe from dager
  ), rekker as (
    select max(dag) as slutt, count(*)::int as lengde from grupper group by gruppe
  )
  select coalesce(
    (select lengde from rekker where slutt >= public.minne_i_dag() - 1 order by slutt desc limit 1),
    0
  );
$$;

-- Gir poeng for en fullført øving. Kalles bare fra lagre_resultat og
-- avslutt_formelmatch – aldri direkte av eleven.
create function public.gi_poeng(p_bruker uuid, p_tema_id text, p_aktivitet text, p_resultat numeric, p_av int)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dag date := public.minne_i_dag();
  v_tak constant int := 150;
  v_andel numeric := case when p_av > 0 then least(greatest(p_resultat / p_av, 0), 1) else 0 end;
  v_grunnpoeng int;
  v_bonus int := 0;
  v_tjent int;
  v_poeng int;
  v_rader int;
begin
  -- Bare øvinger der svarene sjekkes, gir poeng. Flashcards gir ikke poeng,
  -- for der svarer eleven selv om hen kan kortet.
  v_grunnpoeng := case p_aktivitet
    when 'quiz' then 10 + round(5 * v_andel)::int
    when 'miniprove' then 15 + round(10 * v_andel)::int
    when 'formelmatch' then 10
    else 0
  end;
  if v_grunnpoeng = 0 then
    return 0;
  end if;

  if exists (
    select 1 from public.poeng_logg l
    where l.bruker_id = p_bruker and l.tema_id = p_tema_id and l.aktivitet = p_aktivitet
      and l.dag = v_dag and l.grunn in ('oving', 'formelmatch')
  ) then
    return 0;
  end if;

  -- Dagens første øving: 5 poeng + 1 per dag på rad (høyst 15).
  if not exists (select 1 from public.poeng_logg l where l.bruker_id = p_bruker and l.dag = v_dag and l.grunn = 'dagsbonus') then
    v_bonus := least(5 + public.poeng_streak(p_bruker), 15);
  end if;

  select coalesce(sum(l.endring), 0) into v_tjent
  from public.poeng_logg l
  where l.bruker_id = p_bruker and l.dag = v_dag and l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch');

  v_bonus := least(v_bonus, greatest(v_tak - v_tjent, 0));
  v_poeng := least(v_grunnpoeng, greatest(v_tak - v_tjent - v_bonus, 0));

  -- To innsendinger samtidig skal ikke gi poeng to ganger – og ikke gi en feil
  -- som ruller tilbake selve resultatet. Derfor «do nothing» ved konflikt.
  if v_bonus > 0 then
    insert into public.poeng_logg (bruker_id, endring, grunn) values (p_bruker, v_bonus, 'dagsbonus')
    on conflict (bruker_id, dag) where grunn = 'dagsbonus' do nothing;
    get diagnostics v_rader = row_count;
    if v_rader = 0 then
      v_bonus := 0;
    end if;
  end if;
  if v_poeng > 0 then
    insert into public.poeng_logg (bruker_id, endring, grunn, tema_id, aktivitet)
    values (p_bruker, v_poeng, case when p_aktivitet = 'formelmatch' then 'formelmatch' else 'oving' end, p_tema_id, p_aktivitet)
    on conflict (bruker_id, tema_id, aktivitet, dag) where grunn in ('oving', 'formelmatch') do nothing;
    get diagnostics v_rader = row_count;
    if v_rader = 0 then
      v_poeng := 0;
    end if;
  end if;
  return v_bonus + v_poeng;
end;
$$;

-- lagre_resultat lagrer fremdriften som før, men sjekker nå resultatet og gir
-- poeng. Den er security definer fordi poengene ikke kan skrives av eleven;
-- derfor sjekker den selv innlogging, tilgang og at temaet finnes.
-- Returnerer poengene eleven fikk (0 når taket er nådd eller øvingen er tatt i dag).
drop function public.lagre_resultat(text, text, numeric, int);

create function public.lagre_resultat(p_tema_id text, p_aktivitet text, p_resultat numeric, p_av int)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bruker uuid := auth.uid();
begin
  if v_bruker is null then
    raise exception 'Ikke innlogget';
  end if;
  if p_aktivitet not in ('flashcards', 'quiz', 'miniprove') then
    raise exception 'Ukjent aktivitet: %', p_aktivitet;
  end if;
  if p_av is null or p_av < 1 or p_av > 500 or p_resultat is null or p_resultat < 0 or p_resultat > p_av then
    raise exception 'Ugyldig resultat';
  end if;
  if not public.har_tilgang() then
    raise exception 'Krever abonnement';
  end if;
  if not exists (select 1 from public.temaer t where t.id = p_tema_id and t.publisert) then
    raise exception 'Ukjent tema';
  end if;

  insert into public.fremdrift (bruker_id, tema_id, aktivitet, beste, av, sist_ovd)
  values (v_bruker, p_tema_id, p_aktivitet, p_resultat, p_av, now())
  on conflict (bruker_id, tema_id, aktivitet) do update
    set beste = case
          when excluded.av <> public.fremdrift.av then excluded.beste
          else greatest(public.fremdrift.beste, excluded.beste)
        end,
        av = excluded.av,
        sist_ovd = now();

  return public.gi_poeng(v_bruker, p_tema_id, p_aktivitet, p_resultat, p_av);
end;
$$;

-- ---------------------------------------------------------------- Formelmatch

-- Tiden måles også på serveren: start_formelmatch kalles når klokka starter,
-- avslutt_formelmatch når siste par er koblet. Bare runder med alle formlene i
-- temaet (høyst 12) teller på rangeringen.
create table public.formelmatch_runder (
  id uuid primary key default gen_random_uuid(),
  bruker_id uuid not null references auth.users (id) on delete cascade,
  tema_id text not null references public.temaer (id) on delete cascade,
  startet timestamptz not null default now(),
  ferdig timestamptz,
  tid_ms int,
  par int,
  straffer int,
  teller boolean not null default false
);

create index formelmatch_runder_tema on public.formelmatch_runder (tema_id, tid_ms) where teller;
create index formelmatch_runder_bruker on public.formelmatch_runder (bruker_id, startet);

alter table public.formelmatch_runder enable row level security;
revoke all on public.formelmatch_runder from anon, authenticated;
grant select on public.formelmatch_runder to authenticated;

create policy "Brukere kan lese egne formelmatch-runder" on public.formelmatch_runder
  for select to authenticated using ((select auth.uid()) = bruker_id);

create function public.start_formelmatch(p_tema_id text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bruker uuid := auth.uid();
  v_id uuid;
begin
  if v_bruker is null then
    raise exception 'Ikke innlogget';
  end if;
  if not public.har_tilgang() then
    raise exception 'Krever abonnement';
  end if;
  if not exists (select 1 from public.temaer t where t.id = p_tema_id and t.publisert and t.antall_formler > 0) then
    raise exception 'Temaet har ikke formelmatch';
  end if;
  -- Enkel sperre mot automatiske runder.
  if (select count(*) from public.formelmatch_runder r where r.bruker_id = v_bruker and r.startet > now() - interval '1 hour') >= 60 then
    raise exception 'For mange runder på kort tid';
  end if;
  insert into public.formelmatch_runder (bruker_id, tema_id) values (v_bruker, p_tema_id) returning id into v_id;
  return v_id;
end;
$$;

create function public.avslutt_formelmatch(p_runde uuid, p_tid_ms int, p_par int, p_straffer int)
returns table (tid_ms int, teller boolean, forrige_beste int, poeng int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bruker uuid := auth.uid();
  v_runde public.formelmatch_runder;
  v_antall int;
  v_brukt int;
  v_tid int;
  v_min int;
  v_teller boolean;
  v_forrige int;
begin
  select * into v_runde from public.formelmatch_runder r
  where r.id = p_runde and r.bruker_id = v_bruker and r.ferdig is null
  for update;
  if not found then
    raise exception 'Fant ikke runden';
  end if;

  v_brukt := (extract(epoch from now() - v_runde.startet) * 1000)::int;
  if v_brukt > 30 * 60 * 1000 then
    raise exception 'Runden er for gammel';
  end if;

  select least(t.antall_formler, 12) into v_antall from public.temaer t where t.id = v_runde.tema_id;
  -- Eleven kan ikke oppgi kortere tid enn det serveren har målt (minus litt
  -- for nettverket), og ingen klarer et par på under 0,6 sekunder.
  v_tid := greatest(coalesce(p_tid_ms, 0), v_brukt - 3000);
  v_min := greatest(coalesce(p_par, 0), 1) * 600;
  v_teller := coalesce(p_par, 0) >= v_antall and v_tid >= v_min;

  select min(r.tid_ms) into v_forrige from public.formelmatch_runder r
  where r.bruker_id = v_bruker and r.tema_id = v_runde.tema_id and r.teller;

  update public.formelmatch_runder r
  set ferdig = now(), tid_ms = v_tid, par = p_par, straffer = p_straffer, teller = v_teller
  where r.id = p_runde;

  return query select v_tid, v_teller, v_forrige, public.gi_poeng(v_bruker, v_runde.tema_id, 'formelmatch', 1, 1);
end;
$$;

-- Topplisten for et tema: beste tid per elev. Eleven ser alltid seg selv, også
-- når hen ikke er synlig for andre.
create function public.formelmatch_toppliste(p_tema_id text, p_antall int default 10)
returns table (plass int, navn text, skole text, tid_ms int, er_meg boolean, antall int)
language sql
stable
security definer
set search_path = ''
as $$
  with beste as (
    select r.bruker_id, min(r.tid_ms) as tid_ms
    from public.formelmatch_runder r
    where r.tema_id = p_tema_id and r.teller
    group by r.bruker_id
  ), synlige as (
    select b.bruker_id, b.tid_ms, s.navn as skole,
           case when p.vis_pa_rangering then public.visningsnavn(p.navn) else 'Deg' end as navn
    from beste b
    join public.profiles p on p.id = b.bruker_id
    left join public.skoler s on s.id = p.skole_id
    where p.vis_pa_rangering or b.bruker_id = auth.uid()
  ), rangert as (
    select rank() over (order by tid_ms)::int as plass, navn, skole, tid_ms,
           bruker_id = auth.uid() as er_meg, (count(*) over ())::int as antall
    from synlige
  )
  select plass, navn, skole, tid_ms, er_meg, antall
  from rangert
  where plass <= least(greatest(p_antall, 1), 50) or er_meg
  order by plass, navn;
$$;

-- ---------------------------------------------------------------- Rangeringer

-- Ukeslista: poeng tjent denne uka (mandag–søndag, norsk tid). Innløste poeng
-- trekkes ikke fra. p_omrade: 'alle', 'skole' eller 'trinn'.
create function public.poengliste(p_omrade text default 'alle', p_antall int default 50)
returns table (plass int, navn text, skole text, poeng int, er_meg boolean)
language sql
stable
security definer
set search_path = ''
as $$
  with uke as (
    select date_trunc('week', public.minne_i_dag())::date as fra
  ), meg as (
    select p.skole_id, p.trinn from public.profiles p where p.id = auth.uid()
  ), summer as (
    select l.bruker_id, sum(l.endring)::int as poeng
    from public.poeng_logg l, uke
    where l.dag >= uke.fra and l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch')
    group by l.bruker_id
  ), synlige as (
    select s.bruker_id, s.poeng, sk.navn as skole,
           case when p.vis_pa_rangering then public.visningsnavn(p.navn) else 'Deg' end as navn
    from summer s
    join public.profiles p on p.id = s.bruker_id
    left join public.skoler sk on sk.id = p.skole_id
    where (p.vis_pa_rangering or s.bruker_id = auth.uid())
      and case p_omrade
        when 'skole' then p.skole_id = (select skole_id from meg)
        when 'trinn' then p.trinn = (select trinn from meg)
        else true
      end
  ), rangert as (
    select rank() over (order by poeng desc)::int as plass, navn, skole, poeng, bruker_id = auth.uid() as er_meg
    from synlige
  )
  select plass, navn, skole, poeng, er_meg
  from rangert
  where plass <= least(greatest(p_antall, 1), 100) or er_meg
  order by plass, navn;
$$;

-- Skolelista denne uka: snitt per aktiv elev (så små skoler kan vinne), bare
-- skoler med minst tre elever som har tjent poeng. Alle med valgt skole teller,
-- fordi lista bare viser tall per skole og aldri hvem som er med.
create function public.skoleliste(p_antall int default 20)
returns table (plass int, skole_id text, skole text, kommune text, elever int, poeng int, snitt int, er_min boolean)
language sql
stable
security definer
set search_path = ''
as $$
  with uke as (
    select date_trunc('week', public.minne_i_dag())::date as fra
  ), summer as (
    select l.bruker_id, sum(l.endring)::int as poeng
    from public.poeng_logg l, uke
    where l.dag >= uke.fra and l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch')
    group by l.bruker_id
  ), per_skole as (
    select p.skole_id, count(*)::int as elever, sum(s.poeng)::int as poeng
    from summer s
    join public.profiles p on p.id = s.bruker_id
    where p.skole_id is not null
    group by p.skole_id
    having count(*) >= 3
  ), rangert as (
    select rank() over (order by (ps.poeng::numeric / ps.elever) desc)::int as plass,
           ps.skole_id, sk.navn as skole, sk.kommune, ps.elever, ps.poeng,
           round(ps.poeng::numeric / ps.elever)::int as snitt,
           ps.skole_id = (select p.skole_id from public.profiles p where p.id = auth.uid()) as er_min
    from per_skole ps
    join public.skoler sk on sk.id = ps.skole_id
  )
  select * from rangert
  where plass <= least(greatest(p_antall, 1), 100) or er_min
  order by plass;
$$;

-- Elevens egen status: saldo (tjent minus innløst), denne uka, i dag og dager på rad.
create function public.min_poengstatus()
returns table (saldo int, denne_uka int, i_dag int, tak int, streak int)
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce(sum(l.endring), 0)::int,
    coalesce(sum(l.endring) filter (
      where l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch')
        and l.dag >= date_trunc('week', public.minne_i_dag())::date
    ), 0)::int,
    coalesce(sum(l.endring) filter (
      where l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch') and l.dag = public.minne_i_dag()
    ), 0)::int,
    150,
    public.poeng_streak(auth.uid())
  from public.poeng_logg l
  where l.bruker_id = auth.uid();
$$;

-- ---------------------------------------------------------------- Innløsning

create function public.belonninger_med_lager()
returns table (
  id uuid, partner text, tittel text, beskrivelse text, vilkar text, lenke text,
  poengpris int, gyldig_til date, igjen int, innlost_av_meg boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select b.id, b.partner, b.tittel, b.beskrivelse, b.vilkar, b.lenke, b.poengpris, b.gyldig_til,
         (select count(*)::int from public.kuponger k where k.belonning_id = b.id and k.bruker_id is null),
         exists (select 1 from public.kuponger k where k.belonning_id = b.id and k.bruker_id = auth.uid())
  from public.belonninger b
  where b.aktiv and (b.gyldig_til is null or b.gyldig_til >= public.minne_i_dag())
  order by b.poengpris, b.tittel;
$$;

-- Løser inn en belønning: trekker poengene og deler ut en ledig kode, alt i én
-- transaksjon. Låsen per elev hindrer at samme poeng brukes to ganger.
create function public.los_inn(p_belonning uuid)
returns table (kode text, partner text, lenke text, saldo int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bruker uuid := auth.uid();
  v_b public.belonninger;
  v_saldo int;
  v_kode text;
begin
  if v_bruker is null then
    raise exception 'Ikke innlogget';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_bruker::text, 0));

  select * into v_b from public.belonninger b
  where b.id = p_belonning and b.aktiv and (b.gyldig_til is null or b.gyldig_til >= public.minne_i_dag());
  if not found then
    raise exception 'Belønningen finnes ikke lenger';
  end if;
  if exists (select 1 from public.kuponger k where k.belonning_id = p_belonning and k.bruker_id = v_bruker) then
    raise exception 'Du har allerede løst inn denne belønningen';
  end if;
  -- Nye kontoer kan ikke løse inn med en gang, så det ikke lønner seg å lage
  -- mange kontoer for å samle koder.
  if (select p.opprettet from public.profiles p where p.id = v_bruker) > now() - interval '7 days' then
    raise exception 'Kontoen må være minst en uke gammel før du kan løse inn';
  end if;

  select coalesce(sum(l.endring), 0) into v_saldo from public.poeng_logg l where l.bruker_id = v_bruker;
  if v_saldo < v_b.poengpris then
    raise exception 'Du har ikke nok poeng';
  end if;

  update public.kuponger k
  set bruker_id = v_bruker, innlost = now()
  where k.id = (
    select k2.id from public.kuponger k2
    where k2.belonning_id = p_belonning and k2.bruker_id is null
    order by k2.id
    limit 1
    for update skip locked
  )
  returning k.kode into v_kode;
  if v_kode is null then
    raise exception 'Belønningen er utsolgt';
  end if;

  insert into public.poeng_logg (bruker_id, endring, grunn, belonning_id)
  values (v_bruker, -v_b.poengpris, 'innlosning', p_belonning);

  return query select v_kode, v_b.partner, v_b.lenke, v_saldo - v_b.poengpris;
end;
$$;

create function public.mine_kuponger()
returns table (kode text, partner text, tittel text, lenke text, vilkar text, gyldig_til date, innlost timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select k.kode, b.partner, b.tittel, b.lenke, b.vilkar, b.gyldig_til, k.innlost
  from public.kuponger k
  join public.belonninger b on b.id = k.belonning_id
  where k.bruker_id = auth.uid()
  order by k.innlost desc;
$$;

-- ---------------------------------------------------------------- Rettigheter

revoke execute on function public.poeng_streak(uuid) from public, anon, authenticated;
revoke execute on function public.visningsnavn(text) from public, anon, authenticated;
revoke execute on function public.gi_poeng(uuid, text, text, numeric, int) from public, anon, authenticated;

revoke execute on function public.lagre_resultat(text, text, numeric, int) from public, anon;
revoke execute on function public.start_formelmatch(text) from public, anon;
revoke execute on function public.avslutt_formelmatch(uuid, int, int, int) from public, anon;
revoke execute on function public.formelmatch_toppliste(text, int) from public, anon;
revoke execute on function public.poengliste(text, int) from public, anon;
revoke execute on function public.skoleliste(int) from public, anon;
revoke execute on function public.min_poengstatus() from public, anon;
revoke execute on function public.belonninger_med_lager() from public, anon;
revoke execute on function public.los_inn(uuid) from public, anon;
revoke execute on function public.mine_kuponger() from public, anon;

grant execute on function public.lagre_resultat(text, text, numeric, int) to authenticated;
grant execute on function public.start_formelmatch(text) to authenticated;
grant execute on function public.avslutt_formelmatch(uuid, int, int, int) to authenticated;
grant execute on function public.formelmatch_toppliste(text, int) to authenticated;
grant execute on function public.poengliste(text, int) to authenticated;
grant execute on function public.skoleliste(int) to authenticated;
grant execute on function public.min_poengstatus() to authenticated;
grant execute on function public.belonninger_med_lager() to authenticated;
grant execute on function public.los_inn(uuid) to authenticated;
grant execute on function public.mine_kuponger() to authenticated;

-- ---------------------------------------------------------------- Slik legges belønninger inn
--
-- Bare etter avtale med en ekte partner, og bare tilbud som passer for elever
-- fra 13 år (ikke alkohol, tobakk/snus, energidrikk, pengespill, kosmetiske
-- inngrep eller kredittkjøp). Ingen trekninger eller tilfeldige premier.
--
--   insert into public.belonninger (partner, tittel, beskrivelse, vilkar, lenke, poengpris, gyldig_til)
--   values ('Partner AS', '20 % rabatt', 'Gjelder hele nettbutikken.', 'Minstekjøp 200 kr.', 'https://…', 1500, '2027-06-30')
--   returning id;
--
--   insert into public.kuponger (belonning_id, kode) values ('<id>', 'KODE1'), ('<id>', 'KODE2');
