import { sideMetadata } from "@/lib/seo";

// Krever innlogging eller er et steg i en flyt – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Tema",
  sti: "/tema",
});

export default function TemaLayout({ children }: LayoutProps<"/tema">) {
  return children;
}
