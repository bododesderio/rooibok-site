import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Briefcase,
  Users,
  Mail,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboard() {
  const [postCount, projectCount, jobCount, unreadInquiries, recentInquiries, recentApplications] =
    await Promise.all([
      db.post.count({ where: { published: true } }),
      db.project.count({ where: { published: true } }),
      db.job.count({ where: { published: true, closedAt: null } }),
      db.inquiry.count({ where: { read: false } }),
      db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.application.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { job: { select: { title: true } } },
      }),
    ]);

  const stats = [
    { label: "Blog Posts", value: postCount, icon: FileText, href: "/admin/blog" },
    { label: "Projects", value: projectCount, icon: Briefcase, href: "/admin/portfolio" },
    { label: "Open Jobs", value: jobCount, icon: Users, href: "/admin/careers" },
    { label: "Unread Inquiries", value: unreadInquiries, icon: Mail, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
      <p className="mt-1 text-[var(--foreground-muted)]">
        Overview of your site content and activity.
      </p>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-[var(--foreground-muted)]" />
              <ArrowRight className="h-4 w-4 text-[var(--foreground-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-3 text-3xl font-bold text-[var(--foreground)]">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Recent Inquiries */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-semibold text-[var(--foreground)]">
              Recent Inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentInquiries.length === 0 ? (
              <p className="px-5 py-6 text-sm text-[var(--foreground-muted)]">
                No inquiries yet.
              </p>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {inq.fullName}
                    </p>
                    {!inq.read && (
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {inq.email} &middot; {formatDate(inq.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-semibold text-[var(--foreground)]">
              Recent Applications
            </h2>
            <Link
              href="/admin/careers"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentApplications.length === 0 ? (
              <p className="px-5 py-6 text-sm text-[var(--foreground-muted)]">
                No applications yet.
              </p>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="px-5 py-3">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {app.fullName}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {app.job.title} &middot; {app.status} &middot;{" "}
                    {formatDate(app.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
