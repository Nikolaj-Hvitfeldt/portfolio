"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { Container } from "@/components/Container";
import { ABOUT_TECH_STACK } from "@/lib/about";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import { techTagIconForLabel } from "@/lib/techTagIcons";

function highlightKeywords(text: string, keywords: string[], baseDelayMs = 0) {
  if (!keywords.length) {
    return text;
  }
  const escaped = keywords
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);
  let keywordIndex = 0;
  return parts.map((part, idx) => {
    const isKeyword = keywords.some(
      (k) => part.toLowerCase() === k.toLowerCase(),
    );
    if (!isKeyword) {
      return <span key={`t-${idx}`}>{part}</span>;
    }
    const delayMs = `${baseDelayMs + keywordIndex * 120}ms`;
    keywordIndex += 1;
    return (
      <span
        key={`k-${idx}`}
        className="about-keyword-scratch"
        style={{ "--scratch-delay": delayMs } as CSSProperties}
      >
        <span className="about-keyword-scratch__text">{part}</span>
        <svg
          aria-hidden
          className="about-keyword-scratch__svg"
          viewBox="0 0 100 14"
          preserveAspectRatio="none"
        >
          <path
            className="about-keyword-scratch__stroke about-keyword-scratch__stroke--a"
            d="M3 8.2 C18 6.6, 34 9.1, 50 7.9 C66 6.9, 82 9.1, 96 8.25"
          />
          <path
            className="about-keyword-scratch__stroke about-keyword-scratch__stroke--b"
            d="M4 10.5 C19 9.1, 35 11.4, 51 10.4 C67 9.4, 81 11.25, 90.2 10.95 C92.9 11.05, 94.7 11.4, 95.7 11.9"
          />
        </svg>
      </span>
    );
  });
}

function highlightMixedKeywords(
  text: string,
  softKeywords: string[],
  boxKeywords: string[],
) {
  const allKeywords = [...softKeywords, ...boxKeywords];
  if (!allKeywords.length) {
    return text;
  }
  const escaped = allKeywords
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);
  let boxIndex = 0;
  let softIndex = 0;
  return parts.map((part, idx) => {
    const lower = part.toLowerCase();
    const isBox = boxKeywords.some((k) => lower === k.toLowerCase());
    if (isBox) {
      const explicitDelayMs =
        lower === "web applications" || lower === "webapplikationer"
          ? 0
          : boxIndex * 1200;
      const delayMs = `${explicitDelayMs}ms`;
      boxIndex += 1;
      return (
        <span
          key={`bx-${idx}`}
          className="about-keyword-box"
          style={{ "--scratch-delay": delayMs } as CSSProperties}
        >
          <span className="about-keyword-box__text">{part}</span>
          <svg
            aria-hidden
            className="about-keyword-box__svg"
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
          >
            <path
              className="about-keyword-box__line about-keyword-box__line--top"
              d="M3 6 C16 3, 34 5, 52 4.3 C70 3.8, 85 4.7, 97.5 6"
            />
            <path
              className="about-keyword-box__line about-keyword-box__line--right"
              d="M97.5 6 C99.8 12, 99.2 19.5, 96.2 27.4"
            />
            <path
              className="about-keyword-box__line about-keyword-box__line--bottom"
              d="M95.6 27.4 C80 30.4, 58 28.2, 36 29.1 C20.5 29.6, 8.8 28.9, 2.8 26.3"
            />
            <path
              className="about-keyword-box__line about-keyword-box__line--left"
              d="M2.8 26.3 C0.4 19.8, 0.9 11.6, 4.3 5.3"
            />
            <path
              className="about-keyword-box__line2 about-keyword-box__line2--top"
              d="M1.4 4.9 C15 2.3, 35 3.7, 53 3.5 C73 3.3, 88.3 4.2, 99.3 6.1"
            />
            <path
              className="about-keyword-box__line2 about-keyword-box__line2--right"
              d="M99.3 6.1 C101.8 13.4, 101 21.1, 97.6 29.2"
            />
            <path
              className="about-keyword-box__line2 about-keyword-box__line2--bottom"
              d="M97.6 29.2 C80.2 31.8, 57.4 30.2, 35.1 30.9 C18.9 31.4, 7.2 30.1, 1.2 27.1"
            />
            <path
              className="about-keyword-box__line2 about-keyword-box__line2--left"
              d="M1.2 27.1 C-1 20, -0.4 11.8, 2.9 4.8"
            />
          </svg>
        </span>
      );
    }
    const isSoft = softKeywords.some((k) => lower === k.toLowerCase());
    if (isSoft) {
      const explicitDelayMs =
        lower === "react"
          ? 1300
          : lower === "typescript"
            ? 2700
            : 1300 + softIndex * 1200;
      const delayMs = `${explicitDelayMs}ms`;
      softIndex += 1;
      return (
        <span
          key={`sk-${idx}`}
          className="about-keyword-soft"
          style={{ "--soft-delay": delayMs } as CSSProperties}
        >
          {part}
        </span>
      );
    }
    return <span key={`mx-${idx}`}>{part}</span>;
  });
}

