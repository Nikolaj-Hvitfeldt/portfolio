"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useDeckRailViewportBox } from "@/hooks/useDeckRailViewportBox";
import { useDeckScrollProgress } from "@/hooks/useDeckScrollProgress";
import { fontDisplay, fontSans } from "@/lib/fonts";
import {
  cardYpx,
  cardZIndex,
  getDeckNeededHeightPx,
  H_CARD_BLOCK_PX,
} from "@/lib/projectDeck";
import { PROJECTS, type Project } from "@/lib/projects";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function ProjectStackCard({
  project,
  title,
  description,
}: {
  project: Project;
  title: string;
  description: string;
}) {
  const { stackTheme, iconSrc, icon, iconScale, href } = project;
  const interactive = isExternalHref(href);
  const onLight = stackTheme.textTone === "onLight";
  const titleClass = onLight
    ? `text-zinc-950 ${fontSans.className} text-lg font-bold leading-tight tracking-tight sm:text-xl`
    : `text-white ${fontSans.className} text-lg font-bold leading-tight tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] sm:text-xl`;
  const bodyClass = onLight
    ? `${fontSans.className} text-sm font-normal leading-snug text-zinc-800 sm:leading-normal`
    : `${fontSans.className} text-sm font-normal leading-snug text-white/90 [text-shadow:0_1px_1px_rgba(0,0,0,0.15)] sm:leading-normal`;
  const emojiClass = onLight
    ? "text-2xl sm:text-3xl text-zinc-100"
    : "text-2xl sm:text-3xl text-white/95";

  /** ~64–66% of card height: “app tile” block; asset fills the face (no inner gutter). */
  const iconBox = (
    <span
      aria-hidden
      className="project-stack-icon-tile relative flex h-[7.5rem] w-[7.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-b from-zinc-800 to-zinc-950 sm:h-32 sm:w-32"
    >
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 120px, 128px"
          unoptimized
          style={{
            transform:
              iconScale && iconScale !== 1 ? `scale(${iconScale})` : undefined,
            transformOrigin: "center",
          }}
        />
      ) : (
        <span className={emojiClass} aria-hidden>
          {icon ?? project.id[0]?.toUpperCase() ?? "?"}
        </span>
      )}
    </span>
  );

  const textBlock = (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center pl-0.5">
      <h3 className={titleClass}>{title}</h3>
      <p className={`${bodyClass} mt-1 line-clamp-2 sm:line-clamp-2`}>
        {description}
      </p>
    </div>
  );

  const layout = (
    <div className="flex h-full min-h-0 min-w-0 items-center gap-3.5 px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5">
      {iconBox}
      {textBlock}
    </div>
  );

  const dimStyle = {
    background: stackTheme.gradient,
    minHeight: H_CARD_BLOCK_PX,
    height: H_CARD_BLOCK_PX,
  } as const;
  const shellClass = `project-stack-card relative block w-full max-w-[32.5rem] overflow-hidden rounded-xl ring-1 ring-white/15 transition-transform duration-200 will-change-transform motion-reduce:transition-none ${
    interactive
      ? "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 motion-reduce:hover:translate-y-0 hover:-translate-y-0.5"
      : ""
  }`;

  if (interactive) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={shellClass}
        style={dimStyle}
        aria-label={title}
      >
        {layout}
      </a>
    );
  }

  return (
    <article className={shellClass} style={dimStyle} aria-label={title}>
      {layout}
    </article>
  );
}

function ContactCtaStackCard() {
  const t = useTranslations("Project");
  const title = t("contactCta.title");
  const description = t("contactCta.description");
  const linkLabel = t("contactCta.link");
  const dimStyle = {
    background:
      "linear-gradient(102deg, #60a5fa 0%, #3b82f6 32%, #2563eb 62%, #1d4ed8 100%)",
    minHeight: H_CARD_BLOCK_PX,
    height: H_CARD_BLOCK_PX,
  } as const;
  const shellClass =
    "project-stack-card relative block w-full max-w-[32.5rem] overflow-hidden rounded-xl ring-1 ring-white/20 transition-transform duration-200 will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5";

  return (
    <a
      href="#contact"
      className={shellClass}
      style={dimStyle}
      aria-label={`${title} — ${linkLabel}`}
    >
      <div className="flex h-full min-h-0 min-w-0 items-center gap-3.5 px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5">
        <span
          aria-hidden
          className="flex h-[7.5rem] w-[7.5rem] shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-[2.5rem] font-light leading-none text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-md sm:h-32 sm:w-32 sm:text-[2.75rem]"
        >
          +
        </span>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center pl-0.5">
          <h3
            className={`${fontDisplay.className} text-lg font-bold leading-tight tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] sm:text-xl`}
          >
            {title}
          </h3>
          <p
            className={`${fontSans.className} mt-1 line-clamp-2 text-sm font-normal leading-snug text-white/92 [text-shadow:0_1px_1px_rgba(0,0,0,0.12)] sm:line-clamp-2 sm:leading-normal`}
          >
            {description}
          </p>
          <p
            className={`${fontSans.className} mt-2 text-sm font-medium text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.12)]`}
          >
            {linkLabel}
          </p>
        </div>
      </div>
    </a>
  );
}

