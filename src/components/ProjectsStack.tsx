"use client";

import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
} from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import { techTagIconForLabel } from "@/lib/techTagIcons";

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
const detailContentMaxClass = "max-w-[32.5rem]";

function ProjectStackCard({
  project,
  title,
  description,
  onSelect,
  layoutId,
  size,
  reduceMotion,
  dataProjectCardId,
}: {
  project: Project;
  title: string;
  description: string;
  onSelect?: (el: HTMLElement) => void;
  /** Shared layout for stack ↔ detail */
  layoutId?: string;
  size: "stack" | "hero";
  /** When true, skip motion wrapper */
  reduceMotion: boolean;
  /** Optional DOM marker for FLIP return targeting in stack mode. */
  dataProjectCardId?: string;
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
            stiffness: 145,
            damping: 24,
            mass: 1.08,
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
        onClick={(e) => onSelect?.(e.currentTarget)}
        aria-label={title}
        data-project-card-id={dataProjectCardId}
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
          stiffness: 145,
          damping: 24,
          mass: 1.08,
        },
      }}
      className={`${combinedClass} z-0 text-left project-stack-card--interactive cursor-pointer`}
      style={dimStyle}
      onClick={(e) => onSelect?.(e.currentTarget)}
      aria-label={title}
      data-project-card-id={dataProjectCardId}
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
  index,
  y,
  zIndex,
  onSelectProject,
  reduceMotion,
  siblingExitActive,
  siblingEnterActive,
  selectedProjectId,
  selectedIndex,
  selectedFadeActive,
  hideSelectedInStack,
}: {
  variant: "project" | "contact";
  project?: Project;
  title?: string;
  description?: string;
  index: number;
  y: number;
  zIndex: number;
  onSelectProject: (id: string, sourceEl?: HTMLElement) => void;
  reduceMotion: boolean;
  siblingExitActive: boolean;
  siblingEnterActive: boolean;
  selectedProjectId: string | null;
  selectedIndex: number | null;
  selectedFadeActive: boolean;
  hideSelectedInStack: boolean;
}) {
  const isSelected = variant === "project" && project?.id === selectedProjectId;
  if (isSelected && hideSelectedInStack) {
    return null;
  }
  const exitThis =
    siblingExitActive &&
    (variant === "contact" ||
      (variant === "project" && project && project.id !== selectedProjectId));
  const isAboveSelected =
    selectedIndex !== null ? index < selectedIndex : false;

  const inner =
    variant === "contact" ? (
      <ContactCtaStackCard />
    ) : (
      <ProjectStackCard
        project={project!}
        title={title!}
        description={description!}
        onSelect={(el) => onSelectProject(project!.id, el)}
        layoutId={reduceMotion ? undefined : `project-card-${project!.id}`}
        size="stack"
        reduceMotion={reduceMotion}
        dataProjectCardId={project!.id}
      />
    );

  return (
    <div
      className="absolute top-0 left-0 right-0 w-full transform-gpu will-change-transform backface-hidden"
      style={{
        zIndex,
        transform: `translate3d(0, ${y}px, 0)`,
      }}
    >
      {exitThis && !reduceMotion ? (
        <motion.div
          initial={false}
          animate={{ opacity: 0, y: isAboveSelected ? -12 : 12 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none"
        >
          {inner}
        </motion.div>
      ) : isSelected && selectedFadeActive && !reduceMotion ? (
        <motion.div
          initial={false}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none"
        >
          {inner}
        </motion.div>
      ) : siblingEnterActive && !isSelected && !reduceMotion ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {inner}
        </motion.div>
      ) : (
        inner
      )}
    </div>
  );
}

function ScrolledStack({
  onSelectProject,
  reduceMotion,
  siblingExitActive,
  siblingEnterActive,
  selectedProjectId,
  selectedIndex,
  selectedFadeActive,
  hideSelectedInStack,
}: {
  onSelectProject: (id: string, sourceEl?: HTMLElement) => void;
  reduceMotion: boolean;
  siblingExitActive: boolean;
  siblingEnterActive: boolean;
  selectedProjectId: string | null;
  selectedIndex: number | null;
  selectedFadeActive: boolean;
  hideSelectedInStack: boolean;
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
              index={index}
              y={cardYpx(index, p, n)}
              zIndex={cardZIndex(index, p, n)}
              onSelectProject={onSelectProject}
              reduceMotion={reduceMotion}
              siblingExitActive={siblingExitActive}
              siblingEnterActive={siblingEnterActive}
              selectedProjectId={selectedProjectId}
              selectedIndex={selectedIndex}
              selectedFadeActive={selectedFadeActive}
              hideSelectedInStack={hideSelectedInStack}
            />
          ))}
          <StackCardLayer
            key="contact-deck-cta"
            variant="contact"
            index={PROJECTS.length}
            y={cardYpx(PROJECTS.length, p, n)}
            zIndex={cardZIndex(PROJECTS.length, p, n)}
            onSelectProject={onSelectProject}
            reduceMotion={reduceMotion}
            siblingExitActive={siblingExitActive}
            siblingEnterActive={siblingEnterActive}
            selectedProjectId={selectedProjectId}
            selectedIndex={selectedIndex}
            selectedFadeActive={selectedFadeActive}
            hideSelectedInStack={false}
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

