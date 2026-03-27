import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";
import type { SocialLinks, FooterConfig } from "@/server/queries/settings";

// TikTok doesn't have a lucide icon, so we use a simple SVG
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1V9.01a6.27 6.27 0 0 0-.8-.05 6.34 6.34 0 0 0 0 12.68 6.34 6.34 0 0 0 6.33-6.34V8.73a8.19 8.19 0 0 0 3.77.92V6.69Z" />
    </svg>
  );
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> =
  {
    instagram: Instagram,
    facebook: Facebook,
    linkedin: Linkedin,
    x: Twitter,
    tiktok: TikTokIcon,
  };

type FooterProps = {
  companyName: string;
  tagline: string;
  socialLinks: SocialLinks;
  footerConfig: FooterConfig | null;
};

export function Footer({
  companyName,
  tagline,
  socialLinks,
  footerConfig,
}: FooterProps) {
  const columns = footerConfig?.columns ?? [];
  const copyright =
    footerConfig?.copyright ??
    `${new Date().getFullYear()} ${companyName}. All rights reserved.`;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--highlight)] bg-clip-text text-xl font-bold text-transparent">
                Rooibok
              </span>
            </Link>
            {tagline && (
              <p className="mt-3 text-sm text-[var(--foreground-muted)]">
                {tagline}
              </p>
            )}

            {/* Social icons */}
            <div className="mt-4 flex gap-3">
              {Object.entries(socialLinks).map(([platform, url]) => {
                if (!url) return null;
                const Icon = socialIcons[platform];
                if (!Icon) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]"
                    aria-label={platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic columns from DB */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {col.heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.url}
                      className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row">
          <p className="text-xs text-[var(--foreground-muted)]">
            &copy; {copyright}
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-xs text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
