export function ProjectCard({
  title,
  description,
  href,
  tags,
  icon,
  viewLabel,
}: {
  title: string;
  description: string;
  href: string;
  tags: readonly string[];
  icon?: string;
  viewLabel: string;
}) {
  return (
    <article className="surface-glass group/project flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {icon ? (
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-xl dark:bg-white/5"
            >
              {icon}
            </span>
          ) : null}
          <h3 className="text-base font-semibold tracking-tight text-black dark:text-white">
            {title}
          </h3>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-zinc-700 transition-transform duration-200 hover:translate-x-0.5 hover:text-black motion-reduce:transition-none dark:text-zinc-300 dark:hover:text-white"
          aria-label={`${viewLabel}: ${title}`}
        >
          {viewLabel}
          <span aria-hidden>→</span>
        </a>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>

      <ul className="mt-auto flex flex-wrap gap-2 pt-4">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-black/10 bg-zinc-50/60 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
