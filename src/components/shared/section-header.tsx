type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
};

export function SectionHeader({
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[var(--foreground-muted)]">{subtitle}</p>
      )}
    </div>
  );
}
