export type ExperienceEntry = {
  id: string;
  periodKey: string;
};

export const EXPERIENCE: readonly ExperienceEntry[] = [
  { id: "bachelor", periodKey: "2025Present" },
  { id: "datamatiker", periodKey: "20232025" },
] as const;
