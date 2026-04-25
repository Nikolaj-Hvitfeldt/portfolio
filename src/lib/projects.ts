export type Project = {
  id: string;
  href: string;
  tags: readonly string[];
  /** Public path under `/public`, e.g. `/Amori-icon.png` */
  iconSrc?: string;
  /** Optional per-project image scaling for assets with transparent padding. */
  iconScale?: number;
  /** Optional emoji fallback if `iconSrc` is missing */
  icon?: string;
  /** Full CSS `background` for the projects stack card (e.g. linear-gradient). */
  stackTheme: {
    gradient: string;
    /**
     * `onLight`: reference-style black/zinc text on pale gradients.
     * `onDark` (default): light text for darker / saturated cards.
     */
    textTone?: "onLight" | "onDark";
  };
};

export const PROJECTS: readonly Project[] = [
  {
    id: "amori",
    href: "https://github.com/Nikolaj-Hvitfeldt/amori",
    tags: ["React", "PostgreSQL", "TypeScript", "Tailwind"],
    iconSrc: "/amori-icon.png",
    icon: "💞",
    stackTheme: {
      textTone: "onLight",
      gradient:
        "linear-gradient(102deg, #9d174d 0%, #db2777 24%, #f472b6 44%, #f896be 60%, #fdf2f8 100%)",
    },
  },
  {
    id: "quartermark",
    href: "https://github.com/Nikolaj-Hvitfeldt/quartermark",
    tags: ["React", "C#", ".NET", "SignalR"],
    iconSrc: "/quartermark-icon.png",
    icon: "🎉",
    stackTheme: {
      textTone: "onLight",
      gradient:
        "linear-gradient(102deg, #1e1b4b 0%, #3b1f7a 16%, #5b21b6 32%, #7041f4 52%, #c4b5fd 80%, #faf5ff 100%)",
    },
  },
  {
    id: "yeetcraft",
    href: "https://github.com/Nikolaj-Hvitfeldt/Yeetcraft",
    tags: ["Kotlin", "React", "TanStack", "TypeScript"],
    iconSrc: "/yeetcraft-icon.png",
    icon: "🎮",
    stackTheme: {
      textTone: "onLight",
      gradient:
        "linear-gradient(102deg, #365314 0%, #4d7c0f 22%, #84cc16 44%, #c9dc7b 64%, #f7fee7 100%)",
    },
  },
  {
    id: "lineup",
    href: "https://github.com/andreasbbusk/lineup",
    tags: [
      "TypeScript",
      "React",
      "Tailwind",
      "Supabase",
      "Realtime",
      "TanStack",
    ],
    iconSrc: "/Lineup-icon.png",
    icon: "🎵",
    stackTheme: {
      textTone: "onLight",
      gradient:
        "linear-gradient(102deg, #3b0764 0%, #6d28d9 26%, #7c3aed 42%, #9f52f2 58%, #ede9fe 88%, #faf5ff 100%)",
    },
  },
  {
    id: "memoir",
    href: "#",
    tags: ["WIP", "TBD"],
    iconSrc: "/Memoir-icon.png",
    iconScale: 1.32,
    icon: "📘",
    stackTheme: {
      textTone: "onLight",
      gradient:
        "linear-gradient(102deg, #44403c 0%, #78716c 20%, #a8a29e 42%, #d6d3d1 64%, #f3e5cf 82%, #fafaf9 100%)",
    },
  },
] as const;
