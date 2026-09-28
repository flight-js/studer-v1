-- Tilgang og prøveperiode.
--
-- 1. Temaene kan bare leses av innloggede. Trinn og fag er fortsatt åpne,
--    fordi forsiden viser hvilke fag som finnes.
-- 2. Selve innholdet (sammendrag, tankekart, flashcards, quiz, miniprøver)
--    krever abonnement. En prøveperiode teller som abonnement.
-- 3. Prøveperiode: profiles får provetid_til og provetid_brukt, som bare
--    Stripe-webhooken skriver (eleven kan fortsatt bare endre navn og trinn).
--    Tabellen provetid husker hvilken konto, e-post og hvilket kort som har
--    fått en prøveperiode, slik at ingen får mer enn én.

-- Innhold ---------------------------------------------------------------------

-- Kjører med elevens egne rettigheter: eleven kan bare lese sin egen profil.
create function public.har_tilgang()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and abonnement <> 'gratis'
  );
$$;

revoke execute on function public.har_tilgang() from public, anon;
grant execute on function public.har_tilgang() to authenticated;

-- anon beholder select-rettigheten, men uten regel ser anon ingen temaer.
-- Da virker fagoversikten på forsiden (antall temaer blir bare 0).
drop policy "Alle kan lese publiserte temaer" on public.temaer;
create policy "Innloggede kan lese publiserte temaer" on public.temaer
  for select to authenticated using (publisert);

drop policy "Innloggede kan lese sammendrag og tankekart" on public.tema_innhold;
create policy "Abonnenter kan lese sammendrag og tankekart" on public.tema_innhold
  for select to authenticated
  using ((select public.har_tilgang()) and exists (select 1 from public.temaer t where t.id = tema_id and t.publisert));

drop policy "Innloggede kan lese flashcards" on public.flashcards;
create policy "Abonnenter kan lese flashcards" on public.flashcards
  for select to authenticated
  using ((select public.har_tilgang()) and exists (select 1 from public.temaer t where t.id = tema_id and t.publisert));

drop policy "Innloggede kan lese quizspørsmål" on public.quiz_sporsmal;
create policy "Abonnenter kan lese quizspørsmål" on public.quiz_sporsmal
  for select to authenticated
  using ((select public.har_tilgang()) and exists (select 1 from public.temaer t where t.id = tema_id and t.publisert));

drop policy "Innloggede kan lese miniprøver" on public.miniprover;
create policy "Abonnenter kan lese miniprøver" on public.miniprover
  for select to authenticated
  using ((select public.har_tilgang()) and exists (select 1 from public.temaer t where t.id = tema_id and t.publisert));

-- Prøveperiode ------------------------------------------------------------------

alter table public.profiles
  add column provetid_til timestamptz,                      -- satt mens prøveperioden varer
  add column provetid_brukt boolean not null default false; -- har hatt prøveperiode eller abonnement

-- Én rad per prøveperiode (Stripe-abonnement). bruker_id er med vilje ikke en
-- fremmednøkkel: raden skal bli stående om kontoen slettes, ellers kunne man
-- slette kontoen og registrere seg på nytt for en ny prøveperiode.
-- E-posten lagres bare som hash.
create table public.provetid (
  id bigint generated always as identity primary key,
  abonnement_id text not null unique,
  bruker_id uuid not null,
  epost_hash text,
  kort_fingeravtrykk text,
  avvist boolean not null default false,
  opprettet timestamptz not null default now()
);

create index provetid_bruker_id_idx on public.provetid (bruker_id);
create index provetid_epost_hash_idx on public.provetid (epost_hash);
create index provetid_kort_idx on public.provetid (kort_fingeravtrykk);

alter table public.provetid enable row level security;
revoke all on public.provetid from anon, authenticated;

-- Samme person med ulike varianter av e-posten skal gi samme nøkkel:
-- små bokstaver, uten «+noe», og uten punktum for Gmail.
create function public.provetid_epostnokkel(p_epost text)
returns text
language sql
immutable
set search_path = ''
as $$
  select encode(sha256(convert_to(
    case
      when split_part(e, '@', 2) in ('gmail.com', 'googlemail.com')
        then replace(split_part(split_part(e, '@', 1), '+', 1), '.', '') || '@gmail.com'
      else split_part(split_part(e, '@', 1), '+', 1) || '@' || split_part(e, '@', 2)
    end, 'UTF8')), 'hex')
  from (select lower(trim(p_epost)) as e) x
  where p_epost like '%@%';
$$;

-- Kan kontoen / e-posten få prøveperiode? Brukes av «betaling» før kjøpet.
create function public.provetid_tilgjengelig(p_bruker uuid, p_epost text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select not exists (
    select 1 from public.provetid
    where bruker_id = p_bruker or epost_hash = public.provetid_epostnokkel(p_epost)
  );
$$;

-- Registrerer en prøveperiode og svarer om den er godkjent. Den er avvist hvis
-- en tidligere prøveperiode har samme konto, e-post eller kort. Svaret er det
-- samme hver gang for samme abonnement, så webhooken kan kalle den flere ganger.
create function public.provetid_registrer(p_abonnement text, p_bruker uuid, p_epost text, p_kort text)
returns boolean
language plpgsql
set search_path = ''
as $$
declare
  rad public.provetid;
  godkjent boolean;
begin
  -- To prøveperioder med samme kort samtidig skal ikke begge slippe gjennom.
  perform pg_advisory_xact_lock(hashtext('public.provetid'));

  insert into public.provetid (abonnement_id, bruker_id, epost_hash, kort_fingeravtrykk)
  values (p_abonnement, p_bruker, public.provetid_epostnokkel(p_epost), p_kort)
  on conflict (abonnement_id) do update
    set epost_hash = coalesce(public.provetid.epost_hash, excluded.epost_hash),
        kort_fingeravtrykk = coalesce(public.provetid.kort_fingeravtrykk, excluded.kort_fingeravtrykk)
  returning * into rad;

  godkjent := not exists (
    select 1 from public.provetid p
    where p.id < rad.id
      and (p.bruker_id = rad.bruker_id
        or p.epost_hash = rad.epost_hash
        or p.kort_fingeravtrykk = rad.kort_fingeravtrykk)
  );

  update public.provetid set avvist = not godkjent where id = rad.id;
  return godkjent;
end;
$$;

revoke execute on function public.provetid_epostnokkel(text) from public, anon, authenticated;
revoke execute on function public.provetid_tilgjengelig(uuid, text) from public, anon, authenticated;
revoke execute on function public.provetid_registrer(text, uuid, text, text) from public, anon, authenticated;
grant execute on function public.provetid_epostnokkel(text) to service_role;
grant execute on function public.provetid_tilgjengelig(uuid, text) to service_role;
grant execute on function public.provetid_registrer(text, uuid, text, text) to service_role;
