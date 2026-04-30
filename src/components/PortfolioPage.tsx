"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AboutSection } from "@/components/AboutSection";
import { Block } from "@/components/Block";
import { ContactCardBubbles } from "@/components/ContactCardBubbles";
import { Container } from "@/components/Container";
import { ExperienceSection } from "@/components/ExperienceSection";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { ProjectsStack } from "@/components/ProjectsStack";
import { HomeBentoStack } from "@/components/HomeBentoStack";
import { ShootingStars } from "@/components/ShootingStars";
import { SideNav, type View } from "@/components/SideNav";
import { SiteFooter } from "@/components/SiteFooter";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { PROJECTS } from "@/lib/projects";
import { SITE } from "@/lib/site";

function parseHash(hash: string): View {
  const value = hash.replace("#", "").toLowerCase();
  if (
    value === "about" ||
    value === "projects" ||
    value === "experience" ||
    value === "contact"
  ) {
    return value;
  }
  return "home";
}

export function PortfolioPage() {
  const pathname = usePathname();
  const tHero = useTranslations("Hero");
  const tProjects = useTranslations("Projects");
  const tAbout = useTranslations("About");
  const tWork = useTranslations("WorkExperience");
  const tContact = useTranslations("Contact");

  const [view, setView] = useState<View>("home");
  const reduceMotion = useReducedMotion();
  const backgroundFxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onHashChange = () => setView(parseHash(window.location.hash));
    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const onPointerMove = (event: PointerEvent) => {
      const el = backgroundFxRef.current;
      if (!el) {
        return;
      }
      const nx = window.innerWidth > 0 ? event.clientX / window.innerWidth : 0.5;
      const ny =
        window.innerHeight > 0 ? event.clientY / window.innerHeight : 0.5;
      const px = (nx - 0.5) * 18;
      const py = (ny - 0.5) * 12;
      el.style.setProperty("--bg-parallax-x", `${px.toFixed(2)}px`);
      el.style.setProperty("--bg-parallax-y", `${py.toFixed(2)}px`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reduceMotion]);

  const navigateTo = (nextView: View) => {
    if (nextView === "home") {
      window.history.pushState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
      setView("home");
      return;
    }

    window.location.hash = nextView;
  };

  const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    navigateTo("home");
  };
  const isProjects = view === "projects";

  return (
    <div
      id="top"
      className={
        isProjects
          ? "relative flex h-dvh max-h-dvh min-h-0 flex-col overflow-x-clip overflow-y-hidden bg-zinc-50 text-zinc-900 dark:bg-[#05071a] dark:text-zinc-50"
          : "relative flex min-h-dvh flex-col overflow-x-clip bg-zinc-50 text-zinc-900 dark:bg-[#05071a] dark:text-zinc-50"
      }
    >
      <div
        ref={backgroundFxRef}
        aria-hidden
        className="about-bg-motion pointer-events-none fixed inset-0 z-0 hidden overflow-hidden dark:block"
      >
        <Image
          src="/starry-night.avif"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="about-bg-layer about-bg-layer--one" />
        <div className="about-bg-layer about-bg-layer--two" />
        <div className="absolute inset-0 bg-linear-to-b from-[#05071a]/40 via-[#05071a]/20 to-[#05071a]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_40%,transparent_0%,rgba(5,7,26,0.55)_100%)]" />
        <ShootingStars disabled={!!reduceMotion} />
      </div>

      <SideNav currentView={view} onNavigate={navigateTo} />

      <div className="fixed right-4 top-4 z-30">
        <LocaleSwitcher />
      </div>

      <main
        className={
          isProjects
            ? "relative z-10 flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden pb-0 md:pl-16 lg:pl-20"
            : "relative z-10 w-full flex-1 pb-24 md:pb-0 md:pl-16 lg:pl-20"
        }
      >
        <section
          className="flex min-h-0 flex-col items-center justify-center px-6 py-5 sm:py-6 md:py-7"
          aria-label="Introduction"
        >
          <a
            href={pathname}
            onClick={goHome}
            className="group block text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-[#05071a]"
          >
            <h1
              className={`font-bento-serif ${fontDisplay.className} text-center text-2xl font-bold leading-[1.05] tracking-tight transition-opacity group-hover:opacity-90 sm:text-3xl md:text-4xl lg:text-5xl`}
            >
              {SITE.name}
            </h1>
            <h2
              className={`${fontSans.className} mt-1.5 text-center text-xs font-normal text-zinc-600 dark:text-zinc-400 sm:text-sm md:text-base`}
            >
              {tHero("headline")}
            </h2>
          </a>
        </section>

        <div className="contents">
        <AnimatePresence mode="wait" initial={false}>
          {view === "about" ? (
            <ViewPanel
              key="about"
              reduceMotion={!!reduceMotion}
              className="flex w-full min-w-0 flex-1 flex-col"
            >
              <AboutSection />
            </ViewPanel>
          ) : null}

          {view === "projects" ? (
            <ViewPanel
              key="projects"
              reduceMotion={!!reduceMotion}
              className="flex w-full min-w-0 min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div
                className="project-details-container flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-hidden pl-6 pr-0 pt-0 pb-1"
                role="region"
                aria-label={tProjects("title")}
              >
                <ProjectsStack reduceMotion={!!reduceMotion} />
              </div>
            </ViewPanel>
          ) : null}

          {view === "experience" ? (
            <ViewPanel key="experience" reduceMotion={!!reduceMotion}>
              <ExperienceSection />
            </ViewPanel>
          ) : null}

          {view === "contact" ? (
            <ViewPanel key="contact" reduceMotion={!!reduceMotion}>
              <Container className="py-8 sm:py-10 md:py-12">
                <Block>
                  <h2
                    className={`font-bento-serif ${fontDisplay.className} text-2xl font-bold tracking-tight sm:text-3xl`}
                  >
                    {tContact("title")}
                  </h2>
                  <p
                    className={`${fontSans.className} mt-2 max-w-2xl text-sm font-normal text-zinc-500 dark:text-zinc-400 sm:text-base`}
                  >
                    {tContact("subtitle")}
                  </p>
                  <p
                    className={`${fontSans.className} mt-4 max-w-2xl text-sm font-normal leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base`}
                  >
                    {tContact("fastest")}
                  </p>

                  <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                    <li>
                      <ContactLink
                        href={`mailto:${SITE.email}`}
                        label="Email"
                        value={SITE.email}
                      />
                    </li>
                    <li>
                      <ContactLink
                        href={SITE.links.github}
                        label="GitHub"
                        value="@Nikolaj-Hvitfeldt"
                        external
                      />
                    </li>
                    <li>
                      <ContactLink
                        href={SITE.links.linkedin}
                        label="LinkedIn"
                        value="nikolaj-hvitfeldt"
                        external
                      />
                    </li>
                  </ul>
                </Block>
              </Container>
            </ViewPanel>
          ) : null}

          {view === "home" ? (
            <ViewPanel key="home" reduceMotion={!!reduceMotion}>
              <Container
                maxWidthClass="max-w-6xl"
                className="mt-2 pt-0 pb-8 sm:mt-4 sm:pb-10 md:mt-6 md:pb-12"
              >
                <div className="grid min-h-0 gap-3 md:grid-cols-3 md:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
                  <HomeBentoStack reduceMotion={!!reduceMotion}>
                    <HomeTile
                      icon={<UserOutlineIcon className="h-10 w-10 sm:h-11 sm:w-11" />}
                      title={tAbout("title")}
                      subtitle={tAbout("subtitle")}
                      onClick={() => navigateTo("about")}
                      className="h-full min-h-0 w-full"
                    />
                    <HomeTile
                      icon={<BriefcaseOutlineIcon className="h-10 w-10 sm:h-11 sm:w-11" />}
                      title={tWork("title")}
                      subtitle={tWork("subtitle")}
                      onClick={() => navigateTo("experience")}
                      className="h-full min-h-0 w-full"
                    />
                  </HomeBentoStack>

                  <Block
                    variant="bento"
                    onClick={() => navigateTo("projects")}
                    className="home-card-shell group/projects h-full min-h-[clamp(18rem,36vh,26rem)] md:col-start-2 md:row-span-2 md:row-start-1"
                  >
                    <div className="flex h-full flex-col gap-6">
                      <div className="-mx-5 -mt-5 flex min-h-0 flex-1 items-center overflow-hidden rounded-t-2xl px-2 py-7 sm:-mx-6 sm:-mt-6 sm:py-9">
                        <ProjectCarousel projects={PROJECTS} />
                      </div>
                      <div className="home-card-content mt-auto flex flex-col items-start gap-3 px-1">
                        <FolderOutlineIcon className="h-10 w-10 origin-top-left transform-gpu text-zinc-500 transition-all duration-500 ease-out will-change-transform motion-reduce:transition-none dark:text-zinc-300 dark:group-hover/projects:text-[#ffe8d1] group-hover/projects:-translate-x-1 group-hover/projects:-translate-y-1 group-hover/projects:scale-90 sm:h-11 sm:w-11" />
                        <div>
                          <h2
                            className={`font-bento-serif ${fontDisplay.className} text-xl font-bold tracking-tight text-zinc-900 transition-colors duration-300 dark:text-white dark:group-hover/projects:text-[#fff1e2]`}
                          >
                            {tProjects("title")}
                          </h2>
                          <p
                            className={`${fontSans.className} mt-1 text-sm font-normal text-zinc-500 dark:text-zinc-400 dark:group-hover/projects:text-zinc-300`}
                          >
                            {tProjects("subtitle")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Block>

                  <Block
                    variant="bento"
                    onClick={() => navigateTo("contact")}
                    className="home-card-shell group/contact h-full min-h-[clamp(18rem,36vh,26rem)] min-w-0 md:col-start-3 md:row-span-2 md:row-start-1"
                  >
                    <div className="flex h-full min-h-0 min-w-0 flex-col gap-5 overflow-hidden">
                      <ContactCardBubbles reduceMotion={!!reduceMotion} />
                      <div className="home-card-content flex flex-col items-start gap-3 px-1">
                        <SendOutlineIcon className="h-10 w-10 origin-top-left transform-gpu text-zinc-500 transition-all duration-500 ease-out will-change-transform motion-reduce:transition-none dark:text-zinc-300 dark:group-hover/contact:text-[#ffe8d1] group-hover/contact:-translate-x-1 group-hover/contact:-translate-y-1 group-hover/contact:scale-90 sm:h-11 sm:w-11" />
                        <div>
                          <h2
                            className={`font-bento-serif ${fontDisplay.className} text-xl font-bold tracking-tight text-zinc-900 transition-colors duration-300 dark:text-white dark:group-hover/contact:text-[#fff1e2]`}
                          >
                            {tContact("title")}
                          </h2>
                          <p
                            className={`${fontSans.className} mt-1 text-sm font-normal text-zinc-500 dark:text-zinc-400 dark:group-hover/contact:text-zinc-300`}
                          >
                            {tContact("subtitle")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Block>
                </div>
              </Container>
            </ViewPanel>
          ) : null}
        </AnimatePresence>
        </div>
      </main>

      <div
        className={
          view === "projects" ? "relative z-10 shrink-0" : "relative z-10"
        }
      >
        <SiteFooter compact={view === "projects"} />
      </div>
    </div>
  );
}

function ViewPanel({
  children,
  reduceMotion,
  className,
}: {
  children: ReactNode;
  reduceMotion: boolean;
  className?: string;
}) {
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HomeTile({
  icon,
  title,
  subtitle,
  onClick,
  className,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Block
      variant="bentoAvatar"
      onClick={onClick}
      className={`home-card-shell group/tile min-h-0 ${className ?? ""}`}
    >
      <div className="home-card-content flex h-full flex-col">
        <div className="origin-top-left transform-gpu text-zinc-500 transition-all duration-500 ease-out will-change-transform motion-reduce:transition-none dark:text-zinc-300 dark:group-hover/tile:text-[#ffe8d1] group-hover/tile:-translate-x-1 group-hover/tile:-translate-y-1 group-hover/tile:scale-90">
          {icon}
        </div>
        <div className="mt-auto pt-6">
          <h2
            className={`font-bento-serif ${fontDisplay.className} text-xl font-bold tracking-tight text-zinc-900 transition-colors duration-300 dark:text-white dark:group-hover/tile:text-white dark:group-hover/tile:text-[#fff1e2]`}
          >
            {title}
          </h2>
          <p
            className={`${fontSans.className} mt-1 text-sm font-normal text-zinc-500 transition-colors duration-300 dark:text-zinc-400 dark:group-hover/tile:text-zinc-300`}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </Block>
  );
}

function FolderOutlineIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function UserOutlineIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BriefcaseOutlineIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function SendOutlineIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </svg>
  );
}

function ContactLink({
  href,
  label,
  value,
  external = false,
}: {
  href: string;
  label: string;
  value: string;
  external?: boolean;
}) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};

  return (
    <a
      href={href}
      {...externalProps}
      className="group/contact flex items-center justify-between rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-sm transition-colors hover:bg-white/70 dark:border-white/10 dark:bg-white/3 dark:hover:bg-white/[0.07]"
    >
      <span>
        <span className="block text-xs text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
        <span className="mt-0.5 block font-medium">{value}</span>
      </span>
      <span
        aria-hidden
        className="text-zinc-400 transition-transform duration-200 group-hover/contact:translate-x-0.5 dark:text-zinc-500"
      >
        →
      </span>
    </a>
  );
}
