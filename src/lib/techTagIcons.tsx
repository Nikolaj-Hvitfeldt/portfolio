import type { ReactNode } from "react";

function StrokeIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-zinc-700 dark:text-zinc-200"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
      >
        {children}
      </svg>
    </span>
  );
}

function FillIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-zinc-700 dark:text-zinc-200"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
        {children}
      </svg>
    </span>
  );
}

function ReactIcon() {
  return (
    <FillIcon>
      <path d="M12 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-1.6 3.6a7.2 7.2 0 01-1.1.5c-.9.3-1.4.3-1.7.1-.3-.2-.3-.8.1-1.6.2-.4.4-.7.6-1a6.8 6.8 0 015.2-3.2 6.8 6.8 0 01-3.1 5.2zm4.4-2.1a6.8 6.8 0 01.8 2.5c.2.8.1 1.4-.2 1.7-.3.3-.9.3-1.7 0a6.8 6.8 0 01-1.1-.5 6.8 6.8 0 01-3.1-5.2 6.8 6.8 0 015.2 3.2l.1.3zm2.2-2.2c.9.4 1.3.9 1.3 1.3s-.4.9-1.3 1.3a14 14 0 01-2 .6A14 14 0 0112 18a14 14 0 01-4.3-.7 14 14 0 01-2-.6c-.9-.4-1.3-.9-1.3-1.3s.4-.9 1.3-1.3a14 14 0 012-.6A14 14 0 0112 6a14 14 0 014.3.7c.7.2 1.4.5 2 .8z" />
    </FillIcon>
  );
}

function TypeScriptIcon() {
  return (
    <FillIcon>
      <path d="M3 3h18v18H3V3zm12.2 14.1V16c.6.3 1.2.5 1.9.5.5 0 .9-.1 1.2-.3.3-.2.4-.5.4-.9 0-.4-.1-.7-.4-.9-.3-.2-.8-.4-1.5-.6-.9-.3-1.5-.6-1.8-1-.3-.4-.5-.9-.5-1.5 0-.5.1-1 .4-1.3.3-.4.7-.7 1.2-.9.5-.2 1.1-.3 1.8-.3.6 0 1.1.1 1.6.3.4.2.8.4 1.1.7l-1.1 1.2c-.6-.4-1.2-.6-1.8-.6-.4 0-.7.1-.9.3-.2.2-.3.4-.3.7 0 .3.1.5.3.7.2.2.7.4 1.4.6.9.3 1.6.7 2 1.1.4.4.6 1 .6 1.7 0 .6-.2 1.1-.5 1.5-.4.4-.8.7-1.4.9-.6.2-1.3.3-2.1.3-1.3 0-2.4-.3-3.2-.9z" />
    </FillIcon>
  );
}

function TailwindIcon() {
  return (
    <StrokeIcon>
      <path d="M12 6c-2.8 0-4.5 1.4-5.3 4.1 1.1-1.3 2.3-1.8 3.8-1.5 1.6.4 2.8 1.4 4 2.6 1.4 1.3 2.9 2.5 5.1 2.1 2.7-.5 4.3-2 4.8-4.8-1.1 1.3-2.3 1.8-3.8 1.5-1.6-.4-2.8-1.4-4-2.6-1.5-1.4-3-2.6-5.6-2.3z" />
    </StrokeIcon>
  );
}

function PostgresIcon() {
  return (
    <StrokeIcon>
      <ellipse cx="12" cy="12" rx="8" ry="6" />
      <path d="M4 12c0 3 3.5 5 8 5s8-2 8-5" />
    </StrokeIcon>
  );
}

function CSharpIcon() {
  return (
    <StrokeIcon>
      <path d="M9.5 4.5L4.5 7.2v9.6l5 2.7 5-2.7V7.2l-5-2.7z" />
      <path d="M15.5 10.5h2M16.5 9.5v2M15.5 13.5h2M16.5 12.5v2" />
    </StrokeIcon>
  );
}

function DotnetIcon() {
  return (
    <FillIcon>
      <path d="M3 3h7.5v7.5H3V3zm10.5 0H21v7.5h-7.5V3zM3 13.5h7.5V21H3v-7.5zm10.5 0H21V21h-7.5v-7.5z" />
    </FillIcon>
  );
}

function SignalRIcon() {
  return (
    <StrokeIcon>
      <path d="M4 8h4v8H4zM10 4h4v16h-4zM16 10h4v4h-4z" />
    </StrokeIcon>
  );
}

function KotlinIcon() {
  return (
    <StrokeIcon>
      <path d="M3 21V3h7l5 6 6-6h0v18H3z" />
    </StrokeIcon>
  );
}

function SupabaseIcon() {
  return (
    <StrokeIcon>
      <path d="M12 3L3 8.5v7L12 21l9-5.5v-7L12 3z" />
      <path d="M12 3v9" />
    </StrokeIcon>
  );
}

function GenericCodeIcon() {
  return (
    <StrokeIcon>
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </StrokeIcon>
  );
}

const TAG_ICONS: Record<string, () => ReactNode> = {
  react: () => <ReactIcon />,
  typescript: () => <TypeScriptIcon />,
  tailwind: () => <TailwindIcon />,
  postgresql: () => <PostgresIcon />,
  postgres: () => <PostgresIcon />,
  "c#": () => <CSharpIcon />,
  csharp: () => <CSharpIcon />,
  ".net": () => <DotnetIcon />,
  dotnet: () => <DotnetIcon />,
  signalr: () => <SignalRIcon />,
  kotlin: () => <KotlinIcon />,
  tanstack: () => <GenericCodeIcon />,
  supabase: () => <SupabaseIcon />,
  realtime: () => <SignalRIcon />,
  pwa: () => <GenericCodeIcon />,
  wip: () => <GenericCodeIcon />,
  tbd: () => <GenericCodeIcon />,
};

function normalizeKey(tag: string) {
  return tag.trim().toLowerCase();
}

/**
 * Small icon for tech tag labels; falls back to a generic code/chevron glyph.
 */
export function techTagIconForLabel(tag: string) {
  const key = normalizeKey(tag);
  const fn = TAG_ICONS[key];
  if (fn) {
    return fn();
  }
  if (key.includes("tanstack")) {
    return <GenericCodeIcon />;
  }
  if (key.includes("tailwind")) {
    return <TailwindIcon />;
  }
  if (key.includes("react")) {
    return <ReactIcon />;
  }
  if (key.includes("typescript") || key === "ts") {
    return <TypeScriptIcon />;
  }
  if (key.includes("dotnet") || key.includes(".net") || key === "net") {
    return <DotnetIcon />;
  }
  return <GenericCodeIcon />;
}
