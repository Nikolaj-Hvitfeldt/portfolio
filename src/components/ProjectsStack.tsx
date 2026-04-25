"use client";

import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMessages, useTranslations } from "next-intl";
import { useDeckRailViewportBox } from "@/hooks/useDeckRailViewportBox";
import { useDeckScrollProgress } from "@/hooks/useDeckScrollProgress";
import { fontDisplay, fontSans } from "@/lib/fonts";
import {
  cardYpx,
  cardZIndex,
  getDeckNeededHeightPx,
  H_CARD_BLOCK_PX,
} from "@/lib/projectDeck";
import { getProjectById, PROJECTS, type Project } from "@/lib/projects";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function useProjectFeatureList(id: string): string[] {
  const messages = useMessages() as {
    Project?: Record<string, { features?: unknown }>;
  };
  const f = messages.Project?.[id]?.features;
  if (Array.isArray(f) && f.every((x) => typeof x === "string")) {
    return f;
  }
  return [];
}

function ProjectStackCardContent({
  project,
  title,
  description,
  titleClass,
  bodyClass,
  emojiClass,
}: {
  project: Project;
  title: string;
  description: string;
  titleClass: string;
  bodyClass: string;
  emojiClass: string;
}) {
  const { iconSrc, icon, iconScale } = project;

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

  return (
    <div className="flex h-full min-h-0 min-w-0 items-center gap-3.5 px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5">
      {iconBox}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center pl-0.5">
        <h3 className={titleClass}>{title}</h3>
        <p className={`${bodyClass} mt-1 line-clamp-2 sm:line-clamp-2`}>
          {description}
        </p>
      </div>
    </div>
  );
}

const shellBaseClass =
  "project-stack-card block w-full overflow-hidden rounded-xl ring-1 ring-white/15 will-change-transform";

const stackSizeClass = "max-w-[32.5rem]";
/** Keep the focused card at the same visual size as in the stack. */
const heroSizeClass = "max-w-[32.5rem]";

function ProjectStackCard({
  project,
  title,
  description,
  onSelect,
  layoutId,
  size,
  reduceMotion,
}: {
  project: Project;
  title: string;
  description: string;
  onSelect?: () => void;
  /** Shared layout for stack ↔ detail */
  layoutId?: string;
  size: "stack" | "hero";
  /** When true, skip motion wrapper */
  reduceMotion: boolean;
}) {
  const { stackTheme, href } = project;
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

  const dimStyle = {
    background: stackTheme.gradient,
    minHeight: H_CARD_BLOCK_PX,
    height: H_CARD_BLOCK_PX,
  } as const;

  const sizeClass = size === "stack" ? stackSizeClass : heroSizeClass;
  const interactive = typeof onSelect === "function";
  const showHover =
    interactive && size === "stack" ? "project-stack-card--interactive" : "";

  const inner = (
    <ProjectStackCardContent
      project={project}
      title={title}
      description={description}
      titleClass={titleClass}
      bodyClass={bodyClass}
      emojiClass={emojiClass}
    />
  );

  const combinedClass = `${shellBaseClass} ${sizeClass} ${showHover} relative transition-transform duration-200 motion-reduce:transition-none`;

  if (size === "hero" || !interactive) {
    if (reduceMotion) {
      return (
        <div
          className={`${combinedClass} z-0`}
          style={dimStyle}
          aria-label={title}
        >
          {inner}
        </div>
      );
    }
    return (
      <motion.div
        layout
        layoutId={layoutId}
        transition={{
          layout: {
            type: "spring",
            stiffness: 280,
            damping: 30,
            mass: 0.78,
          },
        }}
        className={`${combinedClass} z-0`}
        style={dimStyle}
        aria-label={title}
      >
        {inner}
      </motion.div>
    );
  }

  if (reduceMotion) {
    return (
      <button
        type="button"
        className={`${combinedClass} z-0 text-left project-stack-card--interactive`}
        style={dimStyle}
        onClick={onSelect}
        aria-label={title}
      >
        {inner}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      layout
      layoutId={layoutId}
      transition={{
        layout: {
          type: "spring",
          stiffness: 280,
          damping: 30,
          mass: 0.78,
        },
      }}
      className={`${combinedClass} z-0 text-left project-stack-card--interactive cursor-pointer`}
      style={dimStyle}
      onClick={onSelect}
      aria-label={title}
    >
      {inner}
    </motion.button>
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
  const shellClass = `project-stack-card relative block w-full max-w-[32.5rem] overflow-hidden rounded-xl ring-1 ring-white/20 transition-transform duration-200 will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5`;

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
    <div className="flex h-full min-h-0 w-full flex-col py-0.5" aria-hidden>
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
  onSelectProject,
  reduceMotion,
}: {
  variant: "project" | "contact";
  project?: Project;
  title?: string;
  description?: string;
  y: number;
  zIndex: number;
  onSelectProject: (id: string) => void;
  reduceMotion: boolean;
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
          onSelect={() => onSelectProject(project!.id)}
          layoutId={reduceMotion ? undefined : `project-card-${project!.id}`}
          size="stack"
          reduceMotion={reduceMotion}
        />
      )}
    </div>
  );
}

