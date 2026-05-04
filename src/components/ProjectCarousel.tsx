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
      {/* Safari: do not apply the marquee transform to the same element as `display:flex`;
          layout can collapse and tiles overlap. Animate this wrapper; keep flex on the inner track. */}
      <div
        className="marquee-ltr inline-block align-top will-change-transform motion-reduce:animate-none group-hover/projects:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as never]: "26s" }}
      >
        <div className="project-carousel-track flex w-max flex-none items-center gap-5 pt-2.5 pb-1.5">
        {items.map((project, idx) => {
          const fallback = project.id[0]?.toUpperCase() ?? "?";
          const title = tProject(`${project.id}.title`);
          const src = project.iconSrc;
          const scale = project.iconScale ?? 1;
          const fit = project.iconObjectFit ?? "cover";
          const tileVariant = project.iconTileVariant ?? "dark";
          const tileSurface =
            tileVariant === "light"
              ? "bg-linear-to-b from-[#fffbeb] to-[#ffedd5] ring-1 ring-orange-950/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
              : "bg-linear-to-b from-zinc-800 to-zinc-950";

          return (
            <div
              key={`${project.id}-${idx}`}
              className={`project-stack-icon-tile relative isolate h-[68px] w-[68px] shrink-0 overflow-hidden rounded-2xl sm:h-20 sm:w-20 ${tileSurface} ${fit === "contain" ? "p-1.5 sm:p-2" : ""}`}
              title={title}
            >
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  className={fit === "contain" ? "object-contain" : "object-cover"}
                  sizes="80px"
                  unoptimized
                  style={{
                    transform: scale === 1 ? undefined : `scale(${scale})`,
                    transformOrigin: "center",
                  }}
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center text-[30px] leading-none text-white/95 sm:text-[36px]"
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
    </div>
  );
}
