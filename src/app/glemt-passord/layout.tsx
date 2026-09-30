import { sideMetadata } from "@/lib/seo";

// Krever innlogging eller er et steg i en flyt – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Glemt passord",
  sti: "/glemt-passord",
});

export default function GlemtPassordLayout({ children }: LayoutProps<"/glemt-passord">) {
  return children;
}
