export type Project = {
  id: string;
  href: string;
  tags: readonly string[];
  icon?: string;
};

export const PROJECTS: readonly Project[] = [
  {
    id: "amori",
    href: "https://github.com/Nikolaj-Hvitfeldt/amori",
    tags: ["React", "PostgreSQL", "TypeScript", "Tailwind"],
    icon: "💞",
  },
  {
    id: "quartermark",
    href: "https://github.com/Nikolaj-Hvitfeldt/quartermark",
    tags: ["React", "C#", ".NET", "SignalR"],
    icon: "🎉",
  },
  {
    id: "yeetcraft",
    href: "https://github.com/Nikolaj-Hvitfeldt/Yeetcraft",
    tags: ["Kotlin", "React", "TanStack", "TypeScript"],
    icon: "🎮",
  },
  {
    id: "lineup",
    href: "https://github.com/andreasbbusk/lineup",
    tags: ["TypeScript", "React", "Tailwind", "Supabase", "Realtime", "TanStack"],
    icon: "🎵",
  },
] as const;

