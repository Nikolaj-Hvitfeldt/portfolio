"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { SITE } from "@/lib/site";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.985v5.62H9.35V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const channelBtn =
  "group relative flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center rounded-2xl border border-zinc-200/90 bg-white/70 text-zinc-800 shadow-sm transition-[transform,box-shadow,border-color,background-color,color] duration-200 ease-out will-change-transform hover:-translate-y-0.5 hover:border-[#f0c4a8]/90 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a87c]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/12 dark:bg-zinc-950/45 dark:text-[#fff1e2] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)] dark:hover:border-[#ffe8d1]/35 dark:hover:bg-zinc-900/70 dark:hover:text-white dark:hover:shadow-lg dark:focus-visible:ring-[#ffe8d1]/40 dark:focus-visible:ring-offset-[#05071a] sm:h-[4.75rem] sm:w-[4.75rem]";

const iconClass =
  "h-[1.65rem] w-[1.65rem] text-zinc-700 transition-colors duration-200 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white sm:h-[1.85rem] sm:w-[1.85rem]";

export function ContactSection() {
  const tContact = useTranslations("Contact");
  const tFooter = useTranslations("Footer");
  const rawBullets = tContact.raw("valueBullets");
  const valueBullets = Array.isArray(rawBullets)
    ? (rawBullets as string[])
    : [];

  return (
    <section
      aria-labelledby="contact-value-heading"
      className="py-7 sm:py-9 md:py-11"
    >
      <Container maxWidthClass="max-w-3xl">
        <div className="surface-glass mx-auto max-w-prose px-6 py-7 text-left sm:px-8 sm:py-8">
          <h2
            id="contact-value-heading"
            className={`font-bento-serif ${fontDisplay.className} text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-white`}
          >
            {tContact("valueTitle")}
          </h2>
          <p
            className={`${fontSans.className} mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base`}
          >
            {tContact("valueLead")}
          </p>
          <p
            className={`${fontSans.className} mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base`}
          >
            {tContact("valueP2")}
          </p>
          {valueBullets.length > 0 ? (
            <ul
              className={`${fontSans.className} mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400`}
            >
              {valueBullets.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12 sm:gap-5">
          <li>
            <a
              href={`mailto:${SITE.email}`}
              className={channelBtn}
              aria-label={tFooter("email")}
            >
              <MailIcon className={iconClass} />
            </a>
          </li>
          <li>
            <a
              href={SITE.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={channelBtn}
              aria-label={tFooter("linkedin")}
            >
              <LinkedInIcon className={iconClass} />
            </a>
          </li>
          <li>
            <a
              href={SITE.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={channelBtn}
              aria-label={tFooter("github")}
            >
              <GitHubIcon className={iconClass} />
            </a>
          </li>
        </ul>
      </Container>
    </section>
  );
}
