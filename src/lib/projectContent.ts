import type { ProjectStatus } from "@/lib/projects";

export function projectStatusBadgeClass(status: ProjectStatus) {
  switch (status) {
    case "deployed":
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "paused":
      return "border-amber-500/35 bg-amber-500/15 text-amber-700 dark:text-amber-300";
    case "wip":
      return "border-sky-500/35 bg-sky-500/15 text-sky-700 dark:text-sky-300";
    case "notDeployed":
      return "border-rose-500/35 bg-rose-500/15 text-rose-700 dark:text-rose-300";
    default:
      return "border-zinc-400/35 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300";
  }
}

type ProjectMessagesById = Record<string, { features?: unknown }>;

export function projectFeatureListFromMessages(
  projectMessages: ProjectMessagesById | undefined,
  id: string,
): string[] {
  const featureList = projectMessages?.[id]?.features;
  if (Array.isArray(featureList) && featureList.every((x) => typeof x === "string")) {
    return featureList;
  }
  return [];
}
