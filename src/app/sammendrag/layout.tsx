import { sideMetadata } from "@/lib/seo";

// Krever innlogging eller er et steg i en flyt – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Sammendrag",
  sti: "/sammendrag",
});

export default function SammendragLayout({ children }: LayoutProps<"/sammendrag">) {
  return children;
}
