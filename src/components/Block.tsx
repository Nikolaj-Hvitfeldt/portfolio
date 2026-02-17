import type { ReactNode } from "react";

export function Block({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950 ${className ?? ""}`}
    >
      {children}
    </section>
  );
}
