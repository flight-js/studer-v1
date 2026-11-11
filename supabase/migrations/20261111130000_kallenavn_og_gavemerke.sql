-- To ting:
--   A. Fartsgrenser for kallenavn (under).
--   B. Merket «Gavmild»: tjenes når en venn løser inn en gratis uke eleven har
--      gitt (nederst).
--
-- A. Fartsgrenser for kallenavn, i tillegg til de som finnes (10 sjekker med
-- språkmodellen per elev per døgn, 5000 for hele appen):
--
-- 1. Høyst 3 forsøk per minutt per elev – også forsøk som stoppes av
--    ordlistene, så ingen kan hamre løs på serverfunksjonen.
-- 2. Høyst 3 nye kallenavn per 7 dager. Ellers kunne noen skrevet beskjeder
--    til andre på rangeringene ved å bytte navn ord for ord. Å fjerne
--    kallenavnet (eller velge «Ikke vis meg») er alltid lov.
--
-- Bare tidspunktene lagres, aldri navnene. Forsøkene slettes etter et døgn og
-- byttene etter 30 dager (nattjobb nederst).

create table public.kallenavn_forsok (
  id bigint generated always as identity primary key,
  bruker_id uuid not null references auth.users (id) on delete cascade,
  tidspunkt timestamptz not null default now()
);
create index kallenavn_forsok_bruker on public.kallenavn_forsok (bruker_id, tidspunkt);
alter table public.kallenavn_forsok enable row level security;
revoke all on public.kallenavn_forsok from anon, authenticated;

create table public.kallenavn_endringer (
  id bigint generated always as identity primary key,
  bruker_id uuid not null references auth.users (id) on delete cascade,
  tidspunkt timestamptz not null default now()
);
create index kallenavn_endringer_bruker on public.kallenavn_endringer (bruker_id, tidspunkt);
alter table public.kallenavn_endringer enable row level security;
revoke all on public.kallenavn_endringer from anon, authenticated;

-- Kalles av serverfunksjonen «kallenavn» før hvert forsøk på et nytt navn.
-- Teller forsøket og svarer:
--   ok      – fortsett
--   minutt  – for mange forsøk det siste minuttet (neste: når det går igjen)
--   uke     – har byttet p_per_uke ganger de siste 7 dagene (neste: når det går igjen)
-- Et forsøk som stoppes, telles ikke, så eleven slipper til når tiden er ute.
create function public.kallenavn_tempo(p_bruker uuid, p_per_minutt int, p_per_uke int)
returns table (utfall text, neste timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_eldste timestamptz;
begin
  perform pg_advisory_xact_lock(hashtextextended('kallenavn:' || p_bruker::text, 0));

  select min(f.tidspunkt) into v_eldste
  from (
    select k.tidspunkt from public.kallenavn_forsok k
    where k.bruker_id = p_bruker and k.tidspunkt > now() - interval '1 minute'
    order by k.tidspunkt desc
    limit greatest(p_per_minutt, 1)
  ) f
  having count(*) >= p_per_minutt;
  if v_eldste is not null then
    return query select 'minutt'::text, v_eldste + interval '1 minute';
    return;
  end if;

  select min(e.tidspunkt) into v_eldste
  from (
    select k.tidspunkt from public.kallenavn_endringer k
    where k.bruker_id = p_bruker and k.tidspunkt > now() - interval '7 days'
    order by k.tidspunkt desc
    limit greatest(p_per_uke, 1)
  ) e
  having count(*) >= p_per_uke;
  if v_eldste is not null then
    return query select 'uke'::text, v_eldste + interval '7 days';
    return;
  end if;

  insert into public.kallenavn_forsok (bruker_id) values (p_bruker);
  return query select 'ok'::text, null::timestamptz;
end;
$$;

revoke execute on function public.kallenavn_tempo(uuid, int, int) from public, anon, authenticated;

-- Databasen håndhever bytte-grensen selv også, når et nytt kallenavn lagres
-- (samme trigger som sjekker ordlistene). Grensen her (3 per 7 dager) må
-- stemme med KALLENAVN_BYTTER_UKE i serverfunksjonen.
create or replace function public.sjekk_kallenavn()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_feil text;
  v_bytter int;
begin
  new.kallenavn := nullif(regexp_replace(trim(coalesce(new.kallenavn, '')), '\s+', ' ', 'g'), '');
  if new.kallenavn is not null then
    v_feil := public.kallenavn_feil(new.kallenavn);
    if v_feil is not null then
      raise exception using errcode = '23514', message = v_feil;
    end if;
    if tg_op = 'UPDATE' and new.kallenavn is distinct from old.kallenavn then
      select count(*) into v_bytter from public.kallenavn_endringer e
      where e.bruker_id = new.id and e.tidspunkt > now() - interval '7 days';
      if v_bytter >= 3 then
        raise exception using errcode = '23514',
          message = 'Du har byttet kallenavn tre ganger den siste uka. Prøv igjen senere.';
      end if;
      insert into public.kallenavn_endringer (bruker_id) values (new.id);
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function public.sjekk_kallenavn() from public, anon, authenticated;

-- Forsøk eldre enn et døgn og bytter eldre enn 30 dager slettes hver natt.
select cron.schedule(
  'rydd-kallenavntempo',
  '25 3 * * *',
  $$ delete from public.kallenavn_forsok where tidspunkt < now() - interval '1 day';
     delete from public.kallenavn_endringer where tidspunkt < now() - interval '30 days'; $$
);

-- B. Merket «Gavmild» (merke-gave): eleven har gitt en venn en gratis uke, og
-- vennen har løst den inn (vennegaver.status = 'brukt'). Resten er som før.
-- Navn og ikon står i src/lib/merker.ts og Navnemerke.tsx.
create or replace function public.merke_fremgang(p_bruker uuid)
returns table (merke text, verdi int, mal int)
language sql
stable
security definer
set search_path = ''
as $$
  with lengste as (
    select coalesce(max(r.lengde), 0) as n from public.rekker(p_bruker) r
  ), kort as (
    select count(*)::int as n from public.minne m where m.bruker_id = p_bruker and m.type = 'kort'
  ), rekorder as (
    select count(*)::int as n from public.poeng_logg l where l.bruker_id = p_bruker and l.grunn = 'rekord'
  ), ovd as (
    select
      (count(*) filter (where f.aktivitet = 'quiz' and f.beste = f.av))::int as feilfri,
      (count(distinct f.tema_id))::int as temaer,
      (count(*) filter (where f.aktivitet = 'miniprove'))::int as prover
    from public.fremdrift f where f.bruker_id = p_bruker
  ), gaver as (
    select count(*)::int as n from public.vennegaver v where v.giver = p_bruker and v.status = 'brukt'
  )
  select v.merke, v.verdi, v.mal from (values
    ('merke-uke', (select n from lengste), 7),
    ('merke-maaned', (select n from lengste), 30),
    ('merke-kort', (select n from kort), 100),
    ('merke-tusen', (select n from kort), 1000),
    ('merke-rekord', (select n from rekorder), 1),
    ('merke-feilfri', (select feilfri from ovd), 1),
    ('merke-temaer', (select temaer from ovd), 10),
    ('merke-prove', (select prover from ovd), 1),
    ('merke-gave', (select n from gaver), 1)
  ) as v (merke, verdi, mal);
$$;

revoke execute on function public.merke_fremgang(uuid) from public, anon, authenticated;
