"use client";

import Link from "next/link";
import { useState } from "react";
import { KATALOG } from "@/lib/forsidedata";

// Fagene på forsiden. På store skjermer står alle trinnene side om side. På
// mobil ble det nesten tre skjermer med lister, så der velger man trinn først
// og ser fagene i to spalter.
export function Fagkatalog() {
  const [valgt, setValgt] = useState(0);
  return (
    <>
      <div
        role="group"
        aria-label="Velg trinn"
        className="lg:hidden mt-12 grid grid-cols-4 gap-1 p-1 rounded-2xl bg-background border border-border"
      >
        {KATALOG.map((t, i) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={i === valgt}
            onClick={() => setValgt(i)}
            className={`py-2.5 rounded-xl text-sm font-semibold transition-[color,background-color,scale] duration-200 active:scale-[0.97] ${
              i === valgt ? "bg-foreground text-background" : "text-ink-soft hover:text-foreground"
            }`}
          >
            {t.navn}
          </button>
        ))}
      </div>
      <div data-vis-gruppe className="mt-8 lg:mt-20 grid lg:grid-cols-7 gap-x-6 gap-y-12">
        {KATALOG.map((t, i) => (
          <div key={t.id} data-vis className={i === valgt ? undefined : "hidden lg:block"}>
            <h3 className="text-xl font-semibold pb-3 mb-4 border-b border-border-strong">{t.navn}</h3>
            {/* rise-rask spilles av på nytt når lista vises etter et trinnbytte. */}
            <ul className="rise-rask columns-2 lg:columns-1 gap-x-6 text-[15px] leading-snug text-ink-soft">
              {t.fag.map((f) => (
                <li key={f.id} className="mb-2 break-inside-avoid">
                  <Link
                    href={`/fag?trinn=${t.id}&fag=${f.id}`}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {f.navn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
