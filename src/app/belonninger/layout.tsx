import { sideMetadata } from "@/lib/seo";

// Krever innlogging – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Belønninger",
  sti: "/belonninger",
});

export default function BelonningerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
