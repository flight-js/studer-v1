"use client";

import { useId } from "react";

// Det eksklusive merket «Katana» (TING i lib/utseende.ts, vises av
// Navnemerke): en katana på skrå uten bakgrunn – mørkt skaft med rødrosa
// omvikling, svart parerplate med gullkant og et blad som går fra mørkt stål
// til rødrosa mot spissen. Glansen som glir langs eggen, gløden og de to
// kronbladene animeres i globals.css (.merke-katana) og står stille ved
// redusert bevegelse.
export function KatanaMerke({ size }: { size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="katana">
      <defs>
        <linearGradient id={`${id}-blad`} x1="9" y1="16" x2="21.6" y2="2.4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b2431" />
          <stop offset="0.45" stopColor="#a8174f" />
          <stop offset="1" stopColor="#ff6f9c" />
        </linearGradient>
      </defs>

      {/* Kronblad som svever ved bladet. */}
      <ellipse className="katana-blad" cx="6.2" cy="7" rx="1.25" ry="0.7" transform="rotate(-30 6.2 7)" fill="#ff7aa5" />
      <ellipse className="katana-blad" cx="12" cy="4.6" rx="1" ry="0.55" transform="rotate(20 12 4.6)" fill="#e8336f" />

      {/* Bladet, med en lys egg. */}
      <path d="M8.7 15.3C12.7 11.5 17 7.2 21.6 2.4C20.4 6.1 16.1 11.2 9.7 16.3Z" fill={`url(#${id}-blad)`} />
      <path d="M9.7 16.3C16.1 11.2 20.4 6.1 21.6 2.4" stroke="#ffd3e1" strokeWidth="0.45" strokeLinecap="round" opacity="0.85" />
      {/* Glansen som glir fra parerplaten mot spissen. */}
      <path
        className="katana-glans"
        d="M9.7 16.3C16.1 11.2 20.4 6.1 21.6 2.4"
        pathLength={100}
        stroke="#ffffff"
        strokeWidth="0.9"
        strokeLinecap="round"
      />

      {/* Habaki (gullhylsen ved bladet). */}
      <path d="M8.5 15.1l1.3 1.3" stroke="#e3b25c" strokeWidth="1.1" strokeLinecap="round" />

      {/* Parerplaten (tsuba). */}
      <ellipse cx="7.7" cy="16.3" rx="2.6" ry="1.2" transform="rotate(45 7.7 16.3)" fill="#160a10" stroke="#e3b25c" strokeWidth="0.45" />

      {/* Skaftet med omvikling og endehette. */}
      <path d="M3.2 20.8l3.7-3.7" stroke="#160a10" strokeWidth="3" strokeLinecap="round" />
      <path d="M3.4 20.6l3.3-3.3" stroke="#e8336f" strokeWidth="1.5" strokeDasharray="0.9 0.75" />
      <circle cx="2.9" cy="21.1" r="1.05" fill="#160a10" stroke="#e3b25c" strokeWidth="0.35" />
    </svg>
  );
}
