-- Betaling med Stripe.
--
-- Abonnementet settes bare av edge-funksjonen «stripe-webhook», som
-- verifiserer signaturen fra Stripe og skriver med secret-nøkkelen. Eleven
-- kan lese abonnementet sitt i profiles, men aldri endre det.

alter table public.profiles
  add constraint profiles_abonnement_gyldig check (abonnement in ('gratis', 'maned', 'ar')),
  add column abonnement_til timestamptz,
  add column abonnement_avsluttes boolean not null default false;

-- Koblingen mellom bruker og Stripe-kunde. Bare for serveren.
create table public.betaling (
  bruker_id uuid primary key references auth.users (id) on delete cascade,
  stripe_kunde text not null unique,
  stripe_abonnement text,
  status text,
  plan text check (plan in ('maned', 'ar')),
  gjelder_til timestamptz,
  oppdatert timestamptz not null default now()
);

alter table public.betaling enable row level security;
revoke all on public.betaling from anon, authenticated;
