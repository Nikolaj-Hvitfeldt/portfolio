export type Project = {
  title: string;
  description: string;
  href: string;
  tags: readonly string[];
};

export const PROJECTS: readonly Project[] = [
  {
    title: "Amori",
    description:
      "Journal for tracking relationships milestones and memories",
    href: "https://github.com/Nikolaj-Hvitfeldt/amori",
    tags: ["React", "PostgreSQL", "TypeScript", "Tailwind"],
  },
  {
    title: "QuarterMark",
    description:
      "Jackbox style party game for new years",
    href: "https://github.com/Nikolaj-Hvitfeldt/quartermark",
    tags: ["React", "C#", ".NET", "SignalR"],
  },
  {
    title: "Yeetcraft",
    description:
      "Leaderboard tracker made for banter that tracks who makes the most mistakes in video games between a friend group",
    href: "https://github.com/Nikolaj-Hvitfeldt/Yeetcraft",
    tags: ["Kotlin","React", "TanStack", "TypeScript"],
  },
  {
    title: "LineUp",
    description:
      "Co-developer of a Social media and fiverr style platform for freelance musicians to showcase their skills and get hired. This project also worked as semester project for my bachelor's degree in web development",
    href: "https://github.com/andreasbbusk/lineup",
    tags: ["TypeScript", "React", "Tailwind", "Supabase", "Realtime", "TanStack"],
  },
] as const;

