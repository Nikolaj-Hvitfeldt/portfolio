"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { AboutIntroCard } from "@/components/about/AboutIntroCard";
import { AboutSpecsCard } from "@/components/about/AboutSpecsCard";
import { AboutTechStackCard } from "@/components/about/AboutTechStackCard";

export function AboutSection() {
  const t = useTranslations("About");
  const glassCard = "surface-glass p-6 sm:p-8";
  const reduceMotion = useReducedMotion();
  const cardReveal = reduceMotion
    ? {
        initial: false as const,
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
      };
  return (
    <section aria-label={t("title")} className="py-7 sm:py-9 md:py-11">
      <Container className="space-y-5 sm:space-y-6">
        <motion.div
          className={`${glassCard} relative overflow-hidden`}
          viewport={{ once: true, amount: 0.28 }}
          {...cardReveal}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-14 -top-18 h-44 w-44 rounded-full bg-amber-200/25 blur-3xl dark:bg-indigo-300/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 -bottom-16 h-36 w-36 rounded-full bg-sky-200/20 blur-3xl dark:bg-sky-300/15"
          />
          <AboutIntroCard />
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            className={glassCard}
            viewport={{ once: true, amount: 0.24 }}
            {...cardReveal}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.44, delay: 0.04, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <AboutSpecsCard />
          </motion.div>

          <motion.div
            className={glassCard}
            viewport={{ once: true, amount: 0.24 }}
            {...cardReveal}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.44, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <AboutTechStackCard />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
