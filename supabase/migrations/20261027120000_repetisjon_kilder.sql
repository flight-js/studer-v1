-- Repetisjonstemaet: hvilket tema hvert kort og spørsmål er kopiert fra, og
-- hvilke temaer hver skriveoppgave bygger på. Da kan eleven velge temaer i
-- flashcards, quiz og miniprøve. Settes av importen (scripts/lib/pensum-rader.mjs),
-- og er null i vanlige temaer.

alter table public.flashcards add column kilde text;
alter table public.quiz_sporsmal add column kilde text;
alter table public.skriveoppgaver add column kilder text[];

-- skriveoppgaver har lesetilgang per kolonne (fasiten skal ikke kunne leses).
grant select (kilder) on public.skriveoppgaver to authenticated;
