import { SITE } from "@/lib/site";
import { Container } from "@/components/Container";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <Container className="flex items-center justify-between py-4">
        <a href="#top" className="font-semibold tracking-tight">
          {SITE.name}
        </a>

        <nav aria-label="Primary" className="hidden gap-6 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}

