import type { ReactNode } from "react";

export function Block({
  children,
  className,
  id,
  href,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  href?: string;
}) {
  const sectionClasses = `rounded-2xl border border-black/10 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-zinc-950 ${className ?? ""}`;
  const linkClasses = `rounded-xl border border-black/15 bg-zinc-50/60 p-5 sm:p-6 dark:border-white/15 dark:bg-zinc-900/30 ${className ?? ""}`;

  if (href) {
    return (
      <a
        id={id}
        href={href}
        className={`block transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 motion-reduce:transition-none hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60 dark:focus-visible:ring-zinc-500 ${linkClasses}`}
      >
        {children}
      </a>
    );
  }

  return (
    <section id={id} className={sectionClasses}>
      {children}
    </section>
  );
}
