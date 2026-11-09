"use client";

import { Belonningsside, Ramme } from "@/components/konkurranse/Belonningsside";
import { KreverInnlogging, Laster } from "@/components/Tilstand";
import { useAuth } from "@/lib/auth";

// Belønninger: poengene løses inn i rabatter og tilbud (se Belonningsside).
export default function BelonningerPage() {
  const { bruker, laster } = useAuth();
  if (laster) return <Ramme><Laster /></Ramme>;
  if (!bruker) return <Ramme><KreverInnlogging /></Ramme>;
  return <Belonningsside brukerId={bruker.id} />;
}
