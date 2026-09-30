import { sideMetadata } from "@/lib/seo";

// Krever innlogging eller er et steg i en flyt – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Abonnement",
  sti: "/abonnement",
});

export default function AbonnementLayout({ children }: LayoutProps<"/abonnement">) {
  return children;
}
