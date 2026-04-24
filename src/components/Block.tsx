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
  const sectionClasses = `surface-glass p-6 sm:p-8 ${className ?? ""}`;
  const interactiveClasses = `surface-glass surface-glass-hover p-5 sm:p-6 ${className ?? ""}`;
  const focusClasses =
    "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 motion-reduce:transition-none dark:focus-visible:ring-zinc-500";

  if (href) {
    return (
      <a id={id} href={href} className={`${focusClasses} ${interactiveClasses}`}>
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
        className={`${focusClasses} w-full text-left ${interactiveClasses}`}
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
