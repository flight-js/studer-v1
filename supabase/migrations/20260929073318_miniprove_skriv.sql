-- Miniprøve med skriveoppgaver.
--
-- 1. skriveoppgaver: eleven skriver svaret selv, og edge-funksjonen «vurder»
--    retter det mot fasiten og kriteriene (0, ½ eller 1 poeng). Eleven kan lese
--    oppgaveteksten, men ikke fasiten – den kommer fra «vurder» når svaret er rettet.
-- 2. Vurderingene har egne skjulte grenser (kolonnen vurderinger i ai_bruk og
--    ai_bruk_totalt), så prøver og AI-hjelpen ikke spiser av hverandres kvote.
-- 3. fremdrift.beste kan være et halvt poeng.

-- Skriveoppgaver ------------------------------------------------------------------

create table public.skriveoppgaver (
  tema_id text not null references public.temaer (id) on delete cascade,
  nokkel text not null, -- 's01'
  tekst text not null,
  fasit text not null,
  kriterier text[] not null default '{}', -- det som må være med for fullt poeng
  sortering int not null,
  primary key (tema_id, nokkel)
);

alter table public.skriveoppgaver enable row level security;
revoke all on public.skriveoppgaver from anon, authenticated;
grant select (tema_id, nokkel, tekst, sortering) on public.skriveoppgaver to authenticated;

create policy "Abonnenter kan lese skriveoppgaver" on public.skriveoppgaver
  for select to authenticated
  using ((select public.har_tilgang()) and exists (select 1 from public.temaer t where t.id = tema_id and t.publisert));

-- Grenser for vurderinger ---------------------------------------------------------

alter table public.ai_bruk add column vurderinger int not null default 0 check (vurderinger >= 0);
alter table public.ai_bruk_totalt add column vurderinger int not null default 0 check (vurderinger >= 0);

-- Teller én vurdering hvis grensene tillater det. Returnerer 'ok', 'dag' eller 'global'.
create function public.ai_registrer_vurdering(p_bruker_id uuid, p_dagsgrense int, p_global_grense int)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_dato date := (now() at time zone 'Europe/Oslo')::date;
  v_rad public.ai_bruk;
  v_total int;
begin
  if p_dagsgrense < 1 then
    return 'dag';
  end if;

  insert into public.ai_bruk (bruker_id, dato)
  values (p_bruker_id, v_dato)
  on conflict (bruker_id, dato) do nothing;

  -- Låser raden, så samtidige vurderinger fra samme elev telles riktig.
  select * into v_rad
  from public.ai_bruk
  where bruker_id = p_bruker_id and dato = v_dato
  for update;

  if v_rad.vurderinger >= p_dagsgrense then
    return 'dag';
  end if;

  insert into public.ai_bruk_totalt (dato)
  values (v_dato)
  on conflict (dato) do nothing;

  update public.ai_bruk_totalt
  set vurderinger = vurderinger + 1
  where dato = v_dato and vurderinger < p_global_grense
  returning vurderinger into v_total;

  if v_total is null then
    return 'global';
  end if;

  update public.ai_bruk
  set vurderinger = vurderinger + 1
  where bruker_id = p_bruker_id and dato = v_dato;

  return 'ok';
end;
$$;

-- Gir tilbake en vurdering når AI-tjenesten feilet.
create function public.ai_angre_vurdering(p_bruker_id uuid)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.ai_bruk
  set vurderinger = vurderinger - 1
  where bruker_id = p_bruker_id
    and dato = (now() at time zone 'Europe/Oslo')::date
    and vurderinger > 0;
  update public.ai_bruk_totalt
  set vurderinger = vurderinger - 1
  where dato = (now() at time zone 'Europe/Oslo')::date
    and vurderinger > 0;
$$;

revoke execute on function public.ai_registrer_vurdering(uuid, int, int) from public, anon, authenticated;
revoke execute on function public.ai_angre_vurdering(uuid) from public, anon, authenticated;
grant execute on function public.ai_registrer_vurdering(uuid, int, int) to service_role;
grant execute on function public.ai_angre_vurdering(uuid) to service_role;

-- Halve poeng i fremdriften ---------------------------------------------------------

alter table public.fremdrift alter column beste type numeric(5, 1);

drop function public.lagre_resultat(text, text, int, int);

create function public.lagre_resultat(p_tema_id text, p_aktivitet text, p_resultat numeric, p_av int)
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

revoke execute on function public.lagre_resultat(text, text, numeric, int) from public, anon;
grant execute on function public.lagre_resultat(text, text, numeric, int) to authenticated;
