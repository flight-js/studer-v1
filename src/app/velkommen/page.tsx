"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useId, useState } from "react";
import { useNeste } from "@/components/AuthRamme";
import { ArrowRight, ChevronLeft } from "@/components/icons";
import { Rangeringsvalg } from "@/components/konkurranse/Konkurranseprofil";
import { Skolevelger } from "@/components/konkurranse/Skolevelger";
import { Logo } from "@/components/Logo";
import { Temavelger } from "@/components/Temavelger";
import { KreverInnlogging, Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";
import { hentKonkurranseprofil, lagreKonkurranseprofil, lagreSkole, type Skole } from "@/lib/konkurranse";
import { hentKatalog } from "@/lib/pensum";
import { lagreTrinn } from "@/lib/profil";
import { useHent } from "@/lib/useHent";

// Rett etter registreringen: trinn, skole og hvordan eleven vil ha det.
// Alt kan hoppes over og endres senere (trinn på startsiden, resten under Konto).
export default function VelkommenPage() {
  return (
    <Suspense>
      <Velkommen />
    </Suspense>
  );
}

type Steg = "trinn" | "skole" | "preferanser";

function Velkommen() {
  const router = useRouter();
  const neste = useNeste();
  const { bruker, laster, profil } = useAuth();
  const id = bruker?.id ?? null;
  const katalog = useHent("katalog", hentKatalog);
  const konkurranse = useHent(id && `konkurranseprofil:${id}`, () => hentKonkurranseprofil(id!));

  const [steg, setSteg] = useState<Steg>("trinn");
  const [trinn, setTrinn] = useState<string | null>(null);
  const [skole, setSkole] = useState<Skole | null | undefined>(undefined);
  const [vis, setVis] = useState<boolean | undefined>(undefined);
  const [lagrer, setLagrer] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);
  const visId = useId();

  if (laster) return <Ramme neste={neste}><Laster /></Ramme>;
  if (!bruker) return <Ramme neste={neste}><KreverInnlogging /></Ramme>;

  // Skole og rangering bare når konkurransen er satt opp (eller under utvikling).
  const k = konkurranse.data;
  const medKonkurranse = !!k && !(k.demo && process.env.NODE_ENV === "production");
  const stegene: Steg[] = medKonkurranse ? ["trinn", "skole", "preferanser"] : ["trinn", "preferanser"];
  const nr = stegene.indexOf(steg);
  const valgtTrinn = trinn ?? profil?.trinn ?? null;
  const valgtSkole = skole === undefined ? (k?.data.skole ?? null) : skole;
  const valgtVis = vis ?? k?.data.vis ?? false;
  const fornavn = (profil?.navn || (bruker.user_metadata?.navn as string | undefined) || "").trim().split(/\s+/)[0];

  async function videre() {
    setLagrer(true);
    setFeil(null);
    try {
      if (steg === "trinn" && valgtTrinn && valgtTrinn !== profil?.trinn) await lagreTrinn(bruker!.id, valgtTrinn);
      // Skolen lagres med en gang, så den ikke går tapt hvis eleven hopper over resten.
      if (steg === "skole" && valgtSkole && !k!.demo && valgtSkole.id !== k!.data.skole?.id) await lagreSkole(bruker!.id, valgtSkole.id);
      if (steg === "preferanser" && medKonkurranse && !k!.demo) {
        await lagreKonkurranseprofil(bruker!.id, { skoleId: valgtSkole?.id ?? null, vis: valgtVis });
      }
      if (nr + 1 < stegene.length) setSteg(stegene[nr + 1]);
      else router.replace(neste);
    } catch (e) {
      setFeil((e as Error).message);
    } finally {
      setLagrer(false);
    }
  }

  return (
    <Ramme neste={neste}>
      <main id="innhold" className="relative flex-1 flex flex-col">
        {/* Lampelyset bak spørsmålet, som på forsiden og startsiden. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-24 -z-0 size-[min(760px,120vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,217,140,0.13),rgba(255,217,140,0.04)_60%,transparent)]"
        />
        <div className="relative w-full max-w-xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-16 flex-1 flex flex-col gap-10">
          {/* Fremdrift */}
          <div className="flex items-center gap-3">
            <ol className="flex gap-1.5 flex-1" aria-label={`Steg ${nr + 1} av ${stegene.length}`}>
              {stegene.map((s, i) => (
                <li
                  key={s}
                  aria-hidden="true"
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= nr ? "bg-merke" : "bg-background/15"}`}
                />
              ))}
            </ol>
            <span className="text-xs font-medium text-background/60 tabular-nums">
              {nr + 1} av {stegene.length}
            </span>
          </div>

          <div key={steg} className="rise-rask flex flex-col gap-8">
            {steg === "trinn" && (
              <>
                <Sporsmal
                  over={fornavn ? `Velkommen, ${fornavn}!` : "Velkommen til Studer!"}
                  tittel="Hvilket trinn går du på?"
                  tekst="Da viser vi fagene dine først. Du kan bytte når du vil."
                />
                {katalog.laster ? (
                  <span className="h-40 rounded-2xl bg-background/10 animate-pulse" aria-hidden="true" />
                ) : katalog.feil ? (
                  <p className="text-background/75">Fikk ikke hentet trinnene. Du kan velge trinn senere på startsiden.</p>
                ) : (
                  <div role="radiogroup" aria-label="Trinn" className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {katalog.data?.map((t) => {
                      const valgt = t.id === valgtTrinn;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          role="radio"
                          aria-checked={valgt}
                          onClick={() => setTrinn(t.id)}
                          className={`rounded-2xl border-[1.5px] px-4 py-4 text-left font-display text-xl font-semibold transition-[background-color,border-color,color,scale] duration-200 active:scale-[0.98] ${
                            valgt
                              ? "bg-merke border-merke text-foreground"
                              : "border-natt-linje hover:border-background/40 hover:bg-natt-hevet"
                          }`}
                        >
                          {t.navn}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {steg === "skole" && (
              <>
                <Sporsmal
                  tittel="Hvilken skole går du på?"
                  tekst="Poengene dine teller for skolen i skolekonkurransen. Den viser bare tall per skole, aldri hvem som er med."
                />
                <Skolevelger valgt={valgtSkole} onVelg={setSkole} etikett="" mork />
                {k?.demo && <p className="text-xs text-background/55">Eksempel: konkurransen er ikke slått på ennå, så skolen blir ikke lagret.</p>}
              </>
            )}

            {steg === "preferanser" && (
              <>
                <Sporsmal tittel="Sånn vil du ha det" tekst="Alt kan endres senere under Konto." />
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-semibold">Utseende</span>
                    <div>
                      <Temavelger medTekst mork />
                    </div>
                  </div>
                  {medKonkurranse && (
                    <div className="border-t border-natt-linje pt-6">
                      <Rangeringsvalg id={visId} vis={valgtVis} onEndre={setVis} mork />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-3">
            {feil && (
              <p role="alert" className="text-sm text-[#ffb4a8]">
                {feil}
              </p>
            )}
            <div className="flex items-center justify-between gap-3">
              {nr > 0 ? (
                <button
                  type="button"
                  onClick={() => setSteg(stegene[nr - 1])}
                  className="inline-flex items-center gap-1.5 -ml-2 px-2 py-2 rounded-lg text-sm font-semibold text-background/70 hover:text-background hover:bg-natt-hevet transition-colors duration-200"
                >
                  <ChevronLeft size={16} />
                  Tilbake
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={videre}
                disabled={lagrer || (steg === "trinn" && !valgtTrinn && !katalog.feil)}
                className="group inline-flex items-center gap-2 rounded-xl bg-merke text-foreground px-6 py-3.5 text-sm font-semibold transition-[background-color,scale,opacity] duration-200 hover:bg-merke-dark active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {lagrer
                  ? "Lagrer …"
                  : nr + 1 < stegene.length
                    ? steg === "skole" && !valgtSkole
                      ? "Hopp over"
                      : "Neste"
                    : "Kom i gang"}
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </Ramme>
  );
}

function Ramme({ neste, children }: { neste: string; children: React.ReactNode }) {
  return (
    <div className="fs-natt flex flex-col flex-1 min-h-svh bg-natt text-background">
      <header className="max-w-xl w-full mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Logo className="text-[26px]" />
        <Link
          href={neste}
          className="px-3 py-2 -mr-3 rounded-lg text-sm font-medium text-background/65 hover:text-background hover:bg-natt-hevet transition-colors duration-200"
        >
          Hopp over
        </Link>
      </header>
      {children}
    </div>
  );
}

function Sporsmal({ over, tittel, tekst }: { over?: string; tittel: string; tekst: string }) {
  return (
    <div className="flex flex-col gap-3">
      {over && <p className="text-sm font-medium text-merke">{over}</p>}
      <h1 className="font-semibold text-4xl sm:text-5xl tracking-[-0.03em] leading-[1.02]">{tittel}</h1>
      <p className="text-lg text-background/70 leading-relaxed max-w-[44ch]">{tekst}</p>
    </div>
  );
}
