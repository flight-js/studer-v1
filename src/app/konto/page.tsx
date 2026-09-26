"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { ArrowRight, LogOut } from "@/components/icons";
import { KreverInnlogging, Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useHent } from "@/lib/useHent";

const ABONNEMENT: Record<string, string> = {
  gratis: "Gratis i testperioden",
  maned: "Månedlig",
  ar: "Årlig",
};

export default function KontoPage() {
  const router = useRouter();
  const { bruker, laster } = useAuth();
  const [loggerUt, setLoggerUt] = useState(false);
  const profil = useHent(bruker ? `profil:${bruker.id}` : null, async () => {
    const { data } = await supabase.from("profiles").select("navn, abonnement").maybeSingle();
    return data;
  });

  async function loggUt() {
    setLoggerUt(true);
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <div className="flex flex-col flex-1">
      <AppBar back="/fag" backLabel="Fag" />
      {laster ? (
        <Laster tekst="Henter kontoen" />
      ) : !bruker ? (
        <KreverInnlogging hva="kontoen din" />
      ) : (
        <main id="innhold" className="px-5 sm:px-8 pt-10 pb-20 flex flex-col gap-10 max-w-2xl w-full mx-auto rise">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted">Din konto</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.02em]">
              Hei{bruker.user_metadata?.navn ? `, ${bruker.user_metadata.navn}` : ""}
            </h1>
          </div>

          <dl className="bg-surface border border-border rounded-2xl divide-y divide-border">
            <Rad navn="E-post" verdi={bruker.email ?? "–"} />
            <Rad
              navn="Medlem siden"
              verdi={new Date(bruker.created_at).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <Rad
              navn="Abonnement"
              verdi={profil.data ? (ABONNEMENT[profil.data.abonnement] ?? profil.data.abonnement) : "…"}
            />
          </dl>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/fag"
              className="group inline-flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
            >
              Fortsett å øve
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/nytt-passord"
              className="inline-flex items-center border-[1.5px] border-border-strong px-5 py-3.5 rounded-xl text-sm font-semibold hover:border-foreground transition-colors active:scale-[0.98]"
            >
              Bytt passord
            </Link>
            <button
              onClick={loggUt}
              disabled={loggerUt}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-muted hover:text-danger-ink hover:bg-danger-tint transition-colors disabled:opacity-60"
            >
              <LogOut size={16} />
              {loggerUt ? "Logger ut …" : "Logg ut"}
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

function Rad({ navn, verdi }: { navn: string; verdi: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-5 sm:px-6 py-4">
      <dt className="text-sm text-muted">{navn}</dt>
      <dd className="font-semibold break-all">{verdi}</dd>
    </div>
  );
}
