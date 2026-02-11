import { SITE } from "@/lib/site";
import { Container } from "@/components/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 py-10 dark:border-white/10">
      <Container className="flex flex-col gap-4 text-sm text-zinc-600 dark:text-zinc-400 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>

        <div className="flex gap-4">
          <a
            href={SITE.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white"
          >
            GitHub
          </a>
          <a
            href={SITE.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="hover:text-black dark:hover:text-white"
          >
            Email
          </a>
        </div>
      </Container>
    </footer>
  );
}