type ProjectsStackProps = {
  reduceMotion: boolean;
};

function DeckScrollRail({ p, n }: { p: number; n: number }) {
  const slots = Math.max(1, n);
  const thumbH = 100 / slots;
  const top = p * (100 - thumbH);
  return (
    <div
      className="flex h-full min-h-0 w-full flex-col py-0.5"
      aria-hidden
    >
      <div className="relative min-h-0 w-full flex-1 rounded-full bg-zinc-300/30 dark:bg-white/[0.12]">
        <div
          className="absolute left-0 w-full rounded-full bg-zinc-500/85 shadow-sm dark:bg-zinc-200/50"
          style={{ height: `${thumbH}%`, top: `${top}%` }}
        />
      </div>
    </div>
  );
}

function StackCardLayer({
  variant,
  project,
  title,
  description,
  y,
  zIndex,
}: {
  variant: "project" | "contact";
  project?: Project;
  title?: string;
  description?: string;
  y: number;
  zIndex: number;
}) {
  return (
    <div
      className="absolute top-0 left-0 right-0 w-full transform-gpu will-change-transform [backface-visibility:hidden]"
      style={{
        zIndex,
        transform: `translate3d(0, ${y}px, 0)`,
      }}
    >
      {variant === "contact" ? (
        <ContactCtaStackCard />
      ) : (
        <ProjectStackCard
          project={project!}
          title={title!}
          description={description!}
        />
      )}
    </div>
  );
}

function ScrolledStack() {
  const tProject = useTranslations("Project");
  const n = PROJECTS.length + 1;
  const { p, trackRef } = useDeckScrollProgress(n);
  const neededH = getDeckNeededHeightPx(n);
  const railAnchorRef = useRef<HTMLDivElement>(null);
  const { top, height: railH } = useDeckRailViewportBox(railAnchorRef);
  const showRail = railH > 8;

  return (
    <div
      ref={railAnchorRef}
      className="relative h-full min-h-0 w-full min-w-0 flex-1"
    >
      <div
        ref={trackRef}
        data-project-stack-track
        className="relative z-10 mx-auto h-full min-h-0 w-full min-w-0 max-w-[32.5rem] touch-manipulation overflow-hidden overscroll-behavior-y-contain"
        tabIndex={0}
      >
        <div
          className="relative mx-auto w-full touch-manipulation"
          style={{ minHeight: neededH, touchAction: "manipulation" }}
        >
          {PROJECTS.map((project, index) => (
            <StackCardLayer
              key={project.id}
              variant="project"
              project={project}
              title={tProject(`${project.id}.title`)}
              description={tProject(`${project.id}.description`)}
              y={cardYpx(index, p, n)}
              zIndex={cardZIndex(index, p, n)}
            />
          ))}
          <StackCardLayer
            key="contact-deck-cta"
            variant="contact"
            y={cardYpx(PROJECTS.length, p, n)}
            zIndex={cardZIndex(PROJECTS.length, p, n)}
          />
        </div>
      </div>
      {showRail ? (
        <div
          className="pointer-events-none fixed right-0 z-20 w-2 min-w-2 sm:w-2.5"
          style={{ top, height: railH }}
          aria-hidden
        >
          <div className="h-full w-full">
            <DeckScrollRail p={p} n={n} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ProjectsStack({ reduceMotion }: ProjectsStackProps) {
  const tProject = useTranslations("Project");

  if (reduceMotion) {
    return (
      <ul className="project-deck-reduce-list mx-auto flex h-full min-h-0 w-full max-w-[32.5rem] list-none flex-col gap-5 overflow-y-auto overflow-x-hidden p-0 pr-0.5 sm:gap-6">
        {PROJECTS.map((project) => (
          <li key={project.id}>
            <ProjectStackCard
              project={project}
              title={tProject(`${project.id}.title`)}
              description={tProject(`${project.id}.description`)}
            />
          </li>
        ))}
        <li key="contact-deck-cta">
          <ContactCtaStackCard />
        </li>
      </ul>
    );
  }

  return <ScrolledStack />;
}
