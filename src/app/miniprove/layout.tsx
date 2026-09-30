import { sideMetadata } from "@/lib/seo";

// Krever innlogging eller er et steg i en flyt – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Miniprøve",
  sti: "/miniprove",
});

export default function MiniproveLayout({ children }: LayoutProps<"/miniprove">) {
  return children;
}
