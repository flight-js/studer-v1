import { sideMetadata } from "@/lib/seo";

// Krever innlogging eller er et steg i en flyt – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Flashcards",
  sti: "/flashcards",
});

export default function FlashcardsLayout({ children }: LayoutProps<"/flashcards">) {
  return children;
}
