import { sideMetadata } from "@/lib/seo";

// Krever innlogging eller er et steg i en flyt – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Min konto",
  sti: "/konto",
});

export default function KontoLayout({ children }: LayoutProps<"/konto">) {
  return children;
}
