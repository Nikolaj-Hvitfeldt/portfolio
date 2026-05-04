"use client";

import { useTranslations } from "next-intl";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { renderDrawnHighlights, renderMixedHighlights } from "@/components/about/HighlightedText";
import {
  ABOUT_BOX_KEYWORDS,
  ABOUT_DRAWN_KEYWORDS,
  ABOUT_SOFT_KEYWORDS,
} from "@/components/about/highlightConfig";

export function AboutIntroCard() {
  const t = useTranslations("About");

  return (
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
          {renderMixedHighlights({
            text: t("aboutP1"),
            boxKeywords: ABOUT_BOX_KEYWORDS,
            softKeywords: ABOUT_SOFT_KEYWORDS,
          })}
        </p>
        <p className="text-zinc-600 dark:text-zinc-300/95">
          {renderDrawnHighlights({
            text: t("aboutP2"),
            drawnKeywords: ABOUT_DRAWN_KEYWORDS,
          })}
        </p>
        <p className="text-zinc-600 dark:text-zinc-300/95">{t("aboutP3")}</p>
      </div>
    </div>
  );
}
