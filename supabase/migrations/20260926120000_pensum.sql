-- Pensum: trinn → fag → temaer, og innholdet i hvert tema.
--
-- Tilgang (RLS):
--   * trinn, fag og publiserte temaer kan leses av alle (også uten innlogging),
--     slik at fag- og temaoversikten kan vises før man har kjøpt abonnement.
--   * selve innholdet (sammendrag, tankekart, flashcards, quiz, miniprøver)
--     kan bare leses av innloggede brukere, og bare for publiserte temaer.
--   * ingen kan skrive via API-et. Innhold importeres med service_role
--     (supabase/seed.sql, generert av `npm run content:seed`).
--
-- Når abonnement er på plass: bytt ut «to authenticated»-reglene for innhold
-- med en sjekk på aktivt abonnement.

-- Trinn og fag ------------------------------------------------------------

create table public.trinn (
  id text primary key, -- '8', '9', '10', 'vg1', 'vg2', 'vg3'
  navn text not null,
  skoleniva text not null check (skoleniva in ('ungdomsskole', 'vgs')),
  sortering int not null
);

create table public.fag (
  id text primary key, -- f.eks. 'kjemi-1', 'norsk-8'
  trinn_id text not null references public.trinn (id) on delete restrict,
  navn text not null,
  lareplan_kode text, -- Udirs kode, f.eks. 'KJE01-02'
  lareplan_url text,
  kompetansemaal jsonb not null default '[]'::jsonb, -- [{ "nr": 1, "kort": "…" }]
  sortering int not null
);

create index fag_trinn_id_idx on public.fag (trinn_id, sortering);

-- Temaer ------------------------------------------------------------------

create table public.temaer (
  id text primary key, -- '<fag_id>:<slug>', f.eks. 'kjemi-1:atomet-og-periodesystemet'
  fag_id text not null references public.fag (id) on delete cascade,
  slug text not null,
  navn text not null,
  intro text not null,
  kompetansemaal int[] not null default '{}', -- nummer i fag.kompetansemaal
  sortering int not null,
  status text not null default 'utkast'
    check (status in ('utkast', 'sjekkes', 'godkjent')),
  merknader text[] not null default '{}', -- påstander som bør dobbeltsjekkes
  publisert boolean not null default false,
  oppdatert timestamptz not null default now(),
  unique (fag_id, slug)
);

create index temaer_fag_id_idx on public.temaer (fag_id, sortering);

-- Innhold (krever innlogging) ---------------------------------------------

create table public.tema_innhold (
  tema_id text primary key references public.temaer (id) on delete cascade,
  sammendrag text not null, -- avsnitt skilt med tom linje, «## » = mellomtittel, **fet**
  tankekart jsonb not null -- { "label": "…", "note": "…", "children": [ … ] }
);

create table public.flashcards (
  id bigint generated always as identity primary key,
  tema_id text not null references public.temaer (id) on delete cascade,
  begrep text not null,
  forklaring text not null,
  sortering int not null
);

create index flashcards_tema_id_idx on public.flashcards (tema_id, sortering);

-- Alle spørsmål i et tema. i_quiz / i_miniprove sier hvor spørsmålet brukes.
create table public.quiz_sporsmal (
  tema_id text not null references public.temaer (id) on delete cascade,
  nokkel text not null, -- 'q01' (quiz) eller 'm01' (bare i miniprøven)
  type text not null check (type in ('flervalg', 'sant-usant')),
  tekst text not null,
  alternativer text[] not null, -- 4 for flervalg, {Sant,Usant} for sant-usant
  riktig smallint not null, -- indeks i alternativer (0 = første)
  forklaring text not null,
  i_quiz boolean not null,
  i_miniprove boolean not null,
  sortering int not null,
  primary key (tema_id, nokkel),
  check (
    (type = 'flervalg' and cardinality(alternativer) = 4)
    or (type = 'sant-usant' and cardinality(alternativer) = 2)
  ),
  check (riktig >= 0 and riktig < cardinality(alternativer))
);

create table public.miniprover (
  tema_id text primary key references public.temaer (id) on delete cascade,
  minutter smallint not null check (minutter > 0)
);

-- Tilgang ------------------------------------------------------------------

alter table public.trinn enable row level security;
alter table public.fag enable row level security;
alter table public.temaer enable row level security;
alter table public.tema_innhold enable row level security;
alter table public.flashcards enable row level security;
alter table public.quiz_sporsmal enable row level security;
alter table public.miniprover enable row level security;

grant select on public.trinn, public.fag, public.temaer to anon, authenticated;
grant select on public.tema_innhold, public.flashcards, public.quiz_sporsmal, public.miniprover
  to authenticated;

create policy "Alle kan lese trinn" on public.trinn
  for select to anon, authenticated using (true);

create policy "Alle kan lese fag" on public.fag
  for select to anon, authenticated using (true);

create policy "Alle kan lese publiserte temaer" on public.temaer
  for select to anon, authenticated using (publisert);

create policy "Innloggede kan lese sammendrag og tankekart" on public.tema_innhold
  for select to authenticated
  using (exists (select 1 from public.temaer t where t.id = tema_id and t.publisert));

create policy "Innloggede kan lese flashcards" on public.flashcards
  for select to authenticated
  using (exists (select 1 from public.temaer t where t.id = tema_id and t.publisert));

create policy "Innloggede kan lese quizspørsmål" on public.quiz_sporsmal
  for select to authenticated
  using (exists (select 1 from public.temaer t where t.id = tema_id and t.publisert));

create policy "Innloggede kan lese miniprøver" on public.miniprover
  for select to authenticated
  using (exists (select 1 from public.temaer t where t.id = tema_id and t.publisert));
