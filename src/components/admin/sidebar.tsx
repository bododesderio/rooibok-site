"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Wrench,
  Users,
  Mail,
  UserCircle,
  Blocks,
  MessageSquare,
  Scale,
  Image,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  FileText,
  Briefcase,
  Wrench,
  Users,
  Mail,
  UserCircle,
  Blocks,
  MessageSquare,
  Scale,
  Image,
  Settings,
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Blog", href: "/admin/blog", icon: "FileText" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "Briefcase" },
  { label: "Services", href: "/admin/services", icon: "Wrench" },
  { label: "Careers", href: "/admin/careers", icon: "Users" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "Mail" },
  { label: "Team", href: "/admin/team", icon: "UserCircle" },
  { label: "Content", href: "/admin/content", icon: "Blocks" },
  { label: "Popups", href: "/admin/popups", icon: "MessageSquare" },
  { label: "Legal", href: "/admin/legal", icon: "Scale" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

type AdminSidebarProps = {
  userName: string;
  userRole: string;
};

export function AdminSidebar({ userName, userRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-[var(--sidebar-border)] px-4">
        {!collapsed && (
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--highlight)] bg-clip-text text-lg font-bold text-transparent">
            Rooibok
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const Icon = icons[item.icon];
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--accent)]/10 text-[var(--foreground)]"
                  : "text-[var(--foreground-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              )}
              title={collapsed ? item.label : undefined}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / user */}
      <div className="border-t border-[var(--sidebar-border)] p-3">
        {!collapsed && (
          <div className="mb-2 px-3">
            <p className="truncate text-sm font-medium text-[var(--foreground)]">
              {userName}
            </p>
            <p className="text-xs text-[var(--foreground-muted)]">
              {userRole}
            </p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
