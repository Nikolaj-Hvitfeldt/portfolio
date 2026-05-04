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
  type WheelEvent,
} from "react";
import { useTranslations } from "next-intl";
import { useDeckRailViewportBox } from "@/hooks/useDeckRailViewportBox";
import { useDeckScrollProgress } from "@/hooks/useDeckScrollProgress";
import { useProjectsNavigationMachine } from "@/hooks/useProjectsNavigationMachine";
import { fontDisplay, fontSans } from "@/lib/fonts";
import {
  cardYpx,
  cardZIndex,
  getDeckNeededHeightPx,
  H_CARD_BLOCK_PX,
} from "@/lib/projectDeck";
import { PROJECTS, type Project } from "@/lib/projects";
import { ProjectDetailPanel } from "@/components/projects/ProjectDetailPanel";

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
  const { iconSrc, icon, iconScale, iconObjectFit, iconTileVariant } = project;
  const fit = iconObjectFit ?? "cover";
  const tileVariant = iconTileVariant ?? "dark";
  const tileSurface =
    tileVariant === "light"
      ? "bg-linear-to-b from-[#fffbeb] to-[#ffedd5] ring-1 ring-orange-950/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
      : "bg-linear-to-b from-zinc-800 to-zinc-950";

  const iconBox = (
    <span
      aria-hidden
      className={`project-stack-icon-tile relative flex h-[7.5rem] w-[7.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl sm:h-32 sm:w-32 ${tileSurface} ${fit === "contain" ? "p-2 sm:p-2.5" : ""}`}
    >
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt=""
          fill
          className={fit === "contain" ? "object-contain" : "object-cover"}
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

const stackSizeClass = "max-w-[38rem]";
/** Keep the focused card at the same visual size as in the stack. */
const heroSizeClass = "max-w-[38rem]";
const detailHeroMaxClass = "max-w-[38rem]";
const detailGridMaxClass = "max-w-[38rem]";

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
  const { stackTheme } = project;
  const onLight = stackTheme.textTone === "onLight";
  const titleClass = onLight
    ? `text-black ${fontSans.className} text-lg font-bold leading-tight tracking-tight sm:text-xl`
    : `text-white ${fontSans.className} text-lg font-bold leading-tight tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] sm:text-xl`;
  const bodyClass = onLight
    ? `${fontSans.className} text-sm font-normal leading-snug text-black sm:leading-normal`
    : `${fontSans.className} text-sm font-normal leading-snug text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.18)] sm:leading-normal`;
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
  const shellClass = `project-stack-card relative block w-full max-w-[38rem] overflow-hidden rounded-xl ring-1 ring-white/20 transition-transform duration-200 will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5`;

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
        className="relative z-10 mx-auto h-full min-h-0 w-full min-w-0 max-w-[38rem] touch-manipulation overflow-hidden overscroll-behavior-y-contain"
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
  return (
    <ProjectDetailPanel
      project={project}
      onBack={onBack}
      backButtonRef={backButtonRef}
      reduceMotion={reduceMotion}
      showDetails={showDetails}
      heroTargetRef={heroTargetRef}
      showHeroCard={showHeroCard}
      detailsHidden={detailsHidden}
      heroCard={
        <ProjectStackCard
          project={project}
          title={tProject(`${project.id}.title`)}
          description={tProject(`${project.id}.description`)}
          size="hero"
          layoutId={undefined}
          reduceMotion={reduceMotion}
        />
      }
      heroPlaceholderHeightPx={H_CARD_BLOCK_PX}
      detailHeroMaxClass={detailHeroMaxClass}
      detailGridMaxClass={detailGridMaxClass}
    />
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
    <ul className="project-deck-reduce-list mx-auto flex h-full min-h-0 w-full max-w-[38rem] list-none flex-col gap-5 overflow-y-auto overflow-x-hidden p-0 pr-0.5 sm:gap-6">
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

export function ProjectsStack({
  reduceMotion: reduceMotionProp,
}: ProjectsStackProps) {
  const reduceMotion = !!reduceMotionProp;
  const tProject = useTranslations("Project");
  const {
    navPhase,
    setNavPhase,
    selectedId,
    selected,
    selectedIndex,
    showDetailsPanel,
    setShowDetailsPanel,
    flipFrom,
    setFlipFrom,
    flipTo,
    setFlipTo,
    siblingExitActive,
    siblingEnterActive,
    selectedFadeActive,
    hideSelectedInStack,
    showStack,
    showDetail,
    onSelectProject,
    closeToList,
  } = useProjectsNavigationMachine({ reduceMotion });
  const heroTargetRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const forwardingWheelRef = useRef(false);
  const onPageWheelCapture = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (forwardingWheelRef.current || navPhase !== "list") {
        return;
      }
      const host = e.currentTarget;
      const track = host.querySelector<HTMLElement>("[data-project-stack-track]");
      if (!track) {
        return;
      }
      if (track.contains(e.target as Node)) {
        return;
      }
      const canScroll = track.scrollHeight - track.clientHeight > 1;
      if (!canScroll) {
        return;
      }
      const forwarded = new window.WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        deltaZ: e.deltaZ,
        deltaMode: e.deltaMode,
        clientX: e.clientX,
        clientY: e.clientY,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      });
      forwardingWheelRef.current = true;
      track.dispatchEvent(forwarded);
      forwardingWheelRef.current = false;
      if (forwarded.defaultPrevented) {
        e.preventDefault();
      }
    },
    [navPhase],
  );

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
  }, [navPhase, flipFrom, flipTo, selectedId, setFlipTo]);

  const onBack = useCallback(() => {
    if (reduceMotion) {
      closeToList();
      return;
    }
    const heroRect = heroTargetRef.current?.getBoundingClientRect();
    if (!heroRect || !selectedId) {
      closeToList();
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
  }, [reduceMotion, selectedId, closeToList, setFlipFrom, setFlipTo, setNavPhase, setShowDetailsPanel]);

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
    <div
      className="project-details-container relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
      onWheelCapture={onPageWheelCapture}
    >
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
                closeToList();
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
