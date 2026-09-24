import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Studer – øv på hele pensum",
    template: "%s · Studer",
  },
  description:
    "Studer – flashcards, quiz og miniprøver for hele pensum, fra ungdomsskole til Vg3.",
  openGraph: {
    title: "Studer – øv på hele pensum",
    description:
      "Velg trinn, fag og tema. Flashcards, quiz og miniprøver ligger ferdig laget.",
    locale: "nb_NO",
    type: "website",
    siteName: "Studer",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nb" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this is the root layout, so the font applies app-wide, not to a single page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#innhold"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:bg-foreground focus:text-white focus:px-4 focus:py-2.5 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Hopp til innhold
        </a>
        {children}
      </body>
    </html>
  );
}
