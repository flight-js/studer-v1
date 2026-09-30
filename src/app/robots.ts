import type { MetadataRoute } from "next";
import { NETTSTED } from "@/lib/seo";

export const dynamic = "force-static";

// Alt kan leses. Sidene som krever innlogging har noindex i stedet for å
// stenges her – ellers ser ikke Google at de ikke skal i søkeresultatene.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${NETTSTED}/sitemap.xml`,
  };
}
