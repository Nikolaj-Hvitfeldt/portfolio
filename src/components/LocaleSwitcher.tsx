"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABEL: Record<(typeof routing.locales)[number], string> = {
  da: "Dansk",
  en: "English",
};

const LOCALE_SHORT: Record<(typeof routing.locales)[number], string> = {
  da: "DA",
  en: "EN",
};

export function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale() as (typeof routing.locales)[number];
  const pathname = usePathname();

  const otherLocale = locale === "da" ? "en" : "da";
  const hash =
    typeof window !== "undefined" ? window.location.hash ?? "" : "";

  const rest =
    pathname === `/${locale}`
      ? ""
      : pathname.startsWith(`/${locale}/`)
        ? pathname.slice(`/${locale}`.length)
        : pathname;

  const href = `/${otherLocale}${rest}${hash}`;

  return (
    <a
      href={href}
      className="surface-glass-dock inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:text-white motion-reduce:transition-none"
      aria-label={t("language")}
      title={t("switchTo", { locale: LOCALE_LABEL[otherLocale] })}
    >
      <span aria-hidden className="text-zinc-400">
        {LOCALE_SHORT[locale]}
      </span>
      <span aria-hidden className="text-zinc-500">
        /
      </span>
      <span>{LOCALE_SHORT[otherLocale]}</span>
    </a>
  );
}
