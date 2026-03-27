"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { NAV_LINKS } from "@/lib/constants";

type NavConfig = {
  ctaText: string;
  ctaLink: string;
} | null;

export function Navbar({ navConfig }: { navConfig: NavConfig }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const ctaText = navConfig?.ctaText || "Get in Touch";
  const ctaLink = navConfig?.ctaLink || "/contact";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--highlight)] bg-clip-text text-xl font-bold text-transparent">
            Rooibok
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) =>
            "children" in link && link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface)]",
                    pathname.startsWith(link.href)
                      ? "text-[var(--foreground)]"
                      : "text-[var(--foreground-muted)]"
                  )}
                >
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {openDropdown === link.label && (
                  <div className="absolute left-0 top-full pt-1">
                    <div className="min-w-[180px] rounded-lg border border-[var(--border)] bg-[var(--card)] p-1 shadow-lg">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--surface)]",
                            pathname === child.href
                              ? "text-[var(--foreground)] font-medium"
                              : "text-[var(--foreground-muted)]"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface)]",
                  pathname === link.href
                    ? "text-[var(--foreground)]"
                    : "text-[var(--foreground-muted)]"
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={ctaLink}
            className="hidden rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)] md:inline-flex"
          >
            {ctaText}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface)] md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] md:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) =>
              "children" in link && link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-lg px-3 py-2 pl-6 text-sm transition-colors hover:bg-[var(--surface)]",
                        pathname === child.href
                          ? "text-[var(--foreground)] font-medium"
                          : "text-[var(--foreground-muted)]"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface)]",
                    pathname === link.href
                      ? "text-[var(--foreground)]"
                      : "text-[var(--foreground-muted)]"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href={ctaLink}
              onClick={() => setMobileOpen(false)}
              className="mt-2 block rounded-lg bg-[var(--accent)] px-4 py-2.5 text-center text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
