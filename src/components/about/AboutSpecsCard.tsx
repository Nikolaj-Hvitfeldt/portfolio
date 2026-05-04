"use client";

import { useTranslations } from "next-intl";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { SITE } from "@/lib/site";

export function AboutSpecsCard() {
  const t = useTranslations("About");

  return (
    <>
      <h3
        className={`font-bento-serif ${fontDisplay.className} text-[18px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50`}
      >
        {t("specsTitle")}
      </h3>
      <dl
        className={`${fontSans.className} mt-3 space-y-2.5 text-[15px] font-medium leading-7 text-zinc-600 dark:text-zinc-200/95`}
      >
        <div>
          <dt className="text-[13px] font-semibold uppercase tracking-[0.03em] text-zinc-700 dark:text-zinc-200/90">
            {t("locationLabel")}
          </dt>
          <dd className="text-zinc-700 dark:text-zinc-100/95">{SITE.location}</dd>
        </div>
        <div>
          <dt className="text-[13px] font-semibold uppercase tracking-[0.03em] text-zinc-700 dark:text-zinc-200/90">
            {t("languagesLabel")}
          </dt>
          <dd className="text-zinc-700 dark:text-zinc-100/95">{t("languages")}</dd>
        </div>
        <div>
          <dt className="text-[13px] font-semibold uppercase tracking-[0.03em] text-zinc-700 dark:text-zinc-200/90">
            {t("educationLabel")}
          </dt>
          <dd className="text-zinc-700 dark:text-zinc-100/95">{t("education")}</dd>
        </div>
        <div>
          <dt className="text-[13px] font-semibold uppercase tracking-[0.03em] text-zinc-700 dark:text-zinc-200/90">
            {t("currentEducationLabel")}
          </dt>
          <dd className="text-zinc-700 dark:text-zinc-100/95">{t("currentEducation")}</dd>
        </div>
      </dl>
    </>
  );
}
