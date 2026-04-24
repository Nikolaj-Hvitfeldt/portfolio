import type { ReactNode } from "react";

export function Container({
  children,
  className,
  maxWidthClass = "max-w-5xl",
}: {
  children: ReactNode;
  className?: string;
  /** Override default `max-w-5xl` (e.g. home bento grid). */
  maxWidthClass?: string;
}) {
  return (
    <div className={`mx-auto w-full ${maxWidthClass} px-6 ${className ?? ""}`}>
      {children}
    </div>
  );
}

