export function ProjectCard({
  title,
  description,
  href,
  tags,
}: {
  title: string;
  description: string;
  href: string;
  tags: readonly string[];
}) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold tracking-tight text-black dark:text-white">
          {title}
        </h3>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          View
        </a>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-black/10 bg-zinc-50 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-black dark:text-zinc-300"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}

