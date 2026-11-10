-- UTKAST (ikke kjørt): konkurranse på Studer – poeng, rangeringer, skoler og
-- belønninger som kan løses inn hos partnere.
--
-- Prinsipper:
-- - Poeng tjenes bare på serveren: når lagre_resultat lagrer en fullført øving,
--   og når en formelmatch-runde avsluttes. Eleven kan aldri skrive poeng selv.
-- - Tak: hver øving (tema + aktivitet) gir poeng høyst én gang per døgn, og
--   høyst 150 poeng per døgn til sammen (dagsbonus inkludert). Flashcards gir
--   ikke poeng: eleven svarer selv «Kan dette», så det kan ikke sjekkes.
-- - Rekordbonus: ny personlig rekord på tid i formelmatch gir 15 poeng som ikke
--   teller mot taket – høyst tre om dagen og én per tema. Slik er det noe å
--   spille for også etter at taket er nådd.
-- - Poengene har ingen pengeverdi, kan ikke kjøpes eller overføres, og kan
--   løses inn i belønninger (se vilkårene).
-- - Eleven velger skole. Rangeringer viser fornavnet (første ord i navnet fra
--   registreringen) og skolen. Krysser eleven av for «Ikke vis fornavnet mitt
--   på rangeringene», vises kallenavnet i stedet – eller ingenting, uten
--   kallenavn. Kallenavn sjekkes for banneord og slurs her i databasen
--   (kallenavn_feil), så sjekken i appen kan ikke omgås. Skolelista teller alle
--   med valgt skole, men viser bare tall per skole.
--
-- Etter migrasjonen: last inn supabase/skoler.sql (npm run skoler lager den).
-- Belønninger og koder legges inn av Studer med service_role (se nederst).

create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------- Skoler

create table public.skoler (
  id text primary key, -- organisasjonsnummer i Nasjonalt skoleregister
  navn text not null,
  kommune text not null default '',
  fylke text not null default '',
  ungdomstrinn boolean not null default false,
  vgs boolean not null default false,
  aktiv boolean not null default true
);

create index skoler_navn_trgm on public.skoler using gin (navn extensions.gin_trgm_ops);

alter table public.skoler enable row level security;
revoke all on public.skoler from anon, authenticated;
grant select on public.skoler to authenticated;

create policy "Innloggede kan lese aktive skoler" on public.skoler
  for select to authenticated using (aktiv);

-- ---------------------------------------------------------------- Profil

alter table public.profiles
  add column skole_id text references public.skoler (id) on delete set null,
  add column skjul_fornavn boolean not null default false,
  add column kallenavn text,
  -- Gratis tilgang fra en venn (vennegave_los_inn): har_tilgang() slipper eleven
  -- inn til dette tidspunktet, uten abonnement og uten kort. Bare databasen
  -- skriver kolonnen (eleven har ikke update-rettighet på den).
  add column gave_til timestamptz;

-- Kallenavnet kan bare lagres av serverfunksjonen «kallenavn», som også lar en
-- språkmodell vurdere det (supabase/functions/kallenavn). Eleven kan derfor
-- ikke oppdatere kolonnen selv.
grant update (skole_id, skjul_fornavn) on public.profiles to authenticated;

-- Tilgang til innholdet: abonnement eller prøveperiode fra Stripe, eller en gave
-- fra en venn som ikke har gått ut. Samme regel som harTilgang() i
-- src/lib/profil.ts. (Serverfunksjonene «chat» og «vurder» spør denne.)
create or replace function public.har_tilgang()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and (abonnement <> 'gratis' or gave_til > now())
  );
$$;

-- Ordlistene for kallenavn – de samme som i src/lib/kallenavn.ts (der står
-- hvorfor ordene er delt i tre lister). Endres begge steder.
-- delord: ikke noe sted, heller ikke inni andre ord.
create function public.kallenavn_delord()
returns text[]
language sql
immutable
set search_path = ''
as $$
  select array[
    'fuck', 'fuk', 'fvck', 'phuck', 'phuk', 'shit', 'cunt', 'bitch', 'biatch', 'whore', 'slut', 'nigg',
    'faggot', 'fagot', 'retard', 'tranny', 'shemale', 'porn', 'penis', 'vagina', 'dildo', 'wank',
    'cumshot', 'blowjob', 'handjob', 'motherf', 'asshole', 'arsehole', 'dumbass', 'jackass', 'dickhead',
    'pussy', 'milf', 'chink', 'gook', 'wetback', 'beaner', 'towelhead', 'killyourself', 'hitler',
    'siegheil', 'whitepower', 'whitepride', 'skinhead', 'swastika', 'kkk', 'nazist', 'terrorist',
    'jihad', 'taliban', 'pedofil', 'suicide', 'cocaine', 'faen', 'fakking', 'helvete', 'haelvete',
    'jaevl', 'jaevel', 'javla', 'satan', 'dritt', 'sjit', 'fitte', 'fitta', 'knull', 'rasshol', 'homse',
    'soperk', 'neger', 'pakkis', 'svarting', 'sigoyner', 'voldt', 'hestkuk', 'kukhue', 'horunge',
    'horebukk', 'piss', 'mongis', 'spasser', 'drepdeg', 'hakekors', 'selvmord', 'kokain', 'narkoman',
    'snapchat', 'instagram', 'whatsapp', 'telegram', 'discord', 'onlyfans', 'tiktok', 'admin',
    'moderator', 'studerno'
  ];
$$;

-- forstavelser: ikke først i et ord (norske sammensetninger).
create function public.kallenavn_forstavelser()
returns text[]
language sql
immutable
set search_path = ''
as $$
  select array[
    'kuk', 'pikk', 'hore', 'pule', 'runk', 'raev', 'fitt', 'pedo', 'rapist'
  ];
$$;

-- helord: bare som egne ord (de finnes inni vanlige ord).
create function public.kallenavn_helord()
returns text[]
language sql
immutable
set search_path = ''
as $$
  select array[
    'ass', 'cum', 'tit', 'tits', 'sex', 'sexy', 'anal', 'anus', 'boob', 'boobs', 'nude', 'nudes',
    'naken', 'pupper', 'cock', 'dick', 'homo', 'kys', 'rape', 'spic', 'kike', 'coon', 'dyke', 'fag',
    'fags', 'paki', 'mongo', 'nazi', 'nazis', 'heil', 'niga', 'nigr', 'horny', 'weed', 'meth', 'heroin',
    'drug', 'drugs', 'hasj', 'mord', 'murder', 'fakk', 'snap', 'insta', 'kik', 'studer', 'support',
    'deg'
  ];
$$;

-- Forlengede bokstaver: vokaler til én («fuuuck»), konsonanter til høyst to.
create function public.kallenavn_kort(p text)
returns text
language sql
immutable
set search_path = ''
as $$
  select regexp_replace(regexp_replace(p, '([aeiouy])\1+', '\1', 'g'), '([b-df-hj-np-tv-xz])\1{2,}', '\1\1', 'g');
$$;

