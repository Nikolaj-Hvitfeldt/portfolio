"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/Container";
import { EXPERIENCE } from "@/lib/experience";
import { fontDisplay, fontSans } from "@/lib/fonts";

export function ExperienceSection() {
  const t = useTranslations("WorkExperience");

  return (
    <section aria-label={t("title")} className="py-7 sm:py-9 md:py-11">
      <Container className="space-y-6">
        <ol className="mx-auto w-full max-w-3xl space-y-7 sm:space-y-9">
          {EXPERIENCE.map((entry, index) => (
            <li
              key={entry.id}
              className={
                index === 0
                  ? ""
                  : "border-t border-zinc-200/70 pt-7 dark:border-zinc-800/90 sm:pt-9"
              }
            >
              <div className="min-w-0">
                <div className="mb-2">
                  <div className="relative w-full max-w-[360px] sm:max-w-[420px]">
                    <Image
                      src={t(`entries.${entry.id}.image.src`)}
                      alt={t(`entries.${entry.id}.image.alt`)}
                      width={420}
                      height={120}
                      className="h-16 w-auto rounded-md object-contain sm:h-18"
                    />
                  </div>
                </div>
                <p className={`${fontSans.className} mt-3 leading-snug`}>
                  <span className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 sm:text-[18px]">
                    {t(`entries.${entry.id}.role`)}
                  </span>
                  <span className="mx-2 text-zinc-400 dark:text-zinc-500">
                    |
                  </span>
                  <span className="text-[15px] font-medium tracking-wide text-zinc-600 dark:text-zinc-300">
                    {t(`entries.${entry.id}.period`)}
                  </span>
                </p>
                <ul
                  className={`${fontSans.className} mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-6 text-zinc-700 dark:text-zinc-300/95 sm:text-[15px]`}
                >
                  {t
                    .raw(`entries.${entry.id}.bullets`)
                    .map((bullet: string) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
