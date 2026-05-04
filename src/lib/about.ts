export type AboutTechCategoryKey =
  | "coreFrontend"
  | "backendAndRuntimes"
  | "testing"
  | "dataAndState"
  | "toolsAndInfra";

export type AboutTechCategory = {
  categoryKey: AboutTechCategoryKey;
  items: readonly string[];
};

export const ABOUT_TECH_STACK: readonly AboutTechCategory[] = [
  {
    categoryKey: "coreFrontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Shadcn/UI",
      "React Native",
      "TanStack",
    ],
  },
  {
    categoryKey: "backendAndRuntimes",
    items: ["Node.js", "C#", ".NET", "Kotlin", "Java", "REST APIs"],
  },
  {
    categoryKey: "testing",
    items: ["Playwright", "Jest"],
  },
  {
    categoryKey: "dataAndState",
    items: ["SQL", "PostgreSQL", "MongoDB"],
  },
  {
    categoryKey: "toolsAndInfra",
    items: ["GitHub", "Docker", "Vercel"],
  },
] as const;
