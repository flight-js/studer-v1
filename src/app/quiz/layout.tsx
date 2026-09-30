import { sideMetadata } from "@/lib/seo";

// Krever innlogging eller er et steg i en flyt – holdes utenfor Google.
export const metadata = sideMetadata({
  tittel: "Quiz",
  sti: "/quiz",
});

export default function QuizLayout({ children }: LayoutProps<"/quiz">) {
  return children;
}
