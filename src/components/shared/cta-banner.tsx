import Link from "next/link";

type CtaBannerProps = {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
};

export function CtaBanner({
  title,
  subtitle,
  buttonText,
  buttonHref,
}: CtaBannerProps) {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[var(--foreground-muted)]">{subtitle}</p>
        )}
        <Link
          href={buttonHref}
          className="mt-6 inline-flex rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-[var(--accent)]/25"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
