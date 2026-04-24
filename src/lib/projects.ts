export type Project = {
  id: string;
  href: string;
  tags: readonly string[];
  /** Public path under `/public`, e.g. `/Amori-icon.png` */
  iconSrc?: string;
  /** Optional emoji fallback if `iconSrc` is missing */
  icon?: string;
};

export const PROJECTS: readonly Project[] = [
  {
    id: "amori",
    href: "https://github.com/Nikolaj-Hvitfeldt/amori",
    tags: ["React", "PostgreSQL", "TypeScript", "Tailwind"],
    iconSrc: "/Amori-icon.png",
    icon: "💞",
  },
  {
    id: "quartermark",
    href: "https://github.com/Nikolaj-Hvitfeldt/quartermark",
    tags: ["React", "C#", ".NET", "SignalR"],
    iconSrc: "/quartermark.png",
    icon: "🎉",
  },
  {
    id: "yeetcraft",
    href: "https://github.com/Nikolaj-Hvitfeldt/Yeetcraft",
    tags: ["Kotlin", "React", "TanStack", "TypeScript"],
    iconSrc: "/Yeetcraft-icon.png",
    icon: "🎮",
  },
  {
    id: "lineup",
    href: "https://github.com/andreasbbusk/lineup",
    tags: ["TypeScript", "React", "Tailwind", "Supabase", "Realtime", "TanStack"],
    iconSrc: "/Lineup-icon.png",
    icon: "🎵",
  },
] as const;

