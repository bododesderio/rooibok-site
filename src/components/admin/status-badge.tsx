type StatusBadgeProps = {
  status: "published" | "draft" | "active" | "inactive" | "new" | "read";
};

const styles: Record<string, string> = {
  published:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  draft:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  read: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] ?? styles.draft}`}
    >
      {status}
    </span>
  );
}
