import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { oktNokkel } from "@/lib/supabase";
import { BESKRIVELSE, DELING, NAVN, NETTSTED, TITTEL, TITTELMAL } from "@/lib/seo";

// Skriftene lastes ned ved bygging og serveres fra studer.no, så siden ikke
// venter på Google Fonts før den vises.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(NETTSTED),
  applicationName: NAVN,
  title: {
    default: TITTEL,
    template: TITTELMAL,
  },
  description: BESKRIVELSE,
  openGraph: { ...DELING, title: TITTEL, description: BESKRIVELSE },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
};

// Kjøres før forsiden tegnes: skjul markedssiden hvis det finnes en lagret
// økt (se Startside i components/Forside.tsx), og skjul heroens lampe til
// introen starter – men bare når bevegelse er tillatt (se .fs-intro i
// globals.css). Ligger her og ikke i app/page.tsx fordi rot-layouten bare
// hydreres én gang; et skript i siden ville blitt laget på nytt av React ved
// navigering, og da kjøres det aldri.
const forhandsskript = `try{if(location.pathname==="/"){if(localStorage.getItem(${JSON.stringify(oktNokkel)}))document.documentElement.classList.add("har-okt");if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("fs-intro")}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nb"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${instrumentSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script dangerouslySetInnerHTML={{ __html: forhandsskript }} />
        <a
          href="#innhold"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:bg-foreground focus:text-white focus:px-4 focus:py-2.5 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Hopp til innhold
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