function HighlightSpotIcon() {
  return (
    <span
      aria-hidden
      className="relative mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center"
    >
      <span className="absolute inline-flex h-3 w-3 rounded-full bg-amber-300/55 blur-[3px] dark:bg-amber-200/60" />
      <span className="absolute inline-flex h-2 w-2 rounded-full bg-amber-100/90 shadow-[0_0_8px_rgba(251,191,36,0.8)] dark:bg-amber-100/95" />
      <span className="inline-flex h-1 w-1 rounded-full bg-yellow-50" />
    </span>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
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
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
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

function TechPill({ tag }: { tag: string }) {
  return (
    <span
      className={`${fontSans.className} inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs font-medium text-zinc-800 shadow-sm dark:border-white/10 dark:bg-white dark:text-zinc-900`}
    >
      {techTagIconForLabel(tag)}
      <span>{tag}</span>
    </span>
  );
}

function statusBadgeClass(status: string) {
  const key = status.trim().toLowerCase();
  if (key === "deployed") {
    return "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
  }
  if (key === "paused") {
    return "border-amber-500/35 bg-amber-500/15 text-amber-700 dark:text-amber-300";
  }
  if (
    key === "work in progress" ||
    key === "wip" ||
    key === "under udvikling"
  ) {
    return "border-sky-500/35 bg-sky-500/15 text-sky-700 dark:text-sky-300";
  }
  if (
    key === "down" ||
    key === "stopped" ||
    key === "not-deployed" ||
    key === "not deployed"
  ) {
    return "border-rose-500/35 bg-rose-500/15 text-rose-700 dark:text-rose-300";
  }
  return "border-zinc-400/35 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300";
}

function ProjectDetailView({
  project,
  onBack,
  backButtonRef,
  reduceMotion,
  showDetails,
  heroTargetRef,
  showHeroCard,
  detailsHidden,
}: {
  project: Project;
  onBack: () => void;
  backButtonRef: React.RefObject<HTMLButtonElement | null>;
  reduceMotion: boolean;
  showDetails: boolean;
  heroTargetRef?: React.RefObject<HTMLDivElement | null>;
  showHeroCard?: boolean;
  detailsHidden?: boolean;
}) {
  const tProject = useTranslations("Project");
  const id = project.id;
  const title = tProject(`${id}.title`);
  const shortDesc = tProject(`${id}.description`);
  const about = tProject(`${id}.longAbout`);
  const features = useProjectFeatureList(id);
  const infoYear = tProject(`${id}.infoYear`);
  const infoStatus = tProject(`${id}.infoStatus`);
  const infoNext = tProject(`${id}.infoNext`);
  const hasInfoStatus = infoStatus.trim().length > 0;
  const hasInfoNext = infoNext.trim().length > 0;
  const canSource = isExternalHref(project.href);
  const canLive = Boolean(project.liveUrl && isExternalHref(project.liveUrl!));

  return (
    <div className="project-details-root flex w-full min-w-0 flex-1 flex-col gap-0 pb-6">
      <div className="mx-auto w-full min-w-0 shrink-0 px-0 pr-4 sm:pr-6">
        <div className={`mx-auto w-full min-w-0 ${detailContentMaxClass}`}>
          <div className="mb-2 flex w-full justify-start">
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

          <div className="mt-0 flex w-full justify-center sm:px-0">
            <motion.div
              ref={heroTargetRef}
              className={`w-full min-w-0 ${detailContentMaxClass}`}
              initial={false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0 }}
            >
              {showHeroCard ? (
                <ProjectStackCard
                  project={project}
                  title={title}
                  description={shortDesc}
                  size="hero"
                  layoutId={undefined}
                  reduceMotion={reduceMotion}
                />
              ) : (
                <div
                  aria-hidden
                  style={{
                    minHeight: H_CARD_BLOCK_PX,
                    height: H_CARD_BLOCK_PX,
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {showDetails ? (
          <motion.div
            key="project-details-panel"
            className={`project-details-panel mx-auto w-full min-w-0 flex-1 px-0 pr-4 pt-4 sm:pr-6 ${detailsHidden ? "pointer-events-none" : ""}`}
            initial={false}
            animate={
              reduceMotion
                ? { opacity: detailsHidden ? 0 : 1, x: 0 }
                : detailsHidden
                  ? { opacity: 0, x: 14 }
                  : { opacity: 1, x: 0 }
            }
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
            transition={
              reduceMotion || detailsHidden
                ? { duration: 0 }
                : { duration: 0.32, delay: 0.04, ease: [0.22, 1, 0.36, 1] }
            }
            role="region"
            aria-label={title}
            aria-hidden={detailsHidden ? true : undefined}
          >
            <div
              className={`mx-auto grid w-full min-w-0 ${detailContentMaxClass} gap-8 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:gap-x-8`}
            >
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
                          <HighlightSpotIcon />
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
                          <Image
                            src="/tech-icons/github-logo.svg"
                            alt=""
                            aria-hidden
                            width={16}
                            height={16}
                            className="h-4 w-4 shrink-0 object-contain opacity-80 transition-opacity group-hover:opacity-100"
                          />
                          <span className="min-w-0 font-medium">
                            {project.href.replace(/^https?:\/\//, "")}
                          </span>
                        </a>
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
                    <li className="flex items-center gap-2.5">
                      <CalendarIcon className="h-4 w-4 shrink-0 text-zinc-500" />
                      <span className={fontSans.className}>{infoYear}</span>
                    </li>
                    {hasInfoStatus ? (
                      <li
                        className={`${fontSans.className} flex items-center gap-2 text-zinc-500`}
                      >
                        <span className="text-zinc-600 dark:text-zinc-300">
                          {tProject("ui.status")}:
                        </span>
                        <span
                          className={`${fontSans.className} inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${statusBadgeClass(
                            infoStatus,
                          )}`}
                        >
                          {infoStatus}
                        </span>
                      </li>
                    ) : null}
                    {hasInfoNext ? (
                      <li className={`${fontSans.className} text-zinc-500`}>
                        <span className="text-zinc-600 dark:text-zinc-300">
                          {tProject("ui.next")}:
                        </span>{" "}
                        {infoNext}
                      </li>
                    ) : null}
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
                        <TechPill tag={tag} />
                      </li>
                    ))}
                  </ul>
                </section>
                {canLive && project.liveUrl ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${fontSans.className} project-details-cta inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/50 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10`}
                    >
                      {tProject("ui.openLive")}
                    </a>
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
  siblingExitActive,
  siblingEnterActive,
  selectedProjectId,
  selectedIndex,
  selectedFadeActive,
  hideSelectedInStack,
}: {
  onSelectProject: (id: string, sourceEl?: HTMLElement) => void;
  reduceMotion: boolean;
  siblingExitActive: boolean;
  siblingEnterActive: boolean;
  selectedProjectId: string | null;
  selectedIndex: number | null;
  selectedFadeActive: boolean;
  hideSelectedInStack: boolean;
}) {
  const tProject = useTranslations("Project");
  return (
    <ul className="project-deck-reduce-list mx-auto flex h-full min-h-0 w-full max-w-[32.5rem] list-none flex-col gap-5 overflow-y-auto overflow-x-hidden p-0 pr-0.5 sm:gap-6">
      {PROJECTS.map((project, index) => {
        const exitThis = siblingExitActive && project.id !== selectedProjectId;
        if (hideSelectedInStack && project.id === selectedProjectId) {
          return null;
        }
        const isAboveSelected =
          selectedIndex !== null ? index < selectedIndex : false;
        const card = (
          <ProjectStackCard
            project={project}
            title={tProject(`${project.id}.title`)}
            description={tProject(`${project.id}.description`)}
            onSelect={(el) => onSelectProject(project.id, el)}
            size="stack"
            reduceMotion={reduceMotion}
            dataProjectCardId={project.id}
          />
        );
        return (
          <li key={project.id}>
            {exitThis && !reduceMotion ? (
              <motion.div
                initial={false}
                animate={{ opacity: 0, y: isAboveSelected ? -12 : 12 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none"
              >
                {card}
              </motion.div>
            ) : selectedFadeActive &&
              project.id === selectedProjectId &&
              !reduceMotion ? (
              <motion.div
                initial={false}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none"
              >
                {card}
              </motion.div>
            ) : siblingEnterActive &&
              project.id !== selectedProjectId &&
              !reduceMotion ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {card}
              </motion.div>
            ) : (
              card
            )}
          </li>
        );
      })}
      <li key="contact-deck-cta">
        {siblingExitActive && !reduceMotion ? (
          <motion.div
            initial={false}
            animate={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none"
          >
            <ContactCtaStackCard />
          </motion.div>
        ) : siblingEnterActive && !reduceMotion ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <ContactCtaStackCard />
          </motion.div>
        ) : (
          <ContactCtaStackCard />
        )}
      </li>
    </ul>
  );
}

type NavPhase = "list" | "flipping" | "detail" | "closing";
type FlipRect = { x: number; y: number; width: number; height: number };

export function ProjectsStack({
  reduceMotion: reduceMotionProp,
}: ProjectsStackProps) {
  const reduceMotion = !!reduceMotionProp;
  const tProject = useTranslations("Project");
  const [navPhase, setNavPhase] = useState<NavPhase>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [flipFrom, setFlipFrom] = useState<FlipRect | null>(null);
  const [flipTo, setFlipTo] = useState<FlipRect | null>(null);
  const heroTargetRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  const selected = selectedId ? getProjectById(selectedId) : undefined;
  const selectedIndex = selectedId
    ? PROJECTS.findIndex((p) => p.id === selectedId)
    : null;
  const siblingExitActive = navPhase === "flipping";
  const siblingEnterActive = navPhase === "closing";
  const selectedFadeActive = navPhase === "closing";
  const hideSelectedInStack = navPhase === "flipping";
  const showStack = navPhase !== "detail";
  const showDetail = navPhase !== "list";

  useLayoutEffect(() => {
    if (!flipFrom || flipTo) {
      return;
    }
    if (navPhase === "flipping" && heroTargetRef.current) {
      const r = heroTargetRef.current.getBoundingClientRect();
      setFlipTo({ x: r.left, y: r.top, width: r.width, height: r.height });
      return;
    }
    if (navPhase === "closing" && selectedId) {
      const target = document.querySelector<HTMLElement>(
        `[data-project-card-id="${selectedId}"]`,
      );
      if (!target) {
        return;
      }
      const r = target.getBoundingClientRect();
      setFlipTo({ x: r.left, y: r.top, width: r.width, height: r.height });
    }
  }, [navPhase, flipFrom, flipTo, selectedId]);

  const onSelectProject = (id: string, sourceEl?: HTMLElement) => {
    setSelectedId(id);
    if (reduceMotion || !sourceEl) {
      setNavPhase("detail");
      setShowDetailsPanel(true);
      return;
    }
    const r = sourceEl.getBoundingClientRect();
    setFlipFrom({ x: r.left, y: r.top, width: r.width, height: r.height });
    setFlipTo(null);
    /** render hidden details layout during FLIP so destination matches final y */
    setShowDetailsPanel(true);
    setNavPhase("flipping");
  };

  const onBack = useCallback(() => {
    if (reduceMotion) {
      setShowDetailsPanel(false);
      setNavPhase("list");
      setSelectedId(null);
      setFlipFrom(null);
      setFlipTo(null);
      return;
    }
    const heroRect = heroTargetRef.current?.getBoundingClientRect();
    if (!heroRect || !selectedId) {
      setShowDetailsPanel(false);
      setNavPhase("list");
      setSelectedId(null);
      setFlipFrom(null);
      setFlipTo(null);
      return;
    }
    setShowDetailsPanel(false);
    setFlipFrom({
      x: heroRect.left,
      y: heroRect.top,
      width: heroRect.width,
      height: heroRect.height,
    });
    setFlipTo(null);
    setNavPhase("closing");
  }, [reduceMotion, selectedId]);

  useEffect(() => {
    if (navPhase === "list" && !selectedId) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navPhase, selectedId, onBack]);

  useEffect(() => {
    if (navPhase === "detail" && showDetailsPanel && backButtonRef.current) {
      const id = requestAnimationFrame(() => backButtonRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [navPhase, showDetailsPanel]);

  const flipTitle = selectedId ? tProject(`${selectedId}.title`) : "";
  const flipDescription = selectedId
    ? tProject(`${selectedId}.description`)
    : "";

  return (
    <div className="project-details-container relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <MotionConfig
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 230, damping: 30, mass: 0.92 }
        }
      >
        <LayoutGroup>
          <AnimatePresence initial={false} mode="sync">
            {showStack ? (
              <motion.div
                key="stack"
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
                initial={false}
                animate={{ opacity: navPhase === "flipping" ? 0.58 : 1 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {reduceMotion ? (
                  <ReducedListStack
                    onSelectProject={onSelectProject}
                    reduceMotion
                    siblingExitActive={siblingExitActive}
                    siblingEnterActive={siblingEnterActive}
                    selectedProjectId={selectedId}
                    selectedIndex={selectedIndex}
                    selectedFadeActive={selectedFadeActive}
                    hideSelectedInStack={hideSelectedInStack}
                  />
                ) : (
                  <ScrolledStack
                    onSelectProject={onSelectProject}
                    reduceMotion={false}
                    siblingExitActive={siblingExitActive}
                    siblingEnterActive={siblingEnterActive}
                    selectedProjectId={selectedId}
                    selectedIndex={selectedIndex}
                    selectedFadeActive={selectedFadeActive}
                    hideSelectedInStack={hideSelectedInStack}
                  />
                )}
              </motion.div>
            ) : null}

            {showDetail && selectedId && selected ? (
              <motion.div
                key="detail"
                className={`absolute inset-0 z-30 flex min-w-0 flex-col ${navPhase === "flipping" ? "pointer-events-none" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectDetailView
                  key={selectedId}
                  project={selected}
                  onBack={onBack}
                  backButtonRef={backButtonRef}
                  reduceMotion={reduceMotion}
                  showDetails={showDetailsPanel}
                  heroTargetRef={heroTargetRef}
                  showHeroCard={navPhase === "detail"}
                  detailsHidden={navPhase === "flipping"}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {!reduceMotion &&
          (navPhase === "flipping" || navPhase === "closing") &&
          selected &&
          flipFrom &&
          flipTo ? (
            <motion.div
              initial={{
                position: "fixed",
                left: flipFrom.x,
                top: flipFrom.y,
                width: flipFrom.width,
                height: flipFrom.height,
                zIndex: 80,
                pointerEvents: "none",
              }}
              animate={{
                left: flipTo.x,
                top: flipTo.y,
                width: flipTo.width,
                height: flipTo.height,
              }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => {
                if (navPhase === "flipping") {
                  setNavPhase("detail");
                  setShowDetailsPanel(true);
                  setFlipFrom(null);
                  setFlipTo(null);
                  return;
                }
                setNavPhase("list");
                setShowDetailsPanel(false);
                setSelectedId(null);
                setFlipFrom(null);
                setFlipTo(null);
              }}
            >
              <ProjectStackCard
                project={selected}
                title={flipTitle}
                description={flipDescription}
                size="hero"
                reduceMotion
              />
            </motion.div>
          ) : null}
        </LayoutGroup>
      </MotionConfig>
    </div>
  );
}
