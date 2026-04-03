"use client";

type TocItem = {
  level: number;
  text: string;
  id: string;
};

type TableOfContentsProps = {
  items: TocItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h3 className="text-sm font-semibold text-[var(--foreground)]">
        Table of Contents
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className="block text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
