"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABEL: Record<(typeof routing.locales)[number], string> = {
  da: "Dansk",
  en: "English",
};

export function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale() as (typeof routing.locales)[number];
  const pathname = usePathname();

  const otherLocale = locale === "da" ? "en" : "da";
  const hash =
    typeof window !== "undefined" ? window.location.hash ?? "" : "";

  // Strip locale prefix if present.
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
      className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
      aria-label={t("language")}
      title={t("switchTo", { locale: LOCALE_LABEL[otherLocale] })}
    >
      {LOCALE_LABEL[otherLocale]}
    </a>
  );
}

