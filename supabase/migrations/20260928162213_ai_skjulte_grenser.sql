-- AI-hjelp: skjulte bruksgrenser.
--
-- Eleven ser ikke grensene eller forbruket sitt. Edge-funksjonen «chat»
-- sjekker tre grenser før hvert svar:
--   * per minutt (hindrer spam og skript)
--   * per dag (avhenger av abonnement)
--   * totalt per dag for hele appen (beskytter mot uventet store kostnader)

-- Forbruket er ikke lenger lesbart for eleven.
drop policy "Brukere kan lese eget AI-forbruk" on public.ai_bruk;
revoke select on public.ai_bruk from authenticated;

alter table public.ai_bruk
  add column minutt_start timestamptz not null default now(),
  add column minutt_antall int not null default 0 check (minutt_antall >= 0);

create table public.ai_bruk_totalt (
  dato date primary key,
  antall int not null default 0 check (antall >= 0)
);

alter table public.ai_bruk_totalt enable row level security;
revoke all on public.ai_bruk_totalt from anon, authenticated;

drop function public.ai_registrer_melding(uuid, int);

-- Teller én melding hvis alle grensene tillater det. Returnerer 'ok', eller
-- hvilken grense som stoppet meldingen: 'minutt', 'dag' eller 'global'.
create function public.ai_registrer_melding(
  p_bruker_id uuid,
  p_dagsgrense int,
  p_minuttgrense int,
  p_global_grense int
)
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

  insert into public.ai_bruk (bruker_id, dato, antall, minutt_start, minutt_antall)
  values (p_bruker_id, v_dato, 0, now(), 0)
  on conflict (bruker_id, dato) do nothing;

  -- Låser raden, så samtidige meldinger fra samme elev telles riktig.
  select * into v_rad
  from public.ai_bruk
  where bruker_id = p_bruker_id and dato = v_dato
  for update;

  if v_rad.antall >= p_dagsgrense then
    return 'dag';
  end if;
  if v_rad.minutt_start > now() - interval '1 minute' and v_rad.minutt_antall >= p_minuttgrense then
    return 'minutt';
  end if;

  insert into public.ai_bruk_totalt (dato, antall)
  values (v_dato, 0)
  on conflict (dato) do nothing;

  update public.ai_bruk_totalt
  set antall = antall + 1
  where dato = v_dato and antall < p_global_grense
  returning antall into v_total;

  if v_total is null then
    return 'global';
  end if;

  update public.ai_bruk
  set antall = antall + 1,
      minutt_start = case when minutt_start > now() - interval '1 minute' then minutt_start else now() end,
      minutt_antall = case when minutt_start > now() - interval '1 minute' then minutt_antall + 1 else 1 end
  where bruker_id = p_bruker_id and dato = v_dato;

  return 'ok';
end;
$$;

-- Gir tilbake en melding når AI-tjenesten feilet før svaret kom i gang.
create or replace function public.ai_angre_melding(p_bruker_id uuid)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.ai_bruk
  set antall = antall - 1
  where bruker_id = p_bruker_id
    and dato = (now() at time zone 'Europe/Oslo')::date
    and antall > 0;
  update public.ai_bruk_totalt
  set antall = antall - 1
  where dato = (now() at time zone 'Europe/Oslo')::date
    and antall > 0;
$$;

revoke execute on function public.ai_registrer_melding(uuid, int, int, int) from public, anon, authenticated;
grant execute on function public.ai_registrer_melding(uuid, int, int, int) to service_role;
