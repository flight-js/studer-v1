import { sideMetadata } from "@/lib/seo";

// Krever innlogging – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Konkurranse",
  sti: "/konkurranse",
});

export default function KonkurranseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
