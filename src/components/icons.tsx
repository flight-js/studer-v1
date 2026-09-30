// Felles ikonsett – én strektykkelse (1.75) og runde ender overalt.

type IconProps = { size?: number; className?: string };

function Svg({
  size = 20,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const ChevronLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Svg>
);

export const ChevronRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 18l6-6-6-6" />
  </Svg>
);

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const Close = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);

export const Repeat = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5" />
  </Svg>
);

export const Cards = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="8" width="13" height="12" rx="2" />
    <path d="M8 8V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3" />
  </Svg>
);

export const Quiz = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6h10M4 12h7M4 18h10" />
    <path d="M16 11.5l2 2 3.5-4" />
  </Svg>
);

export const Book = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 5.5v15" />
  </Svg>
);

export const Timer = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 9.5v4l2.5 1.5M9.5 2.5h5" />
  </Svg>
);

export const Pen = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16.5 4.5l3 3L8 19l-4 1 1-4L16.5 4.5zM14 7l3 3" />
  </Svg>
);

export const Chat = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-5 4z" />
  </Svg>
);

export const Flag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 21V4.5M5 4.5c2.5-1.5 5-1.5 7 0s4.5 1.5 7 0v9c-2.5 1.5-5 1.5-7 0s-4.5-1.5-7 0" />
  </Svg>
);

export const Instagram = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.75" />
    <circle cx="17.1" cy="6.9" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

// TikTok-logoen er fylt, ikke strek (formen er fra Simple Icons, CC0).
export const TikTok = (p: IconProps) => (
  <Svg {...p}>
    <path
      fill="currentColor"
      stroke="none"
      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
    />
  </Svg>
);

export const ArrowUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Svg>
);

export const Lock = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

export const Mindmap = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="4.5" cy="5.5" r="1.75" />
    <circle cx="19.5" cy="5.5" r="1.75" />
    <circle cx="4.5" cy="18.5" r="1.75" />
    <circle cx="19.5" cy="18.5" r="1.75" />
    <path d="M9.7 10 5.8 6.7M14.3 10l3.9-3.3M9.7 14l-3.9 3.3M14.3 14l3.9 3.3" />
  </Svg>
);

export const LogOut = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9M15 16l4-4-4-4M19 12H9" />
  </Svg>
);
