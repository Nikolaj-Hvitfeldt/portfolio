"use client";

import { useTranslations } from "next-intl";
import { ABOUT_TECH_STACK } from "@/lib/about";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { techTagIconForLabel } from "@/lib/techTagIcons";

export function AboutTechStackCard() {
  const t = useTranslations("About");

  return (
    <>
      <h3
        className={`font-bento-serif ${fontDisplay.className} text-[18px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50`}
      >
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
    </>
  );
}
