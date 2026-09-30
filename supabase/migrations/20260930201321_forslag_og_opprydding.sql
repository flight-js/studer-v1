-- Forslag fra brukerne, og opprydding som personvernerklæringen lover.
--
-- 1. forslag: innloggede kan foreslå nytt innhold, nye funksjoner og
--    forbedringer. De kan bare sende inn, ikke lese – forslagene leses med
--    npm run forslag (secret-nøkkelen). Maks 10 per bruker per døgn.
-- 2. Opprydding hver natt (pg_cron): prøveperiode-kontrollen slettes etter
--    2 år, og de daglige AI-tellerne etter 90 dager.

-- Forslag --------------------------------------------------------------------------

create table public.forslag (
  id bigint generated always as identity primary key,
  bruker_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('innhold', 'funksjon', 'forbedring', 'annet')),
  tekst text not null check (char_length(btrim(tekst)) between 5 and 2000),
  opprettet timestamptz not null default now()
);

create index forslag_bruker_id_idx on public.forslag (bruker_id, opprettet);

alter table public.forslag enable row level security;
revoke all on public.forslag from anon, authenticated;
grant insert (type, tekst) on public.forslag to authenticated;

create policy "Innloggede kan sende forslag" on public.forslag
  for insert to authenticated
  with check (bruker_id = (select auth.uid()));

-- Sperre mot spam. security definer fordi eleven ikke kan lese forslagene.
create function public.forslag_grense()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    select count(*) from public.forslag
    where bruker_id = new.bruker_id and opprettet > now() - interval '1 day'
  ) >= 10 then
    raise exception 'For mange forslag det siste døgnet' using hint = 'grense';
  end if;
  return new;
end;
$$;

revoke execute on function public.forslag_grense() from public, anon, authenticated;

create trigger forslag_grense
  before insert on public.forslag
  for each row execute function public.forslag_grense();

-- Opprydding ------------------------------------------------------------------------

create extension if not exists pg_cron;

select cron.schedule(
  'rydd-gamle-data',
  '15 3 * * *',
  $$
    delete from public.provetid where opprettet < now() - interval '2 years';
    delete from public.ai_bruk where dato < current_date - 90;
  $$
);
