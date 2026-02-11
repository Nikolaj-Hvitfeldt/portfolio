import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PROJECTS } from "@/lib/projects";
import { SITE } from "@/lib/site";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const tHero = useTranslations("Hero");
  const tAbout = useTranslations("About");
  const tProjects = useTranslations("Projects");
  const tContact = useTranslations("Contact");
  const tProject = useTranslations("Project");

  return (
    <div
      id="top"
      className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50"
    >
      <SiteHeader />

      <main>
        <section className="py-16 md:py-24">
          <Container>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {SITE.location}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                {SITE.name} — {tHero("headline")}
              </h1>
              <p className="mt-5 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                {tHero("summary")}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  {tHero("ctaProjects")}
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
                >
                  {tHero("ctaEmail")}
                </a>
              </div>
            </div>
          </Container>
        </section>

        <section id="about" className="py-16">
          <Container>
            <SectionHeading
              title={tAbout("title")}
              subtitle={tAbout("subtitle")}
            />

            <div className="max-w-3xl space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              <p>{tAbout("p1")}</p>
              <p>{tAbout("p2")}</p>
            </div>
          </Container>
        </section>

        <section id="projects" className="py-16">
          <Container>
            <SectionHeading
              title={tProjects("title")}
              subtitle={tProjects("subtitle")}
            />

            <div className="grid gap-6 md:grid-cols-2">
              {PROJECTS.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={tProject(`${project.id}.title`)}
                  description={tProject(`${project.id}.description`)}
                  href={project.href}
                  tags={project.tags}
                />
              ))}
            </div>
          </Container>
        </section>

        <section id="contact" className="py-16">
          <Container>
            <SectionHeading
              title={tContact("title")}
              subtitle={tContact("subtitle")}
            />

            <div className="max-w-3xl rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-950">
              <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {tContact("fastest")}
              </p>
              <div className="mt-4">
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm font-medium underline underline-offset-4"
                >
                  {SITE.email}
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

