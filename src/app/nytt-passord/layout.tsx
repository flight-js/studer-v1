import { sideMetadata } from "@/lib/seo";

// Krever innlogging eller er et steg i en flyt – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Nytt passord",
  sti: "/nytt-passord",
});

export default function NyttPassordLayout({ children }: LayoutProps<"/nytt-passord">) {
  return children;
}
