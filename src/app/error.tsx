"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-[var(--destructive)]">500</p>
        <h1 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
          Something went wrong
        </h1>
        <p className="mt-2 text-[var(--foreground-muted)]">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
