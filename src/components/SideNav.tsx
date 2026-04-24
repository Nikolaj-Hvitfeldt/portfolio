"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactElement, SVGProps } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

type View = "home" | "about" | "projects" | "experience" | "contact";

const NAV_ITEMS: readonly View[] = [
  "home",
  "about",
  "projects",
  "experience",
  "contact",
];

function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="8" r="3.5" strokeWidth="1.8" />
      <path d="M5.5 19.5c1.5-3 4-4.5 6.5-4.5s5 1.5 6.5 4.5" strokeWidth="1.8" />
    </svg>
  );
}

function IconGrid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" strokeWidth="1.8" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" strokeWidth="1.8" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" strokeWidth="1.8" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" strokeWidth="1.8" />
    </svg>
  );
}

function IconBriefcase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" strokeWidth="1.8" />
      <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5" strokeWidth="1.8" />
      <path d="M3.5 12h17" strokeWidth="1.8" />
    </svg>
  );
}

function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" strokeWidth="1.8" />
      <path d="M4.5 7l7.5 6 7.5-6" strokeWidth="1.8" />
    </svg>
  );
}

function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4v-9.5Z" strokeWidth="1.8" />
    </svg>
  );
}

function getItemIcon(item: View) {
  if (item === "home") return IconHome;
  if (item === "projects") return IconGrid;
  if (item === "experience") return IconBriefcase;
  if (item === "contact") return IconMail;
  return IconUser;
}

function NavItem({
  label,
  active,
  hovered,
  onClick,
  Icon,
  waveXMobile,
  waveYMobile,
  waveXDesktop,
  waveYDesktop,
  waveScale,
  waveZ,
  onHoverStart,
  onHoverEnd,
  reduceMotion,
}: {
  label: string;
  active: boolean;
  hovered: boolean;
  onClick: () => void;
  Icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
  waveXMobile: number;
  waveYMobile: number;
  waveXDesktop: number;
  waveYDesktop: number;
  waveScale: number;
  waveZ: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  reduceMotion: boolean;
}) {
  const buttonClass =
    "group/item flex min-h-10 flex-1 items-center justify-center rounded-lg px-1.5 py-1 transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500 md:w-full md:flex-none md:min-h-11 md:px-1 md:py-1.5 translate-x-[var(--wave-x-mobile)] translate-y-[var(--wave-y-mobile)] md:translate-x-[var(--wave-x-desktop)] md:translate-y-[var(--wave-y-desktop)]";
  const circleClass = active
    ? "bg-amber-100/90 text-zinc-900 shadow-[0_2px_10px_rgba(255,224,185,0.45)] dark:bg-[rgba(255,220,180,0.78)] dark:text-zinc-900"
    : hovered
      ? "bg-zinc-400/28 text-zinc-900 dark:bg-zinc-600/34 dark:text-zinc-100"
      : "bg-transparent text-zinc-500 dark:text-zinc-300";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      aria-label={label}
      className={buttonClass}
      style={{ zIndex: waveZ } as CSSProperties}
      animate={
        {
          "--wave-x-mobile": `${waveXMobile}px`,
          "--wave-y-mobile": `${waveYMobile}px`,
          "--wave-x-desktop": `${waveXDesktop}px`,
          "--wave-y-desktop": `${waveYDesktop}px`,
          scale: waveScale,
        } as never
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 290, damping: 26, mass: 0.72 }
      }
    >
      <motion.span
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${circleClass}`}
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 24, mass: 0.65 }
        }
      >
        <Icon className="h-4 w-4 shrink-0 md:h-[18px] md:w-[18px]" aria-hidden />
      </motion.span>
      <span className="sr-only">{label}</span>
    </motion.button>
  );
}

export function SideNav({
  currentView,
  onNavigate,
}: {
  currentView: View;
  onNavigate: (view: View) => void;
}) {
  const tNav = useTranslations("Nav");
  const tProjects = useTranslations("Projects");
  const tWork = useTranslations("WorkExperience");
  const tContact = useTranslations("Contact");
  const reduceMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoverExitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverExitTimer.current) {
        clearTimeout(hoverExitTimer.current);
      }
    };
  }, []);

  const getLabel = (item: View) => {
    if (item === "home") return tNav("home");
    if (item === "projects") return tProjects("title");
    if (item === "experience") return tWork("title");
    if (item === "contact") return tContact("title");
    return tNav("about");
  };

  return (
    <motion.nav
      aria-label={tNav("primary")}
      onMouseLeave={() => {
        if (hoverExitTimer.current) clearTimeout(hoverExitTimer.current);
        hoverExitTimer.current = setTimeout(() => setHoveredIndex(null), 45);
      }}
      className="group surface-glass-dock fixed bottom-4 left-1/2 z-30 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 px-1.5 py-1.5 motion-reduce:transition-none md:top-1/2 md:bottom-auto md:left-3 md:right-auto md:w-14 md:-translate-y-1/2 md:translate-x-0 md:origin-left md:px-1 md:py-1.5"
    >
      <div className="flex items-end gap-0.5 md:flex-col md:items-stretch md:justify-start md:gap-1">
        {NAV_ITEMS.map((item, index) => {
          const isActive = currentView === item;
          const Icon = getItemIcon(item);
          const isHovered = hoveredIndex === index;
          const hasHover = hoveredIndex !== null;
          const delta = hasHover ? index - hoveredIndex : 0;
          const distance = Math.abs(delta);
          const amplitude = hasHover ? Math.exp(-distance * 0.72) : 0;

          const waveXDesktop = hasHover ? 9 * amplitude : 0;
          const waveYDesktop = hasHover ? delta * amplitude * 5.5 : 0;

          const waveXMobile = hasHover ? delta * amplitude * 2.6 : 0;
          const waveYMobile = hasHover ? -3.6 * amplitude : 0;

          const waveScale = hasHover ? 1 + amplitude * 0.085 : 1;
          const waveZ = hasHover ? Math.max(2, 30 - distance * 8) : 1;

          return (
            <NavItem
              key={item}
              label={getLabel(item)}
              active={isActive}
              hovered={isHovered}
              onClick={() => onNavigate(item)}
              Icon={Icon}
              waveXMobile={waveXMobile}
              waveYMobile={waveYMobile}
              waveXDesktop={waveXDesktop}
              waveYDesktop={waveYDesktop}
              waveScale={waveScale}
              waveZ={waveZ}
              onHoverStart={() => {
                if (hoverExitTimer.current) clearTimeout(hoverExitTimer.current);
                setHoveredIndex(index);
              }}
              onHoverEnd={() => {
                if (hoverExitTimer.current) clearTimeout(hoverExitTimer.current);
                hoverExitTimer.current = setTimeout(() => setHoveredIndex(null), 45);
              }}
              reduceMotion={!!reduceMotion}
            />
          );
        })}
      </div>
    </motion.nav>
  );
}

export type { View };
