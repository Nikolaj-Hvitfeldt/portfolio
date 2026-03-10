import type { ReactNode } from "react";

export function Block({
  children,
  className,
  id,
  href,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  href?: string;
  onClick?: () => void;
}) {
  const sectionClasses = `rounded-2xl border border-black/10 bg-white/70 p-6 shadow-[0_8px_20px_rgba(0,0,0,0.07)] backdrop-blur-xl ring-1 ring-inset ring-white/32 sm:p-8 dark:border-white/18 dark:bg-[radial-gradient(145%_145%_at_50%_52%,rgba(3,3,5,0.98)_0%,rgba(5,5,7,0.95)_52%,rgba(20,20,28,0.74)_82%,rgba(138,144,176,0.16)_100%)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.5)] dark:ring-white/9 ${className ?? ""}`;
  const linkClasses = `rounded-xl border border-black/10 bg-white/66 p-5 shadow-[0_8px_20px_rgba(0,0,0,0.07)] backdrop-blur-xl ring-1 ring-inset ring-white/32 sm:p-6 dark:border-white/18 dark:bg-[radial-gradient(145%_145%_at_50%_52%,rgba(3,3,5,0.98)_0%,rgba(5,5,7,0.95)_52%,rgba(20,20,28,0.74)_82%,rgba(138,144,176,0.16)_100%)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.5)] dark:ring-white/9 ${className ?? ""}`;

  if (href) {
    return (
      <a
        id={id}
        href={href}
        className={`block transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 motion-reduce:transition-none hover:bg-zinc-100/70 dark:hover:bg-white/5 dark:focus-visible:ring-zinc-500 ${linkClasses}`}
      >
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        id={id}
        type="button"
        onClick={onClick}
        className={`block w-full text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 motion-reduce:transition-none hover:bg-zinc-100/70 dark:hover:bg-white/5 dark:focus-visible:ring-zinc-500 ${linkClasses}`}
      >
        {children}
      </button>
    );
  }

  return (
    <section id={id} className={sectionClasses}>
      {children}
    </section>
  );
}
