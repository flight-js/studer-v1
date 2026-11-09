"use client";

import { Konkurranseside, Ramme } from "@/components/konkurranse/Konkurranseside";
import { KreverInnlogging, Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";

// Konkurransen: poengene dine, ukas rangering og skolene (se Konkurranseside).
export default function KonkurransePage() {
  const { bruker, laster } = useAuth();
  if (laster) return <Ramme><Laster /></Ramme>;
  if (!bruker) return <Ramme><KreverInnlogging /></Ramme>;
  return <Konkurranseside brukerId={bruker.id} />;
}