function ScrolledStack({
  onSelectProject,
  reduceMotion,
}: {
  onSelectProject: (id: string) => void;
  reduceMotion: boolean;
}) {
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
              onSelectProject={onSelectProject}
              reduceMotion={reduceMotion}
            />
          ))}
          <StackCardLayer
            key="contact-deck-cta"
            variant="contact"
            y={cardYpx(PROJECTS.length, p, n)}
            zIndex={cardZIndex(PROJECTS.length, p, n)}
            onSelectProject={onSelectProject}
            reduceMotion={reduceMotion}
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-7.5 9.5a.75.75 0 01-1.127.09l-4-4a.75.75 0 111.06-1.06l3.3 3.3 6.93-8.75a.75.75 0 011.054-.135z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M12.292 2.25h3.5a.75.75 0 01.75.75v3.5m-8.5-3.5L17.5 10.5M8.5 2.25H3.75A1.5 1.5 0 002.25 3.75v12.5A1.5 1.5 0 003.75 18h12.5a1.5 1.5 0 001.5-1.5V11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <rect
        x="2.5"
        y="4.5"
        width="15"
        height="12.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2.5 7.5h15M6.5 2.5v2M13.5 2.5v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProjectDetailView({
  project,
  onBack,
  backButtonRef,
  reduceMotion,
  showDetails,
}: {
  project: Project;
  onBack: () => void;
  backButtonRef: React.RefObject<HTMLButtonElement | null>;
  reduceMotion: boolean;
  showDetails: boolean;
}) {
  const tProject = useTranslations("Project");
  const id = project.id;
  const title = tProject(`${id}.title`);
  const shortDesc = tProject(`${id}.description`);
  const about = tProject(`${id}.longAbout`);
  const features = useProjectFeatureList(id);
  const infoYear = tProject(`${id}.infoYear`);
  const infoMeta = tProject(`${id}.infoMeta`);
  const canSource = isExternalHref(project.href);
  const canLive = Boolean(
    project.liveUrl && isExternalHref(project.liveUrl!),
  );

  return (
    <div className="project-details-root flex w-full min-w-0 flex-1 flex-col gap-0 pb-6">
      <div className="w-full min-w-0 max-w-5xl shrink-0 px-0 pr-4 sm:pr-6">
        <div className="mb-2 flex justify-center sm:justify-center">
          <button
            ref={backButtonRef}
            type="button"
            onClick={onBack}
            className={`project-details-back group inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 dark:text-zinc-400 dark:hover:text-zinc-100 ${fontSans.className}`}
            aria-label={tProject("ui.back")}
          >
            <span aria-hidden className="inline-block -translate-y-px">
              <svg
                viewBox="0 0 20 20"
                width="16"
                height="16"
                fill="currentColor"
                className="opacity-80 transition group-hover:opacity-100"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 3.2a.75.75 0 010 1.06L7.12 9.93a.2.2 0 000 .28l5.67 5.66a.75.75 0 11-1.06 1.06L5.3 10.4a.75.75 0 010-1.12l5.44-5.5a.75.75 0 011.05-.09z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {tProject("ui.back")}
          </button>
        </div>

        <div className="mt-0 flex w-full max-w-5xl justify-center sm:px-0">
          <div className="w-full min-w-0 max-w-[32.5rem]">
            <ProjectStackCard
              project={project}
              title={title}
              description={shortDesc}
              size="hero"
              layoutId={reduceMotion ? undefined : `project-card-${id}`}
              reduceMotion={reduceMotion}
            />
          </div>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {showDetails ? (
          <motion.div
            key="project-details-panel"
            className="project-details-panel w-full min-w-0 max-w-5xl flex-1 px-0 pr-4 pt-4 sm:pr-6"
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            role="region"
            aria-label={title}
          >
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:gap-x-12">
          <div className="min-w-0 space-y-6">
            <section>
              <h2
                className={`${fontDisplay.className} project-details-h2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl`}
              >
                {tProject("ui.about")}
              </h2>
              <p
                className={`${fontSans.className} mt-2 text-sm font-normal leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-400`}
              >
                {about}
              </p>
            </section>
            {features.length > 0 ? (
              <section>
                <h2
                  className={`${fontDisplay.className} project-details-h2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl`}
                >
                  {tProject("ui.keyFeatures")}
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {features.map((f) => (
                    <li
                      key={f}
                      className={`${fontSans.className} flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300`}
                    >
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
          <div className="min-w-0 space-y-6">
            <section>
              <h2
                className={`${fontDisplay.className} project-details-h2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl`}
              >
                {tProject("ui.info")}
              </h2>
              <ul className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                {canSource ? (
                  <li>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-details-info-link group inline-flex max-w-full items-center gap-2.5 break-all rounded-md text-zinc-800 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
                    >
                      <LinkIcon className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300" />
                      <span className="min-w-0 font-medium">
                        {project.href.replace(/^https?:\/\//, "")}
                      </span>
                    </a>
                    <p
                      className={`${fontSans.className} mt-1 text-xs text-zinc-500 dark:text-zinc-500`}
                    >
                      {tProject("ui.viewSource")}
                    </p>
                  </li>
                ) : null}
                {canLive && project.liveUrl ? (
                  <li>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-details-info-link group inline-flex max-w-full items-center gap-2.5 break-all rounded-md text-zinc-800 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
                    >
                      <LinkIcon className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300" />
                      <span className="min-w-0 font-medium">
                        {project.liveUrl.replace(/^https?:\/\//, "")}
                      </span>
                    </a>
                    <p
                      className={`${fontSans.className} mt-1 text-xs text-zinc-500`}
                    >
                      {tProject("ui.openLive")}
                    </p>
                  </li>
                ) : null}
                <li className="inline-flex items-center gap-2.5">
                  <CalendarIcon className="h-4 w-4 shrink-0 text-zinc-500" />
                  <span className={fontSans.className}>{infoYear}</span>
                </li>
                <li className={`${fontSans.className} text-zinc-500`}>
                  {infoMeta}
                </li>
              </ul>
            </section>
            <section>
              <h2
                className={`${fontDisplay.className} project-details-h2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl`}
              >
                {tProject("ui.tech")}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <span
                      className={`${fontSans.className} inline-flex rounded-full border border-black/10 bg-zinc-100/80 px-3 py-1 text-xs font-medium text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200`}
                    >
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            {canSource || canLive ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {canSource ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${fontSans.className} project-details-cta inline-flex items-center justify-center rounded-xl border border-black/10 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20`}
                  >
                    {tProject("ui.viewSource")}
                  </a>
                ) : null}
                {canLive && project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${fontSans.className} project-details-cta inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/50 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10`}
                  >
                    {tProject("ui.openLive")}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ReducedListStack({
  onSelectProject,
  reduceMotion,
}: {
  onSelectProject: (id: string) => void;
  reduceMotion: boolean;
}) {
  const tProject = useTranslations("Project");
  return (
    <ul className="project-deck-reduce-list mx-auto flex h-full min-h-0 w-full max-w-[32.5rem] list-none flex-col gap-5 overflow-y-auto overflow-x-hidden p-0 pr-0.5 sm:gap-6">
      {PROJECTS.map((project) => (
        <li key={project.id}>
          <ProjectStackCard
            project={project}
            title={tProject(`${project.id}.title`)}
            description={tProject(`${project.id}.description`)}
            onSelect={() => onSelectProject(project.id)}
            size="stack"
            reduceMotion={reduceMotion}
          />
        </li>
      ))}
      <li key="contact-deck-cta">
        <ContactCtaStackCard />
      </li>
    </ul>
  );
}

export function ProjectsStack({ reduceMotion: reduceMotionProp }: ProjectsStackProps) {
  const reduceMotion = !!reduceMotionProp;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const selected = selectedId
    ? getProjectById(selectedId)
    : undefined;

  useEffect(() => {
    if (!selectedId) {
      setShowDetailsPanel(false);
      return;
    }
    if (reduceMotion) {
      setShowDetailsPanel(true);
      return;
    }
    const t = window.setTimeout(() => {
      setShowDetailsPanel(true);
    }, 260);
    return () => window.clearTimeout(t);
  }, [selectedId, reduceMotion]);

  useEffect(() => {
    if (!selectedId) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  useEffect(() => {
    if (selectedId && showDetailsPanel && backButtonRef.current) {
      const id = requestAnimationFrame(() => {
        backButtonRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [selectedId, showDetailsPanel]);

  const onSelectProject = (id: string) => {
    setShowDetailsPanel(false);
    setSelectedId(id);
  };

  const onBack = () => {
    setShowDetailsPanel(false);
    if (reduceMotion) {
      setSelectedId(null);
      return;
    }
    window.setTimeout(() => {
      setSelectedId(null);
    }, 120);
  };

  return (
    <div
      className={
        selectedId
          ? "project-details-container flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
          : "flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
      }
    >
      <MotionConfig
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 250, damping: 28, mass: 0.8 }
        }
      >
        <LayoutGroup>
          <AnimatePresence initial={false} mode="wait">
            {!selectedId ? (
              <motion.div
                key="stack"
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
                initial={false}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {reduceMotion ? (
                  <ReducedListStack
                    onSelectProject={onSelectProject}
                    reduceMotion
                  />
                ) : (
                  <ScrolledStack
                    onSelectProject={onSelectProject}
                    reduceMotion={false}
                  />
                )}
              </motion.div>
            ) : null}
            {selectedId && selected ? (
              <motion.div
                key="detail"
                className="flex min-w-0 flex-1 flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectDetailView
                  key={selectedId}
                  project={selected}
                  onBack={onBack}
                  backButtonRef={backButtonRef}
                  reduceMotion={reduceMotion}
                  showDetails={showDetailsPanel}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </LayoutGroup>
      </MotionConfig>
    </div>
  );
}
