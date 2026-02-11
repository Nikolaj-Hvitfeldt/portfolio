"use client";

import { SITE } from "@/lib/site";
import { Container } from "@/components/Container";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";

const NAV = [
  { href: "#about", key: "about" },
  { href: "#projects", key: "projects" },
  { href: "#contact", key: "contact" },
] as const;

export function SiteHeader() {
  const t = useTranslations("Nav");

  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <Container className="flex items-center justify-between py-4">
        <a href="#top" className="font-semibold tracking-tight">
          {SITE.name}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              {t(item.key)}
            </a>
          ))}
          <span className="text-zinc-400 dark:text-zinc-600">·</span>
          <LocaleSwitcher />
        </nav>
      </Container>
    </header>
  );
}

