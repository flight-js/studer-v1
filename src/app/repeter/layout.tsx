import { sideMetadata } from "@/lib/seo";

// Krever innlogging og abonnement – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Repeter",
  sti: "/repeter",
});

export default function RepeterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
