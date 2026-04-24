import { useTranslations } from "next-intl";
import type { Project } from "@/lib/projects";

export function ProjectCarousel({ projects }: { projects: readonly Project[] }) {
  const tProject = useTranslations("Project");

  if (projects.length === 0) return null;

  const items = [...projects, ...projects];

  return (
    <div
      className="overflow-hidden motion-reduce:overflow-x-auto"
      aria-label="Project icons carousel"
    >
      <div
        className="marquee-ltr flex w-max items-center gap-4 py-2 motion-reduce:animate-none"
        style={{ ["--marquee-duration" as never]: "12s" }}
      >
        {items.map((project, idx) => {
          const fallback = project.id[0]?.toUpperCase() ?? "?";
          const title = tProject(`${project.id}.title`);

          return (
            <div
              key={`${project.id}-${idx}`}
              className="flex shrink-0 items-center rounded-2xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-zinc-950"
              title={title}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-2xl dark:bg-zinc-800"
                aria-hidden
              >
                {project.icon ?? fallback}
              </span>
              <span className="sr-only">{title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
