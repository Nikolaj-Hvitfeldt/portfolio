"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { ABOUT_TECH_STACK } from "@/lib/about";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import { techTagIconForLabel } from "@/lib/techTagIcons";

export function AboutSection() {
  const t = useTranslations("About");
  const glassCard = "surface-glass p-6 sm:p-8";
  const sectionHeadingClass = `${fontDisplay.className} text-[19px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50`;
  const reduceMotion = useReducedMotion();
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
    <section aria-label={t("title")} className="py-8 sm:py-10 md:py-12">
      <Container className="space-y-6">
        <motion.div
          className={glassCard}
          viewport={{ once: true, amount: 0.28 }}
          {...cardReveal}
        >
          <h2
            className={`font-bento-serif ${sectionHeadingClass}`}
          >
            {t("aboutMeTitle")}
          </h2>
          <p
            className={`${fontSans.className} mt-1.5 text-[13.5px] font-medium text-zinc-500 dark:text-zinc-300/85`}
          >
            {t("subtitle")}
          </p>
          <div
            className={`${fontSans.className} mt-2.5 space-y-2.5 text-[14.5px] font-normal leading-6 text-zinc-600 dark:text-zinc-300/95`}
          >
            <p>{t("aboutP1")}</p>
            <p>{t("aboutP2")}</p>
            <p>{t("aboutP3")}</p>
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
              className={`${fontSans.className} mt-2.5 space-y-1.5 text-[14px] font-normal text-zinc-600 dark:text-zinc-200/95`}
            >
              <div>
                <dt className="font-medium text-zinc-800 dark:text-zinc-100">
                  {t("locationLabel")}
                </dt>
                <dd className="text-zinc-600 dark:text-zinc-200/90">
                  {SITE.location}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-800 dark:text-zinc-100">
                  {t("languagesLabel")}
                </dt>
                <dd className="text-zinc-600 dark:text-zinc-200/90">
                  {t("languages")}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-800 dark:text-zinc-100">
                  {t("educationLabel")}
                </dt>
                <dd className="text-zinc-600 dark:text-zinc-200/90">
                  {t("education")}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-800 dark:text-zinc-100">
                  {t("currentEducationLabel")}
                </dt>
                <dd className="text-zinc-600 dark:text-zinc-200/90">
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
            <div className={`${fontSans.className} mt-2.5 space-y-3`}>
              {ABOUT_TECH_STACK.map((group) => (
                <div key={group.categoryKey}>
                  <h4
                    className={`${fontSans.className} text-[14px] font-medium text-zinc-800 dark:text-zinc-100`}
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
