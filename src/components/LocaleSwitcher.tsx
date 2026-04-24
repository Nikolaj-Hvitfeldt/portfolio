"use client";

import { useEffect, useState } from "react";
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
  const [hash, setHash] = useState("");

  // Sync the hash after mount so SSR and the first client render agree, and
  // stay in sync as the user navigates between views (#about, #projects, ...).
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const otherLocale: Locale = locale === "da" ? "en" : "da";
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
