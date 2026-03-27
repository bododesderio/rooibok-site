export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
      <p className="mt-2 text-[var(--foreground-muted)]">
        Welcome to the Rooibok admin dashboard.
      </p>

      {/* Stat cards — will be populated with real data later */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Blog Posts", value: "—" },
          { label: "Open Jobs", value: "—" },
          { label: "Applications", value: "—" },
          { label: "Inquiries", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              {stat.label}
            </p>
            <p className="mt-1 text-3xl font-bold text-[var(--foreground)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
