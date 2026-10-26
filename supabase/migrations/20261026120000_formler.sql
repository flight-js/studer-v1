-- Formelmatch: formlene i hvert tema (venstre side, høyre side og navn).
-- Formlene ligger sammen med sammendraget og tankekartet, så de er låst bak
-- abonnement på samme måte. Antallet står på temaet, så temasiden kan vise
-- øvingen (låst) også uten abonnement.

alter table public.tema_innhold
  add column formler jsonb not null default '[]'::jsonb; -- [{ "venstre": "n", "hoyre": "m / M", "navn": "…" }]

alter table public.temaer
  add column antall_formler int not null default 0;
