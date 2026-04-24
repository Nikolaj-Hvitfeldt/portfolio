import type { ReactNode } from "react";

type BlockProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** `bento` = home grid blend; `default` = standard glass (sections, etc.). */
  variant?: "default" | "bento";
};

export function Block({
  children,
  className,
  onClick,
  variant = "default",
}: BlockProps) {
  const extra = className ? ` ${className}` : "";
  const surface =
    variant === "bento" ? "surface-glass-bento" : "surface-glass";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${surface} surface-glass-hover block w-full p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 motion-reduce:transition-none sm:p-6 dark:focus-visible:ring-zinc-500${extra}`}
      >
        {children}
      </button>
    );
  }

  return (
    <section className={`${surface} p-6 sm:p-8${extra}`}>{children}</section>
  );
}