export function AboutSection() {
  const t = useTranslations("About");
  const glassCard = "surface-glass p-6 sm:p-8";
  const sectionHeadingClass = `${fontDisplay.className} text-[18px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50`;
  const reduceMotion = useReducedMotion();
  const drawnKeywords = ["software architecture", "softwarearkitektur"];
  const softKeywords = ["React", "TypeScript"];
  const boxKeywords = ["web applications", "webapplikationer"];
  const cardReveal = reduceMotion
    ? {
        initial: false as const,
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
      };
  return (
    <section aria-label={t("title")} className="py-7 sm:py-9 md:py-11">
      <Container className="space-y-5 sm:space-y-6">
        <motion.div
          className={`${glassCard} relative overflow-hidden`}
          viewport={{ once: true, amount: 0.28 }}
          {...cardReveal}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-14 -top-18 h-44 w-44 rounded-full bg-amber-200/25 blur-3xl dark:bg-indigo-300/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 -bottom-16 h-36 w-36 rounded-full bg-sky-200/20 blur-3xl dark:bg-sky-300/15"
          />
          <div className="min-w-0">
            <h2
              className={`font-bento-serif ${fontDisplay.className} text-[24px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-[28px]`}
            >
              {t("aboutMeTitle")}
            </h2>
            <div
              className={`${fontSans.className} mt-3.5 max-w-[78ch] space-y-2.5 text-[15px] font-normal leading-7 text-zinc-600 dark:text-zinc-300/95`}
            >
              <p className="text-zinc-700 dark:text-zinc-200/95">
                {highlightMixedKeywords(
                  t("aboutP1"),
                  softKeywords,
                  boxKeywords,
                )}
              </p>
              <p className="text-zinc-600 dark:text-zinc-300/95">
                {highlightKeywords(t("aboutP2"), drawnKeywords, 4100)}
              </p>
              <p className="text-zinc-600 dark:text-zinc-300/95">
                {t("aboutP3")}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            className={glassCard}
            viewport={{ once: true, amount: 0.24 }}
            {...cardReveal}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.44, delay: 0.04, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <h3 className={`font-bento-serif ${sectionHeadingClass}`}>
              {t("specsTitle")}
            </h3>
            <dl
              className={`${fontSans.className} mt-3 space-y-2.5 text-[15px] font-medium leading-7 text-zinc-600 dark:text-zinc-200/95`}
            >
              <div>
                <dt className="text-[13px] font-semibold uppercase tracking-[0.03em] text-zinc-700 dark:text-zinc-200/90">
                  {t("locationLabel")}
                </dt>
                <dd className="text-zinc-700 dark:text-zinc-100/95">
                  {SITE.location}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] font-semibold uppercase tracking-[0.03em] text-zinc-700 dark:text-zinc-200/90">
                  {t("languagesLabel")}
                </dt>
                <dd className="text-zinc-700 dark:text-zinc-100/95">
                  {t("languages")}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] font-semibold uppercase tracking-[0.03em] text-zinc-700 dark:text-zinc-200/90">
                  {t("educationLabel")}
                </dt>
                <dd className="text-zinc-700 dark:text-zinc-100/95">
                  {t("education")}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] font-semibold uppercase tracking-[0.03em] text-zinc-700 dark:text-zinc-200/90">
                  {t("currentEducationLabel")}
                </dt>
                <dd className="text-zinc-700 dark:text-zinc-100/95">
                  {t("currentEducation")}
                </dd>
              </div>
            </dl>
          </motion.div>

          <motion.div
            className={glassCard}
            viewport={{ once: true, amount: 0.24 }}
            {...cardReveal}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.44, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <h3 className={`font-bento-serif ${sectionHeadingClass}`}>
              {t("techStackTitle")}
            </h3>
            <div className={`${fontSans.className} mt-2.5 space-y-3.5`}>
              {ABOUT_TECH_STACK.map((group) => (
                <div key={group.categoryKey}>
                  <h4
                    className={`${fontSans.className} text-[12.5px] font-semibold uppercase tracking-[0.03em] text-zinc-700 dark:text-zinc-200/90`}
                  >
                    {t(`techStack.${group.categoryKey}`)}
                  </h4>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li key={`${group.categoryKey}-${item}`}>
                        <span
                          className={`${fontSans.className} inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-white px-2.5 py-0.5 text-[12px] font-medium text-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white dark:text-zinc-900`}
                        >
                          {techTagIconForLabel(item)}
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
