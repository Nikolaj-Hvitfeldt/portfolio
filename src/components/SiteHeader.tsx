"use client";

import { SITE } from "@/lib/site";
import { Container } from "@/components/Container";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <Container className="grid grid-cols-[1fr_auto_1fr] items-center py-4">
        <div aria-hidden className="justify-self-start" />
        <a href="#top" className="justify-self-center font-semibold tracking-tight">
          {SITE.name}
        </a>
        <div className="justify-self-end">
          <LocaleSwitcher />
        </div>
      </Container>
    </header>
  );
}
