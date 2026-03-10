import { SITE } from "@/lib/site";

export const ABOUT_SPECS = {
  location: SITE.location,
  languages: "Danish (Native), English (Fluent)",
} as const;

export const ABOUT_TECH_STACK = [
  {
    categoryKey: "coreFrontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn/UI",],
  },
  {
    categoryKey: "backendAndRuntimes",
    items: ["Node.js", "C# .NET", "REST APIs",],
  },
  {
    categoryKey: "dataAndState",
    items: ["SQL/PostgreSQL", "MongoDB",],
  },
  {
    categoryKey: "toolsAndInfra",
    items: ["GitHub", "Docker", "Vercel"],
  },
  {
    categoryKey: "currentlyExploring",
    items: ["React Native", "TanStack", "Kotlin"],
  }
] as const;
