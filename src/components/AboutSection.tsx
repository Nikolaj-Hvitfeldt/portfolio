"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { ABOUT_TECH_STACK } from "@/lib/about";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { SITE } from "@/lib/site";

export function AboutSection() {
  const t = useTranslations("About");
  const glassCard = "surface-glass p-6 sm:p-8";

  return (
    <section aria-label={t("title")} className="py-8 sm:py-10 md:py-12">
      <Container className="space-y-6">
        <div className={glassCard}>
          <h2
            className={`font-bento-serif ${fontDisplay.className} text-xl font-bold tracking-tight text-black dark:text-white`}
          >
            {t("aboutMeTitle")}
          </h2>
          <div
            className={`${fontSans.className} mt-4 space-y-4 text-sm font-normal leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base`}
          >
            <p>{t("aboutP1")}</p>
            <p>{t("aboutP2")}</p>
            <p>{t("aboutP3")}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={glassCard}>
            <h3
              className={`font-bento-serif ${fontDisplay.className} text-xl font-bold tracking-tight`}
            >
              {t("specsTitle")}
            </h3>
            <dl
              className={`${fontSans.className} mt-4 space-y-3 text-sm font-normal sm:text-base`}
            >
              <div>
                <dt className="font-medium">{t("locationLabel")}</dt>
                <dd className="text-zinc-600 dark:text-zinc-400">
                  {SITE.location}
                </dd>
              </div>
              <div>
                <dt className="font-medium">{t("languagesLabel")}</dt>
                <dd className="text-zinc-600 dark:text-zinc-400">
                  {t("languages")}
                </dd>
              </div>
              <div>
                <dt className="font-medium">{t("educationLabel")}</dt>
                <dd className="text-zinc-600 dark:text-zinc-400">
                  {t("education")}
                </dd>
              </div>
              <div>
                <dt className="font-medium">{t("currentEducationLabel")}</dt>
                <dd className="text-zinc-600 dark:text-zinc-400">
                  {t("currentEducation")}
                </dd>
              </div>
            </dl>
          </div>

          <div className={glassCard}>
            <h3
              className={`font-bento-serif ${fontDisplay.className} text-xl font-bold tracking-tight`}
            >
              {t("techStackTitle")}
            </h3>
            <div className={`${fontSans.className} mt-4 space-y-4`}>
              {ABOUT_TECH_STACK.map((group) => (
                <div key={group.categoryKey}>
                  <h4
                    className={`${fontSans.className} text-sm font-medium sm:text-base`}
                  >
                    {t(`techStack.${group.categoryKey}`)}
                  </h4>
                  <p
                    className={`${fontSans.className} mt-1 text-sm font-normal text-zinc-600 dark:text-zinc-400 sm:text-base`}
                  >
                    {group.items.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
