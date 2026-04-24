"use client";

import type { MouseEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const LOCALE_LABEL: Record<Locale, string> = {
  da: "Dansk",
  en: "English",
};

const LOCALE_SHORT: Record<Locale, string> = {
  da: "DA",
  en: "EN",
};

export function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const otherLocale: Locale = locale === "da" ? "en" : "da";
  const rest =
    pathname === `/${locale}`
      ? ""
      : pathname.startsWith(`/${locale}/`)
        ? pathname.slice(`/${locale}`.length)
        : pathname;

  const href = `/${otherLocale}${rest}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const liveHash = window.location.hash;
    const liveSearch = window.location.search;
    window.location.assign(`${href}${liveSearch}${liveHash}`);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="surface-glass-dock inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:text-white motion-reduce:transition-none"
      aria-label={t("language")}
      title={t("switchTo", { locale: LOCALE_LABEL[otherLocale] })}
    >
      <span aria-hidden className="text-zinc-50">
        {LOCALE_SHORT[locale]}
      </span>
      <span aria-hidden className="text-zinc-500">
        /
      </span>
      <span className="text-zinc-400">{LOCALE_SHORT[otherLocale]}</span>
    </a>
  );
}
