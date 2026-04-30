"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { EXPERIENCE } from "@/lib/experience";
import { fontDisplay, fontSans } from "@/lib/fonts";

export function ExperienceSection() {
  const t = useTranslations("WorkExperience");

  return (
    <section aria-label={t("title")} className="py-8 sm:py-10 md:py-12">
      <Container className="space-y-6">
        <div>
          <h2
            className={`font-bento-serif ${fontDisplay.className} text-2xl font-bold tracking-tight sm:text-3xl`}
          >
            {t("title")}
          </h2>
        </div>

        <div className="surface-glass p-6 sm:p-8">
          <p
            className={`${fontSans.className} max-w-2xl text-sm font-normal leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base`}
          >
            {t("intro")}
          </p>

          <h3
            className={`${fontSans.className} mt-6 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400`}
          >
            {t("timelineTitle")}
          </h3>

          <ol className="mt-4 space-y-5 border-l border-black/10 pl-5 dark:border-white/10">
            {EXPERIENCE.map((entry) => (
              <li key={entry.id} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[1.45rem] top-1.5 h-2 w-2 rounded-full bg-amber-300/90 shadow-[0_0_0_3px_rgba(252,211,77,0.18)] dark:bg-amber-200/80"
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4
                    className={`font-bento-serif ${fontDisplay.className} text-base font-bold tracking-tight sm:text-lg`}
                  >
                    {t(`entries.${entry.id}.role`)}
                  </h4>
                  <span
                    className={`${fontSans.className} text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm`}
                  >
                    {t(`period.${entry.periodKey}`)}
                  </span>
                </div>
                <p
                  className={`${fontSans.className} text-sm text-zinc-600 dark:text-zinc-400`}
                >
                  {t(`entries.${entry.id}.org`)}
                </p>
                <p
                  className={`${fontSans.className} mt-2 max-w-2xl text-sm font-normal leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base`}
                >
                  {t(`entries.${entry.id}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
