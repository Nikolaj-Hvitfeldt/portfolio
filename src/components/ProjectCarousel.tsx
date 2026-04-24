import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Project } from "@/lib/projects";

export function ProjectCarousel({ projects }: { projects: readonly Project[] }) {
  const tProject = useTranslations("Project");

  if (projects.length === 0) return null;

  const items = [...projects, ...projects];

  return (
    <div
      className="project-carousel-mask w-full overflow-hidden motion-reduce:overflow-x-auto motion-reduce:mask-none"
      aria-label="Project icons carousel"
    >
      <div
        className="marquee-ltr flex w-max items-center gap-5 pt-2.5 pb-1.5 group-hover/projects:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ ["--marquee-duration" as never]: "26s" }}
      >
        {items.map((project, idx) => {
          const fallback = project.id[0]?.toUpperCase() ?? "?";
          const title = tProject(`${project.id}.title`);
          const src = project.iconSrc;

          return (
            <div
              key={`${project.id}-${idx}`}
              className="project-icon-chip relative h-[68px] w-[68px] shrink-0 overflow-hidden sm:h-20 sm:w-20"
              title={title}
            >
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center text-[30px] leading-none sm:text-[36px]"
                  aria-hidden
                >
                  {project.icon ?? fallback}
                </span>
              )}
              <span className="sr-only">{title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
