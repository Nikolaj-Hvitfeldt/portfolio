import Image from "next/image";

function TechLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[3px]"
    >
      <Image
        src={src}
        alt={alt}
        width={16}
        height={16}
        className="h-4 w-4 object-contain"
      />
    </span>
  );
}

function GenericTechIcon() {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-zinc-500"
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
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
      </svg>
    </span>
  );
}

const TAG_LOGOS: Record<string, { src: string; alt: string }> = {
  react: { src: "/tech-icons/react-logo.png", alt: "React" },
  nextjs: { src: "/tech-icons/nextjs-logo.svg", alt: "Next.js" },
  "next.js": { src: "/tech-icons/nextjs-logo.svg", alt: "Next.js" },
  "react native": { src: "/tech-icons/react-logo.png", alt: "React Native" },
  "react-native": { src: "/tech-icons/react-logo.png", alt: "React Native" },
  rn: { src: "/tech-icons/react-logo.png", alt: "React Native" },
  nodejs: { src: "/tech-icons/nodejs-logo.svg", alt: "Node.js" },
  "node.js": { src: "/tech-icons/nodejs-logo.svg", alt: "Node.js" },
  node: { src: "/tech-icons/nodejs-logo.svg", alt: "Node.js" },
  express: { src: "/tech-icons/expressjs-icon.svg", alt: "Express" },
  expressjs: { src: "/tech-icons/expressjs-icon.svg", alt: "Express" },
  vite: { src: "/tech-icons/vite-logo.svg", alt: "Vite" },
  ktor: { src: "/tech-icons/ktor-logo.svg", alt: "Ktor" },
  typescript: { src: "/tech-icons/typescript-logo.png", alt: "TypeScript" },
  ts: { src: "/tech-icons/typescript-logo.png", alt: "TypeScript" },
  tailwind: { src: "/tech-icons/tailwind-logo.png", alt: "Tailwind CSS" },
  postgresql: { src: "/tech-icons/postgresql-logo.png", alt: "PostgreSQL" },
  postgres: { src: "/tech-icons/postgresql-logo.png", alt: "PostgreSQL" },
  tanstack: { src: "/tech-icons/tanstack-logo.png", alt: "TanStack" },
  supabase: { src: "/tech-icons/supabase-logo.svg", alt: "Supabase" },
  "c#": { src: "/tech-icons/csharp-logo.png", alt: "C#" },
  csharp: { src: "/tech-icons/csharp-logo.png", alt: "C#" },
  ".net": { src: "/tech-icons/net-logo.png", alt: ".NET" },
  dotnet: { src: "/tech-icons/net-logo.png", alt: ".NET" },
  net: { src: "/tech-icons/net-logo.png", alt: ".NET" },
  signalr: { src: "/tech-icons/signalR-logo.jpeg", alt: "SignalR" },
  realtime: { src: "/tech-icons/realtime-logo.png", alt: "Realtime" },
  kotlin: { src: "/tech-icons/kotlin-logo.jpeg", alt: "Kotlin" },
  figma: { src: "/tech-icons/figma-logo.png", alt: "Figma" },
  vercel: { src: "/tech-icons/vercel-logo.png", alt: "Vercel" },
  expo: { src: "/tech-icons/expo-logo.png", alt: "Expo" },
  render: { src: "/tech-icons/render-logo.jpeg", alt: "Render" },
  zod: { src: "/tech-icons/zod-logo.png", alt: "Zod" },
  zustand: { src: "/tech-icons/zustand-logo.png", alt: "Zustand" },
  i18next: { src: "/tech-icons/i18next-icon.svg", alt: "i18next" },
  reanimated: { src: "/tech-icons/react-logo.png", alt: "Reanimated" },
  nestjs: { src: "/tech-icons/nestjs-logo.svg", alt: "NestJS" },
};

function normalizeKey(tag: string) {
  return tag.trim().toLowerCase();
}

/**
 * Small icon for tech tag labels; falls back to a generic code/chevron glyph.
 */
export function techTagIconForLabel(tag: string) {
  const key = normalizeKey(tag);
  const logo = TAG_LOGOS[key];
  if (logo) {
    return <TechLogo src={logo.src} alt={logo.alt} />;
  }
  return <GenericTechIcon />;
}
