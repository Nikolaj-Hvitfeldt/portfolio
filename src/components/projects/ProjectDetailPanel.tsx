"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMessages, useTranslations } from "next-intl";
import type { RefObject, ReactNode } from "react";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { projectFeatureListFromMessages, projectStatusBadgeClass } from "@/lib/projectContent";
import type { Project } from "@/lib/projects";
import { techTagIconForLabel } from "@/lib/techTagIcons";

function HighlightSpotIcon() {
  return (
    <span
      aria-hidden
      className="relative mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center"
    >
      <span className="absolute inline-flex h-3 w-3 rounded-full bg-amber-300/55 blur-[3px] dark:bg-amber-300/70" />
      <span className="absolute inline-flex h-2 w-2 rounded-full bg-amber-100/90 shadow-[0_0_10px_rgba(251,191,36,0.9)] dark:bg-amber-100/95" />
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
      className={`${fontSans.className} inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-white px-2.5 py-0.5 text-[11px] font-medium text-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white dark:text-zinc-900`}
    >
      {techTagIconForLabel(tag)}
      <span>{tag}</span>
    </span>
  );
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function ProjectDetailPanel({
  project,
  onBack,
  backButtonRef,
  reduceMotion,
  showDetails,
  heroTargetRef,
  showHeroCard,
  detailsHidden,
  heroCard,
  heroPlaceholderHeightPx,
  detailHeroMaxClass,
  detailGridMaxClass,
}: {
  project: Project;
  onBack: () => void;
  backButtonRef: RefObject<HTMLButtonElement | null>;
  reduceMotion: boolean;
  showDetails: boolean;
  heroTargetRef?: RefObject<HTMLDivElement | null>;
  showHeroCard?: boolean;
  detailsHidden?: boolean;
  heroCard: ReactNode;
  heroPlaceholderHeightPx: number;
  detailHeroMaxClass: string;
  detailGridMaxClass: string;
}) {
  const tProject = useTranslations("Project");
  const messages = useMessages() as { Project?: Record<string, { features?: unknown }> };
  const id = project.id;
  const title = tProject(`${id}.title`);
  const about = tProject(`${id}.longAbout`);
  const features = projectFeatureListFromMessages(messages.Project, id);
  const infoYear = tProject(`${id}.infoYear`);
  const infoStatus = tProject(`${id}.infoStatus`);
  const infoNext = tProject(`${id}.infoNext`);
  const hasInfoStatus = infoStatus.trim().length > 0;
  const hasInfoNext = infoNext.trim().length > 0;
  const canSource = isExternalHref(project.href);
  const canLive = Boolean(project.liveUrl && isExternalHref(project.liveUrl));

  return (
    <div className="project-details-root flex w-full min-w-0 flex-1 flex-col gap-0 pb-6">
      <div className="mx-auto w-full min-w-0 shrink-0 px-0 pr-4 sm:pr-6">
        <div className={`mx-auto w-full min-w-0 ${detailHeroMaxClass}`}>
          <div className="mb-2 flex w-full justify-start">
            <button
              ref={backButtonRef}
              type="button"
              onClick={onBack}
              className={`project-details-back group inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-[#cfb69e] transition-colors hover:text-[#dfc9b3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cfb69e]/45 dark:text-[#cfb69e] dark:hover:text-[#dfc9b3] ${fontSans.className}`}
              aria-label={tProject("ui.back")}
            >
              <span
                aria-hidden
                className="inline-block -translate-y-px transition-transform duration-200 group-hover:-translate-x-0.5"
              >
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
              <span className="underline-offset-2 group-hover:underline">
                {tProject("ui.back")}
              </span>
            </button>
          </div>

          <div className="mt-0 flex w-full justify-center sm:px-0">
            <motion.div
              ref={heroTargetRef}
              className={`w-full min-w-0 ${detailHeroMaxClass}`}
              initial={false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0 }}
            >
              {showHeroCard ? (
                heroCard
              ) : (
                <div
                  aria-hidden
                  style={{
                    minHeight: heroPlaceholderHeightPx,
                    height: heroPlaceholderHeightPx,
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
              className={`mx-auto grid w-full min-w-0 ${detailGridMaxClass} gap-6 sm:grid-cols-1 md:grid-cols-2 md:gap-7 md:gap-x-9`}
            >
              <div className="min-w-0 space-y-6">
                <section>
                  <h2
                    className={`${fontDisplay.className} project-details-h2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50`}
                  >
                    {tProject("ui.about")}
                  </h2>
                  <p className={`${fontSans.className} mt-1.5 whitespace-pre-line text-[13.5px] font-normal leading-6 text-zinc-600 dark:text-zinc-300/95`}>
                    {about}
                  </p>
                </section>
                {features.length > 0 ? (
                  <section>
                    <h2
                      className={`${fontDisplay.className} project-details-h2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50`}
                    >
                      {tProject("ui.keyFeatures")}
                    </h2>
                    <ul className="mt-2.5 space-y-1.5">
                      {features.map((f) => (
                        <li
                          key={f}
                          className={`${fontSans.className} flex items-start gap-2.5 text-[13px] leading-5 text-zinc-600 dark:text-zinc-200/95`}
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
                    className={`${fontDisplay.className} project-details-h2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50`}
                  >
                    {tProject("ui.info")}
                  </h2>
                  <ul className="mt-2.5 space-y-1.5 text-[13px] text-zinc-600 dark:text-zinc-200/95">
                    {canSource ? (
                      <li>
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-details-info-link group inline-flex max-w-full items-center gap-2 break-all rounded-md text-zinc-800 hover:text-zinc-950 dark:text-zinc-100 dark:hover:text-white"
                        >
                          <Image
                            src="/tech-icons/github-logo.svg"
                            alt=""
                            aria-hidden
                            width={16}
                            height={16}
                            className="h-4 w-4 shrink-0 object-contain opacity-90 transition-opacity group-hover:opacity-100"
                          />
                          <span className="min-w-0 text-[12.5px] font-medium">
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
                          className="project-details-info-link group inline-flex max-w-full items-center gap-2 break-all rounded-md text-zinc-800 hover:text-zinc-950 dark:text-zinc-100 dark:hover:text-white"
                        >
                          <LinkIcon className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-300 dark:group-hover:text-zinc-100" />
                          <span className="min-w-0 text-[12.5px] font-medium">
                            {project.liveUrl.replace(/^https?:\/\//, "")}
                          </span>
                        </a>
                        <p
                          className={`${fontSans.className} mt-1 text-[11px] text-zinc-500 dark:text-zinc-300/85`}
                        >
                          {tProject("ui.openLive")}
                        </p>
                      </li>
                    ) : null}
                    <li className="flex items-center gap-2.5">
                      <CalendarIcon className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-300" />
                      <span className={fontSans.className}>{infoYear}</span>
                    </li>
                    {hasInfoStatus ? (
                      <li className={`${fontSans.className} flex items-center gap-2 text-zinc-500`}>
                        <span className="text-zinc-600 dark:text-zinc-200/90">
                          {tProject("ui.status")}:
                        </span>
                        <span
                          className={`${fontSans.className} inline-flex items-center rounded-md border px-2 py-[2px] text-[10px] font-semibold tracking-[0.01em] ${projectStatusBadgeClass(
                            project.status,
                          )}`}
                        >
                          {infoStatus}
                        </span>
                      </li>
                    ) : null}
                    {hasInfoNext ? (
                      <li className={`${fontSans.className} text-zinc-500`}>
                        <span className="text-zinc-600 dark:text-zinc-200/90">
                          {tProject("ui.next")}:
                        </span>{" "}
                        {infoNext}
                      </li>
                    ) : null}
                  </ul>
                </section>
                <section className="pt-0.5">
                  <h2
                    className={`${fontDisplay.className} project-details-h2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50`}
                  >
                    {tProject("ui.tech")}
                  </h2>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
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
