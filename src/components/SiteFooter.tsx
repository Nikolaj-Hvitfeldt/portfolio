import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { SITE } from "@/lib/site";

type SiteFooterProps = {
  /** Tighter padding when the page is meant to be a single full-height frame (e.g. projects). */
  compact?: boolean;
};

export function SiteFooter({ compact = false }: SiteFooterProps) {
  const t = useTranslations("Footer");
  const linkClass = "hover:text-black dark:hover:text-white";
  const pyClass = compact ? "py-4" : "py-10";

  return (
    <footer className={`border-t border-black/5 dark:border-white/10 ${pyClass}`}>
      <Container className="flex flex-col gap-4 text-sm text-zinc-600 dark:text-zinc-400 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name}. {t("rights")}
        </p>

        <div className="flex gap-4">
          <a
            href={SITE.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {t("github")}
          </a>
          <a
            href={SITE.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {t("linkedin")}
          </a>
          <a href={`mailto:${SITE.email}`} className={linkClass}>
            {t("email")}
          </a>
        </div>
      </Container>
    </footer>
  );
}
