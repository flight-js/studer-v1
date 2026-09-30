import { sideMetadata } from "@/lib/seo";

// Krever innlogging – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Send forslag",
  sti: "/forslag",
});

export default function ForslagLayout({ children }: LayoutProps<"/forslag">) {
  return children;
}
