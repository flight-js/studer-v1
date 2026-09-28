-- AI-hjelp: antall meldinger per bruker per dag.
--
-- Selve samtalene lagres ikke – bare hvor mange meldinger brukeren har sendt,
-- slik at edge-funksjonen «chat» kan holde en daglig grense og kostnaden nede.
-- Brukeren kan lese sitt eget forbruk, men ikke endre det. Telleren endres bare
-- av edge-funksjonen med secret-nøkkelen (service_role).

create table public.ai_bruk (
  bruker_id uuid not null references auth.users (id) on delete cascade,
  dato date not null default (now() at time zone 'Europe/Oslo')::date,
  antall int not null default 0 check (antall >= 0),
  primary key (bruker_id, dato)
);

alter table public.ai_bruk enable row level security;

revoke all on public.ai_bruk from anon, authenticated;
grant select on public.ai_bruk to authenticated;

create policy "Brukere kan lese eget AI-forbruk" on public.ai_bruk
  for select to authenticated using ((select auth.uid()) = bruker_id);

-- Teller én melding hvis brukeren er under dagens grense. Returnerer nytt
-- antall, eller -1 hvis grensen er nådd.
create function public.ai_registrer_melding(p_bruker_id uuid, p_grense int)
returns int
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_antall int;
begin
  if p_grense < 1 then
    return -1;
  end if;
  insert into public.ai_bruk (bruker_id, dato, antall)
  values (p_bruker_id, (now() at time zone 'Europe/Oslo')::date, 1)
  on conflict (bruker_id, dato) do update
    set antall = public.ai_bruk.antall + 1
    where public.ai_bruk.antall < p_grense
  returning antall into v_antall;
  return coalesce(v_antall, -1);
end;
$$;

-- Gir tilbake en melding når AI-tjenesten feilet før svaret kom i gang.
create function public.ai_angre_melding(p_bruker_id uuid)
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
$$;

revoke execute on function public.ai_registrer_melding(uuid, int) from public, anon, authenticated;
revoke execute on function public.ai_angre_melding(uuid) from public, anon, authenticated;
grant execute on function public.ai_registrer_melding(uuid, int) to service_role;
grant execute on function public.ai_angre_melding(uuid) to service_role;
