-- Oppfølging av konkurransemigrasjonen (kjørt 11.11.2026):
--
-- 1. Personvern som standard (personvernforordningen art. 25 nr. 2): ingen vises
--    på rangeringene før de selv velger å vise fornavnet eller et kallenavn.
--    Rangeringene kan ses av alle med konto, altså et ubegrenset antall
--    personer. Grunnlaget for å vise navnet er samtykke (art. 6 nr. 1 a), og
--    elever fra 13 år kan samtykke selv (personopplysningsloven § 5).
-- 2. Tellerne for kallenavnsjekk slettes etter 90 dager, som de andre tellerne
--    for AI-bruk (personvernerklæringen, «Hvor lenge vi lagrer»).
-- 3. mine_merker: kom to kall samtidig (for eksempel etter en øving mens
--    samlingen er åpen), kunne det ene si at et merke ikke var tjent, fordi
--    spørringen ikke så raden det andre kallet nettopp hadde lagt inn. Nå leses
--    merkene i en egen setning etter innsettingen, så de alltid er med.

alter table public.profiles alter column skjul_fornavn set default true;

-- Konkurransen er ikke lansert, så ingen har valgt ennå: alle som står på
-- standarden fra forrige migrasjon («vis fornavnet»), settes til skjult.
update public.profiles set skjul_fornavn = true where skjul_fornavn = false;

select cron.schedule(
  'rydd-kallenavnsjekker',
  '20 3 * * *',
  $$ delete from public.kallenavn_sjekker where dag < current_date - 90; $$
);

-- Merkene med fremgang for den innloggede eleven. Deler samtidig ut merker
-- eleven har nådd. tjent: når merket ble delt ut (null = ikke ennå).
-- ny: delt ut i dette kallet, så appen kan vise «Nytt merke».
create or replace function public.mine_merker()
returns table (merke text, verdi int, mal int, tjent timestamptz, ny boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bruker uuid := auth.uid();
  v_nye text[];
begin
  if v_bruker is null then
    raise exception 'Ikke innlogget';
  end if;

  with nye as (
    insert into public.eiendeler (bruker_id, ting)
    select v_bruker, f.merke from public.merke_fremgang(v_bruker) f where f.verdi >= f.mal
    on conflict do nothing
    returning eiendeler.ting
  )
  select coalesce(array_agg(nye.ting), '{}') into v_nye from nye;

  -- Ny setning: ser både radene over og rader et samtidig kall har lagt inn.
  return query
  select f.merke, least(f.verdi, f.mal), f.mal, e.kjopt, f.merke = any (v_nye)
  from public.merke_fremgang(v_bruker) f
  left join public.eiendeler e on e.bruker_id = v_bruker and e.ting = f.merke;
end;
$$;

revoke execute on function public.mine_merker() from public, anon;
grant execute on function public.mine_merker() to authenticated;
