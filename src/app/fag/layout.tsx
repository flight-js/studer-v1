import { sideMetadata } from "@/lib/seo";

// Krever innlogging eller er et steg i en flyt – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Fag og temaer",
  sti: "/fag",
});

export default function FagLayout({ children }: LayoutProps<"/fag">) {
  return children;
}