-- Hva som er galt med et kallenavn, eller null når det er greit: 2–20 tegn,
-- bare bokstaver, tall, mellomrom, - og _, minst to bokstaver, og ingen
-- banneord, seksuelle ord, slurs eller navn som utgir seg for Studer – heller
-- ikke skrevet med tegn imellom, tall for bokstaver eller forlengede bokstaver.
create function public.kallenavn_feil(p_kallenavn text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  v text := regexp_replace(trim(coalesce(p_kallenavn, '')), '\s+', ' ', 'g');
  n text;
  tett text;
  kort text;
  ord text[];
  o text;
  d text;
begin
  if char_length(v) < 2 or char_length(v) > 20 then
    return 'Kallenavnet må ha 2–20 tegn.';
  end if;
  -- Bokstavområdene skrives ut, fordi [[:alpha:]] og lower() ikke kjenner æøå
  -- med C-lokale. Bare latinske bokstaver (se src/lib/kallenavn.ts).
  if v !~ '^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž0-9 _-]+$' then
    return 'Bruk bare bokstaver, tall, mellomrom, - og _.';
  end if;
  if char_length(regexp_replace(v, '[^A-Za-zÀ-ÖØ-öø-ÿĀ-ž]', '', 'g')) < 2 then
    return 'Kallenavnet må ha minst to bokstaver.';
  end if;
  -- Telefonnumre og lignende: høyst fire sifre på rad.
  if v ~ '[0-9]{5}' then
    return 'Bruk høyst fire tall på rad.';
  end if;
  if strpos(v, '1488') > 0 then
    return 'Det kallenavnet kan ikke brukes. Velg et annet.';
  end if;

  -- Små bokstaver a–z: «MatteKuk» blir to ord, æøå skrives ut, aksenter
  -- fjernes og tall leses som bokstaver.
  -- Alt dette før lower(), som bare gjør A–Z små med C-lokale.
  n := regexp_replace(v, '([a-zæøå])([A-ZÆØÅ])', '\1 \2', 'g');
  n := replace(replace(replace(replace(replace(replace(n, 'æ', 'ae'), 'Æ', 'ae'), 'ø', 'o'), 'Ø', 'o'), 'å', 'a'), 'Å', 'a');
  n := translate(n,
    'àáâãäāèéêëēìíîïīòóôõöōùúûüūýÿçčćšśžźżñńÀÁÂÃÄĀÈÉÊËĒÌÍÎÏĪÒÓÔÕÖŌÙÚÛÜŪÝŸÇČĆŠŚŽŹŻÑŃ',
    'aaaaaaeeeeeiiiiioooooouuuuuyycccsszzznnaaaaaaeeeeeiiiiioooooouuuuuyycccsszzznn');
  n := lower(translate(n, '0134578', 'oieastb'));

  tett := regexp_replace(n, '[^a-z]', '', 'g');
  kort := public.kallenavn_kort(tett);
  select coalesce(array_agg(x), '{}') || coalesce(array_agg(public.kallenavn_kort(x)), '{}')
    into ord
    from unnest(regexp_split_to_array(n, '[^a-z]+')) as x
    where x <> '';

  foreach d in array public.kallenavn_delord() loop
    if strpos(tett, d) > 0 or strpos(kort, d) > 0 then
      return 'Det kallenavnet kan ikke brukes. Velg et annet.';
    end if;
  end loop;
  foreach o in array ord loop
    if o = any (public.kallenavn_helord()) then
      return 'Det kallenavnet kan ikke brukes. Velg et annet.';
    end if;
    foreach d in array public.kallenavn_forstavelser() loop
      if left(o, char_length(d)) = d then
        return 'Det kallenavnet kan ikke brukes. Velg et annet.';
      end if;
    end loop;
  end loop;
  return null;
end;
$$;

-- Kallenavnet ryddes (mellomrom) og sjekkes før det lagres. Tomt = ikke noe.
-- Feilmeldingen går rett til eleven.
create function public.sjekk_kallenavn()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_feil text;
begin
  new.kallenavn := nullif(regexp_replace(trim(coalesce(new.kallenavn, '')), '\s+', ' ', 'g'), '');
  if new.kallenavn is not null then
    v_feil := public.kallenavn_feil(new.kallenavn);
    if v_feil is not null then
      raise exception using errcode = '23514', message = v_feil;
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_sjekk_kallenavn
  before insert or update of kallenavn on public.profiles
  for each row execute function public.sjekk_kallenavn();

-- Hvor mange kallenavn hver elev har fått sjekket av språkmodellen per døgn,
-- så ingen kan prøve seg fram i det uendelige (eller koste mye). Bare
-- serverfunksjonen «kallenavn» bruker tabellen, med secret-nøkkelen.
create table public.kallenavn_sjekker (
  bruker_id uuid not null references auth.users (id) on delete cascade,
  dag date not null default public.minne_i_dag(),
  antall int not null default 0,
  primary key (bruker_id, dag)
);
alter table public.kallenavn_sjekker enable row level security;
revoke all on public.kallenavn_sjekker from anon, authenticated;

-- Teller én sjekk. Svarer 'ok', 'dag' (eleven har nådd grensen i dag) eller
-- 'global' (hele appen har nådd grensen i dag – vern mot mange nye kontoer).
create function public.kallenavn_tell_sjekk(p_bruker_id uuid, p_dagsgrense int, p_global_grense int)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dag date := public.minne_i_dag();
  v_antall int;
begin
  if (select coalesce(sum(antall), 0) from public.kallenavn_sjekker where dag = v_dag) >= p_global_grense then
    return 'global';
  end if;
  insert into public.kallenavn_sjekker as k (bruker_id, dag, antall)
  values (p_bruker_id, v_dag, 1)
  on conflict (bruker_id, dag) do update set antall = k.antall + 1
  returning antall into v_antall;
  return case when v_antall <= p_dagsgrense then 'ok' else 'dag' end;
end;
$$;

-- Fornavnet: første ord i navnet.
create function public.visningsnavn(p_navn text)
returns text
language sql
immutable
set search_path = ''
as $$
  select coalesce(nullif(split_part(trim(coalesce(p_navn, '')), ' ', 1), ''), 'Elev');
$$;

-- Navnet andre ser på rangeringene: fornavnet, eller kallenavnet når eleven har
-- skjult fornavnet. null: eleven vises ikke for andre (fornavnet skjult og
-- ikke noe kallenavn).
create function public.rangeringsnavn(p_navn text, p_skjul_fornavn boolean, p_kallenavn text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case when not p_skjul_fornavn then public.visningsnavn(p_navn) else nullif(p_kallenavn, '') end;
$$;

-- ---------------------------------------------------------------- Belønninger

create table public.belonninger (
  id uuid primary key default gen_random_uuid(),
  partner text not null,
  tittel text not null,
  beskrivelse text not null default '',
  vilkar text not null default '', -- partnerens vilkår, for eksempel minstebeløp
  lenke text, -- nettsiden der koden brukes
  poengpris int not null check (poengpris > 0),
  gyldig_til date,
  aktiv boolean not null default true,
  opprettet timestamptz not null default now(),
  -- kode: koder fra en partner (tabellen kuponger). De andre er Studers egne:
  -- kreditt: gratis tid – verdi er antall dager perioden forlenges (neste betaling flyttes frem)
  -- venn:    en gave eleven sender til en venns e-post – verdi er antall dager vennen får
  -- ting:    noe i appen (flammefarge, konfetti, merke ved navnet, tema) – verdi er tingen
  type text not null default 'kode' check (type in ('kode', 'kreditt', 'venn', 'ting')),
  verdi text,
  check (
    (type = 'kode' and verdi is null)
    or (type in ('kreditt', 'venn') and verdi ~ '^[0-9]{1,3}$')
    or (type = 'ting' and verdi ~ '^(flamme|konfetti|merke|tema)-[a-z]+$')
  )
);

alter table public.belonninger enable row level security;
revoke all on public.belonninger from anon, authenticated;
-- Leses gjennom belonninger_med_lager(), som også viser hvor mange koder som er igjen.

create table public.kuponger (
  id bigint generated always as identity primary key,
  belonning_id uuid not null references public.belonninger (id) on delete cascade,
  kode text not null,
  bruker_id uuid references auth.users (id) on delete set null,
  innlost timestamptz,
  unique (belonning_id, kode)
);

create index kuponger_ledige on public.kuponger (belonning_id) where bruker_id is null;
create index kuponger_bruker on public.kuponger (bruker_id) where bruker_id is not null;

alter table public.kuponger enable row level security;
revoke all on public.kuponger from anon, authenticated;
-- Ingen direkte tilgang: koder deles bare ut av los_inn() og leses med mine_kuponger().

-- ---------------------------------------------------------------- Studers egne belønninger

-- Ting i appen eleven eier. Eleven ser sine egne; de deles bare ut av los_inn().
create table public.eiendeler (
  bruker_id uuid not null references auth.users (id) on delete cascade,
  ting text not null,
  belonning_id uuid references public.belonninger (id) on delete set null,
  kjopt timestamptz not null default now(),
  primary key (bruker_id, ting)
);
alter table public.eiendeler enable row level security;
revoke all on public.eiendeler from anon, authenticated;
grant select on public.eiendeler to authenticated;
create policy "Elever ser sine egne ting" on public.eiendeler
  for select to authenticated using (bruker_id = auth.uid());

-- Hvilke ting eleven bruker. Bare ting eleven eier (sjekk_valgte_ting).
-- valgt_tema: premium-tema som farger natt-flatene i appen (se globals.css).
alter table public.profiles
  add column valgt_flamme text,
  add column valgt_konfetti text,
  add column valgt_merke text,
  add column valgt_tema text;
grant update (valgt_flamme, valgt_konfetti, valgt_merke, valgt_tema) on public.profiles to authenticated;

create function public.sjekk_valgte_ting()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.valgt_flamme is not null and (new.valgt_flamme not like 'flamme-%'
        or not exists (select 1 from public.eiendeler e where e.bruker_id = new.id and e.ting = new.valgt_flamme)))
    or (new.valgt_konfetti is not null and (new.valgt_konfetti not like 'konfetti-%'
        or not exists (select 1 from public.eiendeler e where e.bruker_id = new.id and e.ting = new.valgt_konfetti)))
    or (new.valgt_merke is not null and (new.valgt_merke not like 'merke-%'
        or not exists (select 1 from public.eiendeler e where e.bruker_id = new.id and e.ting = new.valgt_merke)))
    or (new.valgt_tema is not null and (new.valgt_tema not like 'tema-%'
        or not exists (select 1 from public.eiendeler e where e.bruker_id = new.id and e.ting = new.valgt_tema))) then
    raise exception using errcode = '23514', message = 'Du har ikke den tingen.';
  end if;
  return new;
end;
$$;

create trigger profiles_sjekk_valgte_ting
  before update of valgt_flamme, valgt_konfetti, valgt_merke, valgt_tema on public.profiles
  for each row execute function public.sjekk_valgte_ting();

-- Gaver til en venn. Eleven skriver vennens e-postadresse, og Studer sender
-- vennen en e-post (serverfunksjonen «vennegave»). Når noen med den adressen
-- (bekreftet) lager konto og løser inn gaven på /abonnement
-- (vennegave_los_inn), får hen tilgang til alt i dagene – uten kort og uten
-- abonnement (profiles.gave_til). Bare for nye: ikke hatt abonnement eller
-- prøveperiode, og én gave per person. Brukes ikke gaven innen 60 dager, får
-- giveren poengene tilbake, og når gaven er ferdig, skjules adressen
-- (vennegaver_rydd, hver natt).
--   aktiv: sendt, kan brukes     brukt: vennen har fått dagene
--   angret: e-posten kunne ikke sendes – poengene er gitt tilbake
--   utlopt: ikke brukt i tide, eller vennen har brukt en annen gave – poengene er gitt tilbake
create table public.vennegaver (
  id uuid primary key default gen_random_uuid(),
  -- Sletter giveren kontoen, gjelder gaven fortsatt for vennen.
  giver uuid references auth.users (id) on delete set null,
  belonning_id uuid references public.belonninger (id) on delete set null,
  epost text not null, -- små bokstaver
  dager int not null,
  poeng int not null,
  status text not null default 'aktiv' check (status in ('aktiv', 'brukt', 'angret', 'utlopt')),
  laget timestamptz not null default now(),
  gyldig_til timestamptz not null default now() + interval '60 days',
  brukt_av uuid references auth.users (id) on delete set null,
  brukt timestamptz,
  -- Nøkkelen for e-posten til den som brukte gaven (provetid_epostnokkel): én
  -- gave per person, også med «+noe» i adressen og etter at kontoen er slettet.
  brukt_nokkel text
);
create index vennegaver_giver on public.vennegaver (giver, laget);
create index vennegaver_aktive on public.vennegaver (epost) where status = 'aktiv';
create unique index vennegaver_en_per_person on public.vennegaver (brukt_av) where status = 'brukt';
create index vennegaver_brukt_nokkel on public.vennegaver (brukt_nokkel) where status = 'brukt';
alter table public.vennegaver enable row level security;
revoke all on public.vennegaver from anon, authenticated;

-- Fornavnet som står i e-posten til vennen: første ord i navnet, bare
-- bokstaver (så navnet ikke kan brukes til lenker eller reklame). Ellers null
-- («En venn»).
create function public.gavenavn(p_bruker uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select n from (
    select split_part(trim(coalesce(p.navn, '')), ' ', 1) as n from public.profiles p where p.id = p_bruker
  ) x
  where n ~ '^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž][A-Za-zÀ-ÖØ-öø-ÿĀ-ž-]{0,29}$';
$$;

-- «ingrid@eksempel.no» → «in•••@eksempel.no»
create function public.skjul_epost(p_epost text)
returns text
language sql
immutable
set search_path = ''
as $$
  select left(split_part(p_epost, '@', 1), 2) || '•••@' || split_part(p_epost, '@', 2);
$$;

-- Gratis tid: poengene trekkes først (kreditt_start), så flytter serverfunksjonen
-- «betaling» slutten på perioden i Stripe (kreditt_ferdig lagrer den nye datoen).
-- Feiler Stripe, gis poengene tilbake (kreditt_angre).
create table public.kreditter (
  id uuid primary key default gen_random_uuid(),
  bruker_id uuid not null references auth.users (id) on delete cascade,
  belonning_id uuid references public.belonninger (id) on delete set null,
  dager int not null,
  poeng int not null,
  status text not null default 'venter' check (status in ('venter', 'ferdig', 'angret')),
  stripe_id text, -- abonnementet i Stripe
  ny_slutt timestamptz, -- neste betaling etter forlengelsen
  laget timestamptz not null default now()
);
create index kreditter_bruker on public.kreditter (bruker_id, laget);
alter table public.kreditter enable row level security;
revoke all on public.kreditter from anon, authenticated;

-- ---------------------------------------------------------------- Poeng

create table public.poeng_logg (
  id bigint generated always as identity primary key,
  bruker_id uuid not null references auth.users (id) on delete cascade,
  endring int not null,
  grunn text not null check (grunn in ('oving', 'dagsbonus', 'formelmatch', 'rekord', 'innlosning', 'korrigering')),
  tema_id text,
  aktivitet text,
  belonning_id uuid references public.belonninger (id) on delete set null,
  dag date not null default public.minne_i_dag(),
  tidspunkt timestamptz not null default now()
);

create index poeng_logg_bruker_dag on public.poeng_logg (bruker_id, dag);
create index poeng_logg_dag on public.poeng_logg (dag) where endring > 0;
-- Samme øving gir poeng høyst én gang per døgn.
create unique index poeng_logg_en_gang_per_dag on public.poeng_logg (bruker_id, tema_id, aktivitet, dag)
  where grunn in ('oving', 'formelmatch');
create unique index poeng_logg_en_dagsbonus on public.poeng_logg (bruker_id, dag) where grunn = 'dagsbonus';
-- Rekordbonus: høyst én per tema per døgn (og høyst tre per døgn, se avslutt_formelmatch).
create unique index poeng_logg_en_rekord_per_tema on public.poeng_logg (bruker_id, tema_id, dag) where grunn = 'rekord';

alter table public.poeng_logg enable row level security;
revoke all on public.poeng_logg from anon, authenticated;
grant select on public.poeng_logg to authenticated;

create policy "Brukere kan lese egne poeng" on public.poeng_logg
  for select to authenticated using ((select auth.uid()) = bruker_id);

-- Hvor mange dager på rad eleven har tjent poeng (i dag eller i går må være med).
create function public.poeng_streak(p_bruker uuid)
returns int
language sql
stable
security definer
set search_path = ''
as $$
  with dager as (
    select distinct l.dag from public.poeng_logg l
    where l.bruker_id = p_bruker and l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch', 'rekord')
  ), grupper as (
    select dag, dag - (row_number() over (order by dag))::int as gruppe from dager
  ), rekker as (
    select max(dag) as slutt, count(*)::int as lengde from grupper group by gruppe
  )
  select coalesce(
    (select lengde from rekker where slutt >= public.minne_i_dag() - 1 order by slutt desc limit 1),
    0
  );
$$;

-- Gir poeng for en fullført øving. Kalles bare fra lagre_resultat og
-- avslutt_formelmatch – aldri direkte av eleven.
create function public.gi_poeng(p_bruker uuid, p_tema_id text, p_aktivitet text, p_resultat numeric, p_av int)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_dag date := public.minne_i_dag();
  v_tak constant int := 150;
  v_andel numeric := case when p_av > 0 then least(greatest(p_resultat / p_av, 0), 1) else 0 end;
  v_grunnpoeng int;
  v_bonus int := 0;
  v_tjent int;
  v_poeng int;
  v_rader int;
begin
  -- Bare øvinger der svarene sjekkes, gir poeng. Flashcards gir ikke poeng,
  -- for der svarer eleven selv om hen kan kortet.
  v_grunnpoeng := case p_aktivitet
    when 'quiz' then 10 + round(5 * v_andel)::int
    when 'miniprove' then 15 + round(10 * v_andel)::int
    when 'formelmatch' then 10
    else 0
  end;
  if v_grunnpoeng = 0 then
    return 0;
  end if;

  if exists (
    select 1 from public.poeng_logg l
    where l.bruker_id = p_bruker and l.tema_id = p_tema_id and l.aktivitet = p_aktivitet
      and l.dag = v_dag and l.grunn in ('oving', 'formelmatch')
  ) then
    return 0;
  end if;

  -- Dagens første øving: 5 poeng + 1 per dag på rad (høyst 15).
  if not exists (select 1 from public.poeng_logg l where l.bruker_id = p_bruker and l.dag = v_dag and l.grunn = 'dagsbonus') then
    v_bonus := least(5 + public.poeng_streak(p_bruker), 15);
  end if;

  select coalesce(sum(l.endring), 0) into v_tjent
  from public.poeng_logg l
  where l.bruker_id = p_bruker and l.dag = v_dag and l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch');

  v_bonus := least(v_bonus, greatest(v_tak - v_tjent, 0));
  v_poeng := least(v_grunnpoeng, greatest(v_tak - v_tjent - v_bonus, 0));

  -- To innsendinger samtidig skal ikke gi poeng to ganger – og ikke gi en feil
  -- som ruller tilbake selve resultatet. Derfor «do nothing» ved konflikt.
  if v_bonus > 0 then
    insert into public.poeng_logg (bruker_id, endring, grunn) values (p_bruker, v_bonus, 'dagsbonus')
    on conflict (bruker_id, dag) where grunn = 'dagsbonus' do nothing;
    get diagnostics v_rader = row_count;
    if v_rader = 0 then
      v_bonus := 0;
    end if;
  end if;
  if v_poeng > 0 then
    insert into public.poeng_logg (bruker_id, endring, grunn, tema_id, aktivitet)
    values (p_bruker, v_poeng, case when p_aktivitet = 'formelmatch' then 'formelmatch' else 'oving' end, p_tema_id, p_aktivitet)
    on conflict (bruker_id, tema_id, aktivitet, dag) where grunn in ('oving', 'formelmatch') do nothing;
    get diagnostics v_rader = row_count;
    if v_rader = 0 then
      v_poeng := 0;
    end if;
  end if;
  return v_bonus + v_poeng;
end;
$$;

-- lagre_resultat lagrer fremdriften som før, men sjekker nå resultatet og gir
-- poeng. Den er security definer fordi poengene ikke kan skrives av eleven;
-- derfor sjekker den selv innlogging, tilgang og at temaet finnes.
-- Returnerer poengene eleven fikk (0 når taket er nådd eller øvingen er tatt i dag).
drop function public.lagre_resultat(text, text, numeric, int);

create function public.lagre_resultat(p_tema_id text, p_aktivitet text, p_resultat numeric, p_av int)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bruker uuid := auth.uid();
begin
  if v_bruker is null then
    raise exception 'Ikke innlogget';
  end if;
  if p_aktivitet not in ('flashcards', 'quiz', 'miniprove') then
    raise exception 'Ukjent aktivitet: %', p_aktivitet;
  end if;
  if p_av is null or p_av < 1 or p_av > 500 or p_resultat is null or p_resultat < 0 or p_resultat > p_av then
    raise exception 'Ugyldig resultat';
  end if;
  if not public.har_tilgang() then
    raise exception 'Krever abonnement';
  end if;
  if not exists (select 1 from public.temaer t where t.id = p_tema_id and t.publisert) then
    raise exception 'Ukjent tema';
  end if;

  insert into public.fremdrift (bruker_id, tema_id, aktivitet, beste, av, sist_ovd)
  values (v_bruker, p_tema_id, p_aktivitet, p_resultat, p_av, now())
  on conflict (bruker_id, tema_id, aktivitet) do update
    set beste = case
          when excluded.av <> public.fremdrift.av then excluded.beste
          else greatest(public.fremdrift.beste, excluded.beste)
        end,
        av = excluded.av,
        sist_ovd = now();

  return public.gi_poeng(v_bruker, p_tema_id, p_aktivitet, p_resultat, p_av);
end;
$$;

-- ---------------------------------------------------------------- Formelmatch

-- Tiden måles også på serveren: start_formelmatch kalles når klokka starter,
-- avslutt_formelmatch når siste par er koblet. Bare runder med alle formlene i
-- temaet (høyst 12) teller på rangeringen.
create table public.formelmatch_runder (
  id uuid primary key default gen_random_uuid(),
  bruker_id uuid not null references auth.users (id) on delete cascade,
  tema_id text not null references public.temaer (id) on delete cascade,
  startet timestamptz not null default now(),
  ferdig timestamptz,
  tid_ms int,
  par int,
  straffer int,
  teller boolean not null default false
);

create index formelmatch_runder_tema on public.formelmatch_runder (tema_id, tid_ms) where teller;
create index formelmatch_runder_bruker on public.formelmatch_runder (bruker_id, startet);

alter table public.formelmatch_runder enable row level security;
revoke all on public.formelmatch_runder from anon, authenticated;
grant select on public.formelmatch_runder to authenticated;

create policy "Brukere kan lese egne formelmatch-runder" on public.formelmatch_runder
  for select to authenticated using ((select auth.uid()) = bruker_id);

create function public.start_formelmatch(p_tema_id text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bruker uuid := auth.uid();
  v_id uuid;
begin
  if v_bruker is null then
    raise exception 'Ikke innlogget';
  end if;
  if not public.har_tilgang() then
    raise exception 'Krever abonnement';
  end if;
  if not exists (select 1 from public.temaer t where t.id = p_tema_id and t.publisert and t.antall_formler > 0) then
    raise exception 'Temaet har ikke formelmatch';
  end if;
  -- Enkel sperre mot automatiske runder.
  if (select count(*) from public.formelmatch_runder r where r.bruker_id = v_bruker and r.startet > now() - interval '1 hour') >= 60 then
    raise exception 'For mange runder på kort tid';
  end if;
  insert into public.formelmatch_runder (bruker_id, tema_id) values (v_bruker, p_tema_id) returning id into v_id;
  return v_id;
end;
$$;

-- Rekordbonus: slår eleven sin egen beste tid i temaet (en runde som teller,
-- og det fantes en tid fra før), gir det 15 poeng utenom taket. Høyst én per
-- tema og tre per døgn, så det ikke lønner seg å spille sakte først.
create function public.avslutt_formelmatch(p_runde uuid, p_tid_ms int, p_par int, p_straffer int)
returns table (tid_ms int, teller boolean, forrige_beste int, poeng int, rekordpoeng int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bruker uuid := auth.uid();
  v_runde public.formelmatch_runder;
  v_antall int;
  v_brukt int;
  v_tid int;
  v_min int;
  v_teller boolean;
  v_forrige int;
  v_poeng int;
  v_rekord int := 0;
  v_rader int;
begin
  select * into v_runde from public.formelmatch_runder r
  where r.id = p_runde and r.bruker_id = v_bruker and r.ferdig is null
  for update;
  if not found then
    raise exception 'Fant ikke runden';
  end if;

  v_brukt := (extract(epoch from now() - v_runde.startet) * 1000)::int;
  if v_brukt > 30 * 60 * 1000 then
    raise exception 'Runden er for gammel';
  end if;

  select least(t.antall_formler, 12) into v_antall from public.temaer t where t.id = v_runde.tema_id;
  -- Eleven kan ikke oppgi kortere tid enn det serveren har målt (minus litt
  -- for nettverket), og ingen klarer et par på under 0,6 sekunder.
  v_tid := greatest(coalesce(p_tid_ms, 0), v_brukt - 3000);
  v_min := greatest(coalesce(p_par, 0), 1) * 600;
  v_teller := coalesce(p_par, 0) >= v_antall and v_tid >= v_min;

  select min(r.tid_ms) into v_forrige from public.formelmatch_runder r
  where r.bruker_id = v_bruker and r.tema_id = v_runde.tema_id and r.teller;

  update public.formelmatch_runder r
  set ferdig = now(), tid_ms = v_tid, par = p_par, straffer = p_straffer, teller = v_teller
  where r.id = p_runde;

  v_poeng := public.gi_poeng(v_bruker, v_runde.tema_id, 'formelmatch', 1, 1);

  if v_teller and v_forrige is not null and v_tid < v_forrige then
    perform pg_advisory_xact_lock(hashtextextended(v_bruker::text, 0));
    if (
      select count(*) from public.poeng_logg l
      where l.bruker_id = v_bruker and l.dag = public.minne_i_dag() and l.grunn = 'rekord'
    ) < 3 then
      insert into public.poeng_logg (bruker_id, endring, grunn, tema_id, aktivitet)
      values (v_bruker, 15, 'rekord', v_runde.tema_id, 'formelmatch')
      on conflict (bruker_id, tema_id, dag) where grunn = 'rekord' do nothing;
      get diagnostics v_rader = row_count;
      if v_rader > 0 then
        v_rekord := 15;
      end if;
    end if;
  end if;

  return query select v_tid, v_teller, v_forrige, v_poeng, v_rekord;
end;
$$;

-- Topplisten for et tema: beste tid per elev. Eleven ser alltid seg selv, også
-- når hen ikke er synlig for andre.
create function public.formelmatch_toppliste(p_tema_id text, p_antall int default 10)
returns table (plass int, navn text, skole text, tid_ms int, er_meg boolean, antall int, merke text)
language sql
stable
security definer
set search_path = ''
as $$
  with beste as (
    select r.bruker_id, min(r.tid_ms) as tid_ms
    from public.formelmatch_runder r
    where r.tema_id = p_tema_id and r.teller
    group by r.bruker_id
  ), synlige as (
    select b.bruker_id, b.tid_ms, s.navn as skole,
           coalesce(public.rangeringsnavn(p.navn, p.skjul_fornavn, p.kallenavn), 'Deg') as navn,
           p.valgt_merke as merke
    from beste b
    join public.profiles p on p.id = b.bruker_id
    left join public.skoler s on s.id = p.skole_id
    where public.rangeringsnavn(p.navn, p.skjul_fornavn, p.kallenavn) is not null or b.bruker_id = auth.uid()
  ), rangert as (
    select rank() over (order by tid_ms)::int as plass, navn, skole, tid_ms,
           bruker_id = auth.uid() as er_meg, (count(*) over ())::int as antall, merke
    from synlige
  )
  select plass, navn, skole, tid_ms, er_meg, antall, merke
  from rangert
  where plass <= least(greatest(p_antall, 1), 50) or er_meg
  order by plass, navn;
$$;

-- ---------------------------------------------------------------- Rangeringer

-- Ukeslista: poeng tjent denne uka (mandag–søndag, norsk tid). Innløste poeng
-- trekkes ikke fra. p_omrade: 'alle', 'skole' eller 'trinn'.
create function public.poengliste(p_omrade text default 'alle', p_antall int default 50)
returns table (plass int, navn text, skole text, poeng int, er_meg boolean, merke text)
language sql
stable
security definer
set search_path = ''
as $$
  with uke as (
    select date_trunc('week', public.minne_i_dag())::date as fra
  ), meg as (
    select p.skole_id, p.trinn from public.profiles p where p.id = auth.uid()
  ), summer as (
    select l.bruker_id, sum(l.endring)::int as poeng
    from public.poeng_logg l, uke
    where l.dag >= uke.fra and l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch', 'rekord')
    group by l.bruker_id
  ), synlige as (
    select s.bruker_id, s.poeng, sk.navn as skole,
           coalesce(public.rangeringsnavn(p.navn, p.skjul_fornavn, p.kallenavn), 'Deg') as navn,
           p.valgt_merke as merke
    from summer s
    join public.profiles p on p.id = s.bruker_id
    left join public.skoler sk on sk.id = p.skole_id
    where (public.rangeringsnavn(p.navn, p.skjul_fornavn, p.kallenavn) is not null or s.bruker_id = auth.uid())
      and case p_omrade
        when 'skole' then p.skole_id = (select skole_id from meg)
        when 'trinn' then p.trinn = (select trinn from meg)
        else true
      end
  ), rangert as (
    select rank() over (order by poeng desc)::int as plass, navn, skole, poeng, bruker_id = auth.uid() as er_meg, merke
    from synlige
  )
  select plass, navn, skole, poeng, er_meg, merke
  from rangert
  where plass <= least(greatest(p_antall, 1), 100) or er_meg
  order by plass, navn;
$$;

-- Skolelista denne uka: snitt per aktiv elev (så små skoler kan vinne), bare
-- skoler med minst tre elever som har tjent poeng. Alle med valgt skole teller,
-- fordi lista bare viser tall per skole og aldri hvem som er med.
create function public.skoleliste(p_antall int default 20)
returns table (plass int, skole_id text, skole text, kommune text, elever int, poeng int, snitt int, er_min boolean)
language sql
stable
security definer
set search_path = ''
as $$
  with uke as (
    select date_trunc('week', public.minne_i_dag())::date as fra
  ), summer as (
    select l.bruker_id, sum(l.endring)::int as poeng
    from public.poeng_logg l, uke
    where l.dag >= uke.fra and l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch', 'rekord')
    group by l.bruker_id
  ), per_skole as (
    select p.skole_id, count(*)::int as elever, sum(s.poeng)::int as poeng
    from summer s
    join public.profiles p on p.id = s.bruker_id
    where p.skole_id is not null
    group by p.skole_id
    having count(*) >= 3
  ), rangert as (
    select rank() over (order by (ps.poeng::numeric / ps.elever) desc)::int as plass,
           ps.skole_id, sk.navn as skole, sk.kommune, ps.elever, ps.poeng,
           round(ps.poeng::numeric / ps.elever)::int as snitt,
           ps.skole_id = (select p.skole_id from public.profiles p where p.id = auth.uid()) as er_min
    from per_skole ps
    join public.skoler sk on sk.id = ps.skole_id
  )
  select * from rangert
  where plass <= least(greatest(p_antall, 1), 100) or er_min
  order by plass;
$$;

-- Elevens egen status: saldo (tjent minus innløst), denne uka, i dag (mot taket,
-- uten rekordbonus), dager på rad og rekordbonuser i dag.
create function public.min_poengstatus()
returns table (saldo int, denne_uka int, i_dag int, tak int, streak int, rekorder_i_dag int, rekordtak int)
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce(sum(l.endring), 0)::int,
    coalesce(sum(l.endring) filter (
      where l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch', 'rekord')
        and l.dag >= date_trunc('week', public.minne_i_dag())::date
    ), 0)::int,
    coalesce(sum(l.endring) filter (
      where l.endring > 0 and l.grunn in ('oving', 'dagsbonus', 'formelmatch') and l.dag = public.minne_i_dag()
    ), 0)::int,
    150,
    public.poeng_streak(auth.uid()),
    (count(*) filter (where l.grunn = 'rekord' and l.dag = public.minne_i_dag()))::int,
    3
  from public.poeng_logg l
  where l.bruker_id = auth.uid();
$$;

-- ---------------------------------------------------------------- Innløsning

-- Hvorfor eleven ikke kan løse inn belønningen akkurat nå (vises før eleven
-- trykker), eller null. Poengsaldoen sjekkes for seg.
create function public.belonning_sperre(p_bruker uuid, b public.belonninger)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when (select p.opprettet from public.profiles p where p.id = p_bruker) > now() - interval '7 days'
      then 'Kontoen må være minst en uke gammel før du kan løse inn.'
    when b.type = 'kreditt' and exists (
      select 1 from public.kreditter k
      where k.bruker_id = p_bruker and k.status <> 'angret' and k.laget > now() - interval '30 days'
    ) then 'Gratis tid kan løses inn én gang i måneden. Neste gang: ' || to_char((
      select max(k.laget) + interval '30 days' from public.kreditter k
      where k.bruker_id = p_bruker and k.status <> 'angret'
    ) at time zone 'Europe/Oslo', 'DD.MM.YYYY') || '.'
    when b.type = 'venn' and (
      select count(*) from public.vennegaver v where v.giver = p_bruker and v.status = 'aktiv' and v.gyldig_til > now()
    ) >= 3 then 'Du har sendt tre gaver som ikke er brukt ennå. Når en er brukt eller har gått ut, kan du sende en ny.'
    when b.type = 'ting' and exists (
      select 1 from public.eiendeler e where e.bruker_id = p_bruker and e.ting = b.verdi
    ) then 'Du har denne allerede.'
  end;
$$;

create function public.belonninger_med_lager()
returns table (
  id uuid, partner text, tittel text, beskrivelse text, vilkar text, lenke text,
  poengpris int, gyldig_til date, type text, verdi text, igjen int, innlost_av_meg boolean, sperret text
)
language sql
stable
security definer
set search_path = ''
as $$
  select b.id, b.partner, b.tittel, b.beskrivelse, b.vilkar, b.lenke, b.poengpris, b.gyldig_til, b.type, b.verdi,
         -- Lager bare for partnerkoder; Studers egne er ubegrensede (null).
         case when b.type = 'kode' then
           (select count(*)::int from public.kuponger k where k.belonning_id = b.id and k.bruker_id is null)
         end,
         case b.type
           when 'kode' then exists (select 1 from public.kuponger k where k.belonning_id = b.id and k.bruker_id = auth.uid())
           when 'ting' then exists (select 1 from public.eiendeler e where e.bruker_id = auth.uid() and e.ting = b.verdi)
           else false
         end,
         public.belonning_sperre(auth.uid(), b)
  from public.belonninger b
  where b.aktiv and (b.gyldig_til is null or b.gyldig_til >= public.minne_i_dag())
  order by b.type <> 'kode', b.poengpris, b.tittel;
$$;

-- Løser inn en belønning: trekker poengene og gir eleven det hen kjøpte, alt i
-- én transaksjon. Låsen per elev hindrer at samme poeng brukes to ganger.
--   kode: en ledig partnerkode     ting: tingen legges i eiendeler
--   kreditt: går via serverfunksjonen «betaling»
--   venn: går via serverfunksjonen «vennegave» (som sender e-posten)
create function public.los_inn(p_belonning uuid)
returns table (kode text, partner text, lenke text, saldo int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bruker uuid := auth.uid();
  v_b public.belonninger;
  v_saldo int;
  v_kode text;
  v_sperre text;
begin
  if v_bruker is null then
    raise exception 'Ikke innlogget';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_bruker::text, 0));

  select * into v_b from public.belonninger b
  where b.id = p_belonning and b.aktiv and (b.gyldig_til is null or b.gyldig_til >= public.minne_i_dag());
  if not found then
    raise exception 'Belønningen finnes ikke lenger';
  end if;
  if v_b.type = 'kreditt' then
    raise exception 'Gratis tid løses inn fra belønningssiden.';
  end if;
  if v_b.type = 'venn' then
    raise exception 'Gaver til venner sendes fra belønningssiden.';
  end if;
  -- Nye kontoer kan ikke løse inn med en gang, så det ikke lønner seg å lage
  -- mange kontoer for å samle koder (sjekkes i belonning_sperre).
  v_sperre := public.belonning_sperre(v_bruker, v_b);
  if v_sperre is not null then
    raise exception '%', v_sperre;
  end if;

  select coalesce(sum(l.endring), 0) into v_saldo from public.poeng_logg l where l.bruker_id = v_bruker;
  if v_saldo < v_b.poengpris then
    raise exception 'Du har ikke nok poeng';
  end if;

  if v_b.type = 'kode' then
    if exists (select 1 from public.kuponger k where k.belonning_id = p_belonning and k.bruker_id = v_bruker) then
      raise exception 'Du har allerede løst inn denne belønningen';
    end if;
    update public.kuponger k
    set bruker_id = v_bruker, innlost = now()
    where k.id = (
      select k2.id from public.kuponger k2
      where k2.belonning_id = p_belonning and k2.bruker_id is null
      order by k2.id
      limit 1
      for update skip locked
    )
    returning k.kode into v_kode;
    if v_kode is null then
      raise exception 'Belønningen er utsolgt';
    end if;
  elsif v_b.type = 'ting' then
    insert into public.eiendeler (bruker_id, ting, belonning_id) values (v_bruker, v_b.verdi, v_b.id);
  end if;

  insert into public.poeng_logg (bruker_id, endring, grunn, belonning_id)
  values (v_bruker, -v_b.poengpris, 'innlosning', p_belonning);

  return query select v_kode, v_b.partner, v_b.lenke, v_saldo - v_b.poengpris;
end;
$$;

-- Gratis tid, første halvdel (bare serverfunksjonen «betaling», med secret-nøkkelen):
-- sjekker, trekker poengene og lagrer forlengelsen som venter.
create function public.kreditt_start(p_bruker uuid, p_belonning uuid)
returns table (id uuid, dager int, saldo int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_b public.belonninger;
  v_saldo int;
  v_sperre text;
  v_id uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_bruker::text, 0));
  select * into v_b from public.belonninger b
  where b.id = p_belonning and b.type = 'kreditt' and b.aktiv
    and (b.gyldig_til is null or b.gyldig_til >= public.minne_i_dag());
  if not found then
    raise exception 'Belønningen finnes ikke lenger';
  end if;
  v_sperre := public.belonning_sperre(p_bruker, v_b);
  if v_sperre is not null then
    raise exception '%', v_sperre;
  end if;
  select coalesce(sum(l.endring), 0) into v_saldo from public.poeng_logg l where l.bruker_id = p_bruker;
  if v_saldo < v_b.poengpris then
    raise exception 'Du har ikke nok poeng';
  end if;
  insert into public.kreditter (bruker_id, belonning_id, dager, poeng)
  values (p_bruker, v_b.id, v_b.verdi::int, v_b.poengpris)
  returning kreditter.id into v_id;
  insert into public.poeng_logg (bruker_id, endring, grunn, belonning_id)
  values (p_bruker, -v_b.poengpris, 'innlosning', v_b.id);
  return query select v_id, v_b.verdi::int, v_saldo - v_b.poengpris;
end;
$$;

-- Perioden er forlenget i Stripe.
create function public.kreditt_ferdig(p_id uuid, p_stripe_id text, p_til timestamptz)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.kreditter set status = 'ferdig', stripe_id = p_stripe_id, ny_slutt = p_til
  where id = p_id and status = 'venter';
$$;

-- Stripe feilet: gi poengene tilbake.
create function public.kreditt_angre(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.kreditter;
begin
  update public.kreditter set status = 'angret' where id = p_id and status = 'venter' returning * into v;
  if found then
    insert into public.poeng_logg (bruker_id, endring, grunn, belonning_id)
    values (v.bruker_id, v.poeng, 'korrigering', v.belonning_id);
  end if;
end;
$$;

-- Gave til en venn, første halvdel (bare serverfunksjonen «vennegave», med
-- secret-nøkkelen): sjekker, trekker poengene og lagrer gaven. Så sender
-- funksjonen e-posten; feiler den, gis poengene tilbake (vennegave_angre).
-- Svaret sier ikke om adressen har en konto hos Studer.
create function public.vennegave_lag(p_bruker uuid, p_belonning uuid, p_epost text)
returns table (id uuid, dager int, fra text, gyldig_til timestamptz, saldo int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_b public.belonninger;
  v_epost text := lower(trim(coalesce(p_epost, '')));
  v_saldo int;
  v_sperre text;
  v_id uuid;
  v_til timestamptz;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_bruker::text, 0));
  if length(v_epost) > 254 or v_epost !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
    raise exception 'Skriv en gyldig e-postadresse.';
  end if;
  select * into v_b from public.belonninger b
  where b.id = p_belonning and b.type = 'venn' and b.aktiv
    and (b.gyldig_til is null or b.gyldig_til >= public.minne_i_dag());
  if not found then
    raise exception 'Belønningen finnes ikke lenger';
  end if;
  v_sperre := public.belonning_sperre(p_bruker, v_b);
  if v_sperre is not null then
    raise exception '%', v_sperre;
  end if;
  if exists (select 1 from auth.users u where u.id = p_bruker and lower(u.email) = v_epost) then
    raise exception 'Gaven er til en venn, så du kan ikke sende den til deg selv.';
  end if;
  if exists (
    select 1 from public.vennegaver v
    where v.giver = p_bruker and v.epost = v_epost and v.status in ('aktiv', 'brukt')
  ) then
    raise exception 'Du har allerede sendt en gave til denne adressen.';
  end if;
  select coalesce(sum(l.endring), 0) into v_saldo from public.poeng_logg l where l.bruker_id = p_bruker;
  if v_saldo < v_b.poengpris then
    raise exception 'Du har ikke nok poeng';
  end if;
  insert into public.vennegaver (giver, belonning_id, epost, dager, poeng)
  values (p_bruker, v_b.id, v_epost, v_b.verdi::int, v_b.poengpris)
  returning vennegaver.id, vennegaver.gyldig_til into v_id, v_til;
  insert into public.poeng_logg (bruker_id, endring, grunn, belonning_id)
  values (p_bruker, -v_b.poengpris, 'innlosning', v_b.id);
  return query select v_id, v_b.verdi::int, public.gavenavn(p_bruker), v_til, v_saldo - v_b.poengpris;
end;
$$;

-- E-posten kunne ikke sendes: gi poengene tilbake.
create function public.vennegave_angre(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.vennegaver;
begin
  update public.vennegaver set status = 'angret' where id = p_id and status = 'aktiv' returning * into v;
  if found and v.giver is not null then
    insert into public.poeng_logg (bruker_id, endring, grunn, belonning_id)
    values (v.giver, v.poeng, 'korrigering', v.belonning_id);
  end if;
end;
$$;

-- Vennen løser inn gaven (knappen på /abonnement). Eleven må ha bekreftet
-- e-postadressen gaven ble sendt til, og være ny: ikke abonnement nå, ikke hatt
-- prøveperiode eller abonnement før (også med samme e-post på en annen konto),
-- og ikke brukt en gave før. Da brukes den eldste gaven, og eleven får tilgang
-- i dagene fra nå (profiles.gave_til). Ingen kort, ingen Stripe.
create function public.vennegave_los_inn()
returns table (til timestamptz, dager int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bruker uuid := auth.uid();
  v_epost text;
  v_nokkel text;
  v public.vennegaver;
  v_til timestamptz;
begin
  if v_bruker is null then
    raise exception 'Ikke innlogget';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_bruker::text, 0));
  select lower(u.email) into v_epost from auth.users u where u.id = v_bruker and u.email_confirmed_at is not null;
  if v_epost is null then
    raise exception 'Bekreft e-postadressen din først.';
  end if;
  v_nokkel := public.provetid_epostnokkel(v_epost);
  if exists (
    select 1 from public.vennegaver b
    where b.status = 'brukt' and (b.brukt_av = v_bruker or b.brukt_nokkel = v_nokkel)
  ) then
    raise exception 'Du har allerede brukt en gave fra en venn.';
  end if;
  if exists (select 1 from public.profiles p where p.id = v_bruker and (p.abonnement <> 'gratis' or p.provetid_brukt))
     or not public.provetid_tilgjengelig(v_bruker, v_epost) then
    raise exception 'Gaven er for nye brukere, og du har hatt abonnement eller prøveperiode før.';
  end if;

  update public.vennegaver g
  set status = 'brukt', brukt_av = v_bruker, brukt = now(), brukt_nokkel = v_nokkel
  where g.id = (
    select g2.id from public.vennegaver g2
    where g2.epost = v_epost and g2.status = 'aktiv' and g2.gyldig_til > now() and g2.giver is distinct from v_bruker
    order by g2.laget
    limit 1
    for update skip locked
  )
  returning g.* into v;
  if not found then
    raise exception 'Fant ingen gave til e-postadressen din.';
  end if;

  v_til := now() + make_interval(days => v.dager);
  update public.profiles set gave_til = v_til where id = v_bruker;
  return query select v_til, v.dager;
end;
$$;

-- Hver natt: gaver som ikke kan brukes lenger (gått ut, eller vennen har brukt
-- en annen gave) gir poengene tilbake, og adressen skjules når gaven er ferdig.
create function public.vennegaver_rydd()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  with ute as (
    update public.vennegaver v set status = 'utlopt'
    where v.status = 'aktiv' and (
      v.gyldig_til <= now()
      or exists (
        select 1 from public.vennegaver b
        join auth.users u on u.id = b.brukt_av
        where b.status = 'brukt' and lower(u.email) = v.epost
      )
    )
    returning v.giver, v.poeng, v.belonning_id
  )
  insert into public.poeng_logg (bruker_id, endring, grunn, belonning_id)
  select ute.giver, ute.poeng, 'korrigering', ute.belonning_id from ute where ute.giver is not null;

  update public.vennegaver set epost = public.skjul_epost(epost)
  where status <> 'aktiv' and position('•••@' in epost) = 0;
end;
$$;

-- Gavene eleven har sendt (ikke de som aldri ble sendt).
create function public.mine_vennegaver()
returns table (id uuid, epost text, dager int, status text, laget timestamptz, gyldig_til timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select v.id, v.epost, v.dager,
         case when v.status = 'aktiv' and v.gyldig_til <= now() then 'utlopt' else v.status end,
         v.laget, v.gyldig_til
  from public.vennegaver v
  where v.giver = auth.uid() and v.status <> 'angret'
  order by v.laget desc;
$$;

-- En gave eleven kan løse inn nå (vises på abonnementssiden). Samme krav som
-- vennegave_los_inn, så knappen bare vises når innløsningen går.
create function public.min_vennegave()
returns table (fra text, dager int, gyldig_til timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select public.gavenavn(v.giver), v.dager, v.gyldig_til
  from public.vennegaver v
  join auth.users u on u.id = auth.uid() and u.email_confirmed_at is not null and lower(u.email) = v.epost
  join public.profiles p on p.id = u.id and p.abonnement = 'gratis' and not p.provetid_brukt
  where v.status = 'aktiv' and v.gyldig_til > now() and v.giver is distinct from auth.uid()
    and public.provetid_tilgjengelig(u.id, u.email)
    and not exists (
      select 1 from public.vennegaver b
      where b.status = 'brukt' and (b.brukt_av = u.id or b.brukt_nokkel = public.provetid_epostnokkel(u.email))
    )
  order by v.laget
  limit 1;
$$;

create function public.mine_kuponger()
returns table (kode text, partner text, tittel text, lenke text, vilkar text, gyldig_til date, innlost timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select k.kode, b.partner, b.tittel, b.lenke, b.vilkar, b.gyldig_til, k.innlost
  from public.kuponger k
  join public.belonninger b on b.id = k.belonning_id
  where k.bruker_id = auth.uid()
  order by k.innlost desc;
$$;

-- ---------------------------------------------------------------- Rettigheter

revoke execute on function public.poeng_streak(uuid) from public, anon, authenticated;
revoke execute on function public.visningsnavn(text) from public, anon, authenticated;
revoke execute on function public.rangeringsnavn(text, boolean, text) from public, anon, authenticated;
revoke execute on function public.kallenavn_feil(text) from public, anon;
revoke execute on function public.kallenavn_kort(text) from public, anon;
revoke execute on function public.kallenavn_delord() from public, anon;
revoke execute on function public.kallenavn_forstavelser() from public, anon;
revoke execute on function public.kallenavn_helord() from public, anon;
revoke execute on function public.kallenavn_tell_sjekk(uuid, int, int) from public, anon, authenticated;
-- Kallenavnsjekken kan også kjøres av en innlogget elev (ren funksjon, ingen data).
grant execute on function public.kallenavn_feil(text) to authenticated;
grant execute on function public.kallenavn_kort(text) to authenticated;
grant execute on function public.kallenavn_delord() to authenticated;
grant execute on function public.kallenavn_forstavelser() to authenticated;
grant execute on function public.kallenavn_helord() to authenticated;
revoke execute on function public.gi_poeng(uuid, text, text, numeric, int) from public, anon, authenticated;

revoke execute on function public.lagre_resultat(text, text, numeric, int) from public, anon;
revoke execute on function public.start_formelmatch(text) from public, anon;
revoke execute on function public.avslutt_formelmatch(uuid, int, int, int) from public, anon;
revoke execute on function public.formelmatch_toppliste(text, int) from public, anon;
revoke execute on function public.poengliste(text, int) from public, anon;
revoke execute on function public.skoleliste(int) from public, anon;
revoke execute on function public.min_poengstatus() from public, anon;
revoke execute on function public.belonninger_med_lager() from public, anon;
revoke execute on function public.los_inn(uuid) from public, anon;
revoke execute on function public.mine_kuponger() from public, anon;
revoke execute on function public.mine_vennegaver() from public, anon;
revoke execute on function public.min_vennegave() from public, anon;
revoke execute on function public.belonning_sperre(uuid, public.belonninger) from public, anon, authenticated;
revoke execute on function public.sjekk_valgte_ting() from public, anon, authenticated;
revoke execute on function public.kreditt_start(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.kreditt_ferdig(uuid, text, timestamptz) from public, anon, authenticated;
revoke execute on function public.kreditt_angre(uuid) from public, anon, authenticated;
revoke execute on function public.gavenavn(uuid) from public, anon, authenticated;
revoke execute on function public.skjul_epost(text) from public, anon, authenticated;
revoke execute on function public.vennegave_lag(uuid, uuid, text) from public, anon, authenticated;
revoke execute on function public.vennegave_angre(uuid) from public, anon, authenticated;
revoke execute on function public.vennegave_los_inn() from public, anon;
revoke execute on function public.vennegaver_rydd() from public, anon, authenticated;

grant execute on function public.lagre_resultat(text, text, numeric, int) to authenticated;
grant execute on function public.start_formelmatch(text) to authenticated;
grant execute on function public.avslutt_formelmatch(uuid, int, int, int) to authenticated;
grant execute on function public.formelmatch_toppliste(text, int) to authenticated;
grant execute on function public.poengliste(text, int) to authenticated;
grant execute on function public.skoleliste(int) to authenticated;
grant execute on function public.min_poengstatus() to authenticated;
grant execute on function public.belonninger_med_lager() to authenticated;
grant execute on function public.los_inn(uuid) to authenticated;
grant execute on function public.mine_kuponger() to authenticated;
grant execute on function public.mine_vennegaver() to authenticated;
grant execute on function public.min_vennegave() to authenticated;
grant execute on function public.vennegave_los_inn() to authenticated;

-- Gaver til venner: poeng tilbake for gaver som ikke ble brukt, og adressene
-- skjules (pg_cron er slått på i 20260930201321_forslag_og_opprydding.sql).
select cron.schedule('rydd-vennegaver', '30 3 * * *', $$ select public.vennegaver_rydd(); $$);

-- ---------------------------------------------------------------- Studers egne belønninger
--
-- Prisene kan endres her eller senere (update public.belonninger set poengpris …).
-- Til sammenligning: en elev som øver hver dag, tjener rundt 50–150 poeng per dag.

insert into public.belonninger (partner, tittel, beskrivelse, vilkar, poengpris, type, verdi) values
  ('Studer', 'En gratis uke', 'Abonnementet ditt varer en uke lenger, så neste betaling kommer en uke senere.', 'Gjelder abonnementet ditt. Gratis tid kan løses inn én gang i måneden.', 1500, 'kreditt', '7'),
  ('Studer', 'Gi en venn en gratis uke', 'Skriv e-postadressen til en venn som ikke har Studer. Vennen får en e-post fra oss og én uke gratis – uten å legge inn kort.', 'Bare for nye brukere. Brukes ikke gaven innen 60 dager, får du poengene tilbake.', 800, 'venn', '7'),
  ('Studer', 'Blå flamme', 'Rekka di brenner blått.', '', 400, 'ting', 'flamme-bla'),
  ('Studer', 'Grønn flamme', 'Rekka di brenner grønt.', '', 400, 'ting', 'flamme-gronn'),
  ('Studer', 'Regnbueflamme', 'Rekka di skifter farge mens den brenner.', '', 1200, 'ting', 'flamme-regnbue'),
  ('Studer', 'Stjernekonfetti', 'Stjerner i stedet for papirlapper når du får til noe.', '', 600, 'ting', 'konfetti-stjerner'),
  ('Studer', 'Fjærkonfetti', 'Fjærpenner som daler ned når du får til noe.', '', 600, 'ting', 'konfetti-fjaer'),
  ('Studer', 'Fjærpenn ved navnet', 'Vises ved navnet ditt på rangeringene.', '', 500, 'ting', 'merke-fjaer'),
  ('Studer', 'Lyspære ved navnet', 'Vises ved navnet ditt på rangeringene.', '', 500, 'ting', 'merke-lyspare'),
  ('Studer', 'Stjerne ved navnet', 'Vises ved navnet ditt på rangeringene.', '', 500, 'ting', 'merke-stjerne'),
  ('Studer', 'Tema: Nordlys', 'Hele Studer i mørkt, med grønt og lilla nordlys.', '', 1200, 'ting', 'tema-nordlys'),
  ('Studer', 'Tema: Solnedgang', 'Hele Studer i lyst fersken, med oransje og rosa himmel.', '', 1000, 'ting', 'tema-solnedgang'),
  ('Studer', 'Tema: Havdyp', 'Hele Studer i dypblått, med turkis lys.', '', 1000, 'ting', 'tema-havdyp'),
  ('Studer', 'Tema: Skog', 'Hele Studer i mørk skog, med lysegrønt lys.', '', 1000, 'ting', 'tema-skog'),
  ('Studer', 'Tema: Galakse', 'Hele Studer under en lilla stjernehimmel.', '', 1500, 'ting', 'tema-galakse');

-- ---------------------------------------------------------------- Slik legges partnerbelønninger inn
--
-- Bare etter avtale med en ekte partner, og bare tilbud som passer for elever
-- fra 13 år (ikke alkohol, tobakk/snus, energidrikk, pengespill, kosmetiske
-- inngrep eller kredittkjøp). Ingen trekninger eller tilfeldige premier.
--
--   insert into public.belonninger (partner, tittel, beskrivelse, vilkar, lenke, poengpris, gyldig_til)
--   values ('Partner AS', '20 % rabatt', 'Gjelder hele nettbutikken.', 'Minstekjøp 200 kr.', 'https://…', 1500, '2027-06-30')
--   returning id;
--
--   insert into public.kuponger (belonning_id, kode) values ('<id>', 'KODE1'), ('<id>', 'KODE2');
