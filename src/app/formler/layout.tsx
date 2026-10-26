import { sideMetadata } from "@/lib/seo";

// Krever innlogging og abonnement – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Formelmatch",
  sti: "/formler",
});

export default function FormlerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
