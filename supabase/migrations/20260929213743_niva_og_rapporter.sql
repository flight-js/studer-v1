-- Kjerne og ekstra, og rapporter fra elevene.
--
-- 1. kjerne: nivåsjekken (npm run content:niva) merker begreper, spørsmål og
--    skriveoppgaver som bare er ett av flere mulige eksempler, eller som er over
--    nivået for trinnet. Øvingene tar kjernestoffet først og merker resten «Ekstra».
-- 2. rapporter: eleven kan si fra om et kort eller spørsmål («Har ikke lært
--    dette», «Feil», «For vanskelig»). Eleven kan bare legge inn egne rapporter,
--    ikke lese dem – de leses med npm run content:rapporter (secret-nøkkelen).

-- Kjerne --------------------------------------------------------------------------

alter table public.flashcards add column kjerne boolean not null default true;
alter table public.quiz_sporsmal add column kjerne boolean not null default true;
alter table public.skriveoppgaver add column kjerne boolean not null default true;
grant select (kjerne) on public.skriveoppgaver to authenticated;

-- Rapporter -----------------------------------------------------------------------

create table public.rapporter (
  id bigint generated always as identity primary key,
  bruker_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tema_id text not null references public.temaer (id) on delete cascade,
  type text not null check (type in ('flashcard', 'sporsmal', 'skriv')),
  -- Begrepet for flashcards, ellers nøkkelen ('q01', 'm03', 's02'). Flashcards
  -- får nye id-er ved hver import, så begrepet er det som står seg.
  nokkel text not null check (char_length(nokkel) between 1 and 200),
  grunn text not null check (grunn in ('ikke-laert', 'feil', 'for-vanskelig')),
  opprettet timestamptz not null default now(),
  unique (bruker_id, tema_id, type, nokkel, grunn)
);

create index rapporter_tema_id_idx on public.rapporter (tema_id);

alter table public.rapporter enable row level security;
revoke all on public.rapporter from anon, authenticated;
grant insert (tema_id, type, nokkel, grunn) on public.rapporter to authenticated;

create policy "Abonnenter kan rapportere innhold" on public.rapporter
  for insert to authenticated
  with check (bruker_id = (select auth.uid()) and (select public.har_tilgang()));
