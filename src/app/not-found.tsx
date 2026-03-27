import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-[var(--accent)]">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
          Page not found
        </h1>
        <p className="mt-2 text-[var(--foreground-muted)]">
          Oops, this page doesn&apos;t exist. It might have been moved or
          deleted.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
