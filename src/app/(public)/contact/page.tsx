import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { FadeIn } from "@/components/effects/fade-in";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Rooibok Technologies. Let's discuss your next project.",
};
import { getContentBlock } from "@/server/queries/content";
import { getSiteSettings, getSocialLinks } from "@/server/queries/settings";
import { getPublishedServices } from "@/server/queries/services";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52V6.69h-1z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  x: Twitter,
  tiktok: TikTokIcon,
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  tiktok: "TikTok",
};

export default async function ContactPage() {
  const [headline, subheadline, hours, successMessage, settings, socialLinks, services] =
    await Promise.all([
      getContentBlock("contact.hero.headline", "Let's Talk"),
      getContentBlock(
        "contact.hero.subheadline",
        "Have a project in mind? We'd love to hear about it. Reach out and let's build something great together."
      ),
      getContentBlock("contact.hours", "Mon - Fri: 9:00 AM - 5:00 PM EAT"),
      getContentBlock(
        "contact.success",
        "Thank you for reaching out! We'll get back to you within 1-2 business days."
      ),
      getSiteSettings(),
      getSocialLinks(),
      getPublishedServices(),
    ]);

  const serviceOptions = services.map((s) => ({
    value: s.slug,
    label: s.name,
  }));

  const socialEntries = Object.entries(socialLinks).filter(
    ([, url]) => url && url.trim() !== ""
  );

  return (
    <div>
      <PageHero title={headline} subtitle={subheadline} />

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* ── Contact Form (Left) ───────────────────────── */}
            <div className="lg:col-span-3">
              <FadeIn>
                <ContactForm
                  services={serviceOptions}
                  successMessage={successMessage}
                />
              </FadeIn>
            </div>

            {/* ── Contact Info (Right) ──────────────────────── */}
            <div className="lg:col-span-2">
              <FadeIn delay={0.15}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    Contact Information
                  </h2>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                    Prefer to reach out directly? Here&apos;s how to find us.
                  </p>

                  <div className="mt-8 space-y-6">
                    {settings?.email && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                          <Mail className="h-4 w-4 text-[var(--accent)]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            Email
                          </p>
                          <a
                            href={`mailto:${settings.email}`}
                            className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent)]"
                          >
                            {settings.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {settings?.phone && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                          <Phone className="h-4 w-4 text-[var(--accent)]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            Phone
                          </p>
                          <a
                            href={`tel:${settings.phone}`}
                            className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent)]"
                          >
                            {settings.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {settings?.address && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                          <MapPin className="h-4 w-4 text-[var(--accent)]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            Address
                          </p>
                          <p className="text-sm text-[var(--foreground-muted)]">
                            {settings.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {hours && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                          <Clock className="h-4 w-4 text-[var(--accent)]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            Working Hours
                          </p>
                          <p className="text-sm text-[var(--foreground-muted)]">
                            {hours}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Social Links ──────────────────────────── */}
                  {socialEntries.length > 0 && (
                    <div className="mt-8 border-t border-[var(--border)] pt-6">
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        Follow Us
                      </p>
                      <div className="mt-3 flex gap-3">
                        {socialEntries.map(([platform, url]) => {
                          const Icon = SOCIAL_ICONS[platform];
                          if (!Icon) return null;
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={SOCIAL_LABELS[platform] ?? platform}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            >
                              <Icon className="h-4 w-4" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
