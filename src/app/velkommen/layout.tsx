import { sideMetadata } from "@/lib/seo";

// Steg i registreringen – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Velkommen",
  sti: "/velkommen",
});

export default function VelkommenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
