-- Fremdrift: beste resultat per bruker, tema og øvingsform.
--
-- Hver bruker ser og endrer bare sine egne rader. Resultater lagres med
-- public.lagre_resultat(), som beholder det beste resultatet brukeren har hatt.

create table public.fremdrift (
  bruker_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tema_id text not null references public.temaer (id) on delete cascade,
  aktivitet text not null check (aktivitet in ('flashcards', 'quiz', 'miniprove')),
  beste smallint not null check (beste >= 0),
  av smallint not null check (av > 0 and beste <= av),
  sist_ovd timestamptz not null default now(),
  primary key (bruker_id, tema_id, aktivitet)
);

create index fremdrift_tema_id_idx on public.fremdrift (tema_id);

alter table public.fremdrift enable row level security;

grant select, insert, update, delete on public.fremdrift to authenticated;

create policy "Brukere kan lese egen fremdrift" on public.fremdrift
  for select to authenticated using ((select auth.uid()) = bruker_id);

create policy "Brukere kan legge inn egen fremdrift" on public.fremdrift
  for insert to authenticated with check ((select auth.uid()) = bruker_id);

create policy "Brukere kan oppdatere egen fremdrift" on public.fremdrift
  for update to authenticated
  using ((select auth.uid()) = bruker_id)
  with check ((select auth.uid()) = bruker_id);

create policy "Brukere kan slette egen fremdrift" on public.fremdrift
  for delete to authenticated using ((select auth.uid()) = bruker_id);

-- Lagrer et resultat og beholder det beste. Kjører med brukerens egne
-- rettigheter (security invoker), så reglene over gjelder som vanlig.
create function public.lagre_resultat(p_tema_id text, p_aktivitet text, p_resultat int, p_av int)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.fremdrift (bruker_id, tema_id, aktivitet, beste, av, sist_ovd)
  values (auth.uid(), p_tema_id, p_aktivitet, p_resultat, p_av, now())
  on conflict (bruker_id, tema_id, aktivitet) do update
    set beste = case
          when excluded.av <> public.fremdrift.av then excluded.beste
          else greatest(public.fremdrift.beste, excluded.beste)
        end,
        av = excluded.av,
        sist_ovd = now();
$$;

revoke execute on function public.lagre_resultat(text, text, int, int) from public, anon;
grant execute on function public.lagre_resultat(text, text, int, int) to authenticated;
