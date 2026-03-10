import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Block } from "@/components/Block";
import { Container } from "@/components/Container";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { SiteFooter } from "@/components/SiteFooter";
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
  const tProjects = useTranslations("Projects");
  const tAbout = useTranslations("About");
  const tWork = useTranslations("WorkExperience");
  const tContact = useTranslations("Contact");

  return (
    <div
      id="top"
      className="min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50"
    >
      <main>
        <section
          className="flex min-h-0 flex-col items-center justify-center px-6 py-10 sm:py-12"
          aria-label="Introduction"
        >
          <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {SITE.name}
          </h1>
          <h2 className="mt-3 text-center text-lg text-zinc-500 dark:text-zinc-400 sm:text-xl md:text-2xl">
            {tHero("headline")}
          </h2>
        </section>

        <Container className="space-y-4 py-8 sm:space-y-5 sm:py-10 md:py-12">
          {/* Mobile: vertical flow. md+: horizontal bento layout */}
          <div className="flex flex-col gap-4 md:grid md:snap-x md:snap-mandatory md:auto-cols-[min(18rem,80vw)] md:grid-flow-col md:grid-rows-[8.5rem_8.5rem] md:overflow-x-auto md:pb-2 md:no-scrollbar">
            <div className="flex flex-col gap-4 md:contents">
              <Block href="#about" className="md:h-full md:snap-start">
                <h2 className="text-xl font-semibold tracking-tight">
                  {tAbout("title")}
                </h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {tAbout("subtitle")}
                </p>
              </Block>

              <Block href="#experience" className="md:h-full md:snap-start">
                <h2 className="text-xl font-semibold tracking-tight">
                  {tWork("title")}
                </h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {tWork("subtitle")}
                </p>
              </Block>
            </div>

            <Block href="#projects" className="md:h-full md:snap-start md:row-span-2">
              <h2 className="text-xl font-semibold tracking-tight">
                {tProjects("title")}
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {tProjects("subtitle")}
              </p>
              <div className="mt-4">
                <ProjectCarousel projects={PROJECTS} />
              </div>
            </Block>

            <Block href="#contact" className="md:h-full md:snap-start md:row-span-2">
              <h2 className="text-xl font-semibold tracking-tight">
                {tContact("title")}
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {tContact("subtitle")}
              </p>
            </Block>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
