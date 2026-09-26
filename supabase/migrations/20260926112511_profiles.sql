-- Profil per bruker: appspesifikke opplysninger som ikke hører hjemme i auth.users.
--
-- Brukeren kan lese sin egen profil og endre navn og trinn, men aldri
-- abonnement. Det settes bare av betalingsløsningen (service_role).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  navn text,
  trinn text references public.trinn (id) on delete set null,
  abonnement text not null default 'gratis',
  opprettet timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Supabase gir anon/authenticated alle rettigheter på nye tabeller som
-- standard. Ta dem bort, og gi bare det som trengs.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (navn, trinn) on public.profiles to authenticated;

create policy "Brukere kan lese egen profil" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "Brukere kan oppdatere egen profil" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Oppretter profilen automatisk når noen registrerer seg.
create function public.opprett_profil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, navn)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'navn'), ''));
  return new;
end;
$$;

revoke execute on function public.opprett_profil() from public, anon, authenticated;

create trigger opprett_profil_etter_registrering
  after insert on auth.users
  for each row execute function public.opprett_profil();

-- Profiler for brukere som registrerte seg før tabellen fantes.
insert into public.profiles (id, navn)
select id, nullif(trim(raw_user_meta_data ->> 'navn'), '')
from auth.users
on conflict (id) do nothing;
