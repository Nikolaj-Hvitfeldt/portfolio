export type ExperienceEntry = {
  id: "bachelor" | "hmf" | "datamatiker";
};

export const EXPERIENCE: readonly ExperienceEntry[] = [
  { id: "bachelor" },
  { id: "hmf" },
  { id: "datamatiker" },
] as const;
