"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AboutSection } from "@/components/AboutSection";
import { Block } from "@/components/Block";
import { Container } from "@/components/Container";
import { ExperienceSection } from "@/components/ExperienceSection";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { ShootingStars } from "@/components/ShootingStars";
import { SideNav, type View } from "@/components/SideNav";
import { SiteFooter } from "@/components/SiteFooter";
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
  const tHero = useTranslations("Hero");
  const tProjects = useTranslations("Projects");
  const tProject = useTranslations("Project");
  const tAbout = useTranslations("About");
  const tWork = useTranslations("WorkExperience");
  const tContact = useTranslations("Contact");

  const [view, setView] = useState<View>("home");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onHashChange = () => setView(parseHash(window.location.hash));
    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

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

  return (
    <div
      id="top"
      className="relative flex min-h-screen flex-col overflow-x-hidden bg-zinc-50 text-zinc-900 dark:bg-[#05071a] dark:text-zinc-50"
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden dark:block"
      >
        <Image
          src="/starry-night.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#05071a]/40 via-[#05071a]/20 to-[#05071a]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_40%,transparent_0%,rgba(5,7,26,0.55)_100%)]" />
        <ShootingStars disabled={!!reduceMotion} />
      </div>

      <SideNav currentView={view} onNavigate={navigateTo} />

      <div className="fixed right-4 top-4 z-30">
        <LocaleSwitcher />
      </div>

      <main className="relative z-10 flex-1 pb-24 md:pb-0 md:pl-16 lg:pl-20">
        <section
          className="flex min-h-0 flex-col items-center justify-center px-6 py-12 sm:py-16 md:py-20"
          aria-label="Introduction"
        >
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            {tHero("eyebrow")}
          </span>
          <h1 className="mt-4 text-center text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {SITE.name}
          </h1>
          <h2 className="mt-3 text-center text-lg text-zinc-500 dark:text-zinc-400 sm:text-xl md:text-2xl">
            {tHero("headline")}
          </h2>
          <p className="mt-5 max-w-xl text-center text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
            {tHero("summary")}
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]"
              aria-hidden
            />
            {tHero("availability", { location: SITE.location })}
          </p>
        </section>

        <AnimatePresence mode="wait" initial={false}>
          {view === "about" ? (
            <ViewPanel key="about" reduceMotion={!!reduceMotion}>
              <AboutSection />
            </ViewPanel>
          ) : null}

          {view === "projects" ? (
            <ViewPanel key="projects" reduceMotion={!!reduceMotion}>
              <Container className="space-y-6 py-8 sm:py-10 md:py-12">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {tProjects("title")}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
                    {tProjects("subtitle")}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {PROJECTS.map((project) => (
                    <ProjectCard
                      key={project.id}
                      title={tProject(`${project.id}.title`)}
                      description={tProject(`${project.id}.description`)}
                      href={project.href}
                      tags={project.tags}
                      icon={project.icon}
                      viewLabel={tProjects("source")}
                    />
                  ))}
                </div>
              </Container>
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
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {tContact("title")}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
                    {tContact("subtitle")}
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
                    {tContact("fastest")}
                  </p>

                  <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                    <li>
                      <a
                        href={`mailto:${SITE.email}`}
                        className="group/contact flex items-center justify-between rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-sm transition-colors hover:bg-white/70 dark:border-white/10 dark:bg-white/3 dark:hover:bg-white/[0.07]"
                      >
                        <span>
                          <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                            Email
                          </span>
                          <span className="mt-0.5 block font-medium">
                            {SITE.email}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="text-zinc-400 transition-transform duration-200 group-hover/contact:translate-x-0.5 dark:text-zinc-500"
                        >
                          →
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={SITE.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/contact flex items-center justify-between rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-sm transition-colors hover:bg-white/70 dark:border-white/10 dark:bg-white/3 dark:hover:bg-white/[0.07]"
                      >
                        <span>
                          <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                            GitHub
                          </span>
                          <span className="mt-0.5 block font-medium">
                            @Nikolaj-Hvitfeldt
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="text-zinc-400 transition-transform duration-200 group-hover/contact:translate-x-0.5 dark:text-zinc-500"
                        >
                          →
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={SITE.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/contact flex items-center justify-between rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-sm transition-colors hover:bg-white/70 dark:border-white/10 dark:bg-white/3 dark:hover:bg-white/[0.07]"
                      >
                        <span>
                          <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                            LinkedIn
                          </span>
                          <span className="mt-0.5 block font-medium">
                            nikolaj-hvitfeldt
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="text-zinc-400 transition-transform duration-200 group-hover/contact:translate-x-0.5 dark:text-zinc-500"
                        >
                          →
                        </span>
                      </a>
                    </li>
                  </ul>
                </Block>
              </Container>
            </ViewPanel>
          ) : null}

          {view === "home" ? (
            <ViewPanel key="home" reduceMotion={!!reduceMotion}>
              <Container className="py-8 sm:py-10 md:py-12">
                <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2 md:auto-rows-fr">
                  <HomeTile
                    index="01"
                    title={tAbout("title")}
                    subtitle={tAbout("subtitle")}
                    onClick={() => navigateTo("about")}
                    className="md:col-start-1 md:row-start-1"
                  />

                  <HomeTile
                    index="02"
                    title={tWork("title")}
                    subtitle={tWork("subtitle")}
                    onClick={() => navigateTo("experience")}
                    className="md:col-start-1 md:row-start-2"
                  />

                  <Block
                    onClick={() => navigateTo("projects")}
                    className="flex flex-col gap-3 md:col-start-2 md:row-span-2 md:row-start-1"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                          03
                        </span>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight">
                          {tProjects("title")}
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {tProjects("subtitle")}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="text-zinc-400 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-zinc-500"
                      >
                        →
                      </span>
                    </div>
                    <div className="mt-auto">
                      <ProjectCarousel projects={PROJECTS} />
                    </div>
                  </Block>

                  <HomeTile
                    index="04"
                    title={tContact("title")}
                    subtitle={tContact("subtitle")}
                    onClick={() => navigateTo("contact")}
                    className="md:col-start-3 md:row-span-2 md:row-start-1"
                  />
                </div>
              </Container>
            </ViewPanel>
          ) : null}
        </AnimatePresence>
      </main>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}

function ViewPanel({
  children,
  reduceMotion,
}: {
  children: ReactNode;
  reduceMotion: boolean;
}) {
  if (reduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HomeTile({
  index,
  title,
  subtitle,
  onClick,
  className,
}: {
  index: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Block onClick={onClick} className={`group/tile h-full ${className ?? ""}`}>
      <div className="flex h-full flex-col">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          {index}
        </span>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
        <span
          aria-hidden
          className="mt-auto pt-3 text-zinc-400 transition-transform duration-300 group-hover/tile:translate-x-0.5 dark:text-zinc-500"
        >
          →
        </span>
      </div>
    </Block>
  );
}
