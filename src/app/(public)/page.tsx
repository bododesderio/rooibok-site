import { getContentBlock, getContentGroup } from "@/server/queries/content";

export default async function HomePage() {
  const [headline, subheadline, ctaPrimaryText, ctaSecondaryText] =
    await Promise.all([
      getContentBlock("home.hero.headline", "We Build What's Next"),
      getContentBlock(
        "home.hero.subheadline",
        "Innovative software solutions crafted in Lira, Uganda — for the world."
      ),
      getContentBlock("home.hero.cta_primary", "Start a Project"),
      getContentBlock("home.hero.cta_secondary", "See Our Work"),
    ]);

  const valueProps = await getContentGroup("home.value_props");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-[var(--accent)] opacity-10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[var(--highlight)] opacity-10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="bg-gradient-to-r from-[var(--accent)] via-[var(--highlight)] to-[var(--info)] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            {headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--foreground-muted)]">
            {subheadline}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="inline-flex rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-[var(--accent)]/25"
            >
              {ctaPrimaryText}
            </a>
            <a
              href="/portfolio"
              className="inline-flex rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
            >
              {ctaSecondaryText}
            </a>
          </div>
        </div>
      </section>

      {/* Value Props */}
      {valueProps.length > 0 && (
        <section className="border-t border-[var(--border)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {valueProps.map((block) => {
                const data = block.content as {
                  title?: string;
                  description?: string;
                  icon?: string;
                };
                return (
                  <div
                    key={block.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-colors hover:border-[var(--accent)]"
                  >
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      {data.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                      {data.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
