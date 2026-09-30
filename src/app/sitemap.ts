import type { MetadataRoute } from "next";
import { NETTSTED } from "@/lib/seo";

export const dynamic = "force-static";

// Bare sidene som skal i Google (se indekser i lib/seo.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const bygget = new Date();
  return ["/", "/registrer", "/logg-inn"].map((sti) => ({ url: `${NETTSTED}${sti}`, lastModified: bygget }));
}
