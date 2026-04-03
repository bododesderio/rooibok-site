import type { Metadata } from "next";
import { getContentBlock } from "@/server/queries/content";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the talented people behind Rooibok Technologies.",
};
import { getTeamMembers } from "@/server/queries/team";
import { PageHero } from "@/components/shared/page-hero";
import { FadeIn } from "@/components/effects/fade-in";
import { Linkedin, Twitter, Github, Instagram } from "lucide-react";

type SocialLinks = {
  linkedin?: string;
  x?: string;
  github?: string;
  instagram?: string;
};

const SOCIAL_ICONS = [
  { key: "linkedin" as const, icon: Linkedin, label: "LinkedIn" },
  { key: "x" as const, icon: Twitter, label: "X" },
  { key: "github" as const, icon: Github, label: "GitHub" },
  { key: "instagram" as const, icon: Instagram, label: "Instagram" },
];

export default async function TeamPage() {
  const [heroHeadline, heroSubheadline] = await Promise.all([
    getContentBlock("about.team.hero.headline", "Meet the Team"),
    getContentBlock(
      "about.team.hero.subheadline",
      "The talented people building the future at Rooibok Technologies."
    ),
  ]);

  const teamMembers = await getTeamMembers();

  return (
    <div>
      <PageHero title={heroHeadline} subtitle={heroSubheadline} />

      {/* ── Team Grid ────────────────────────────────────── */}
      <section className="border-t border-[var(--border)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {teamMembers.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, i) => {
                const socials = (member.socialLinks as SocialLinks) ?? {};
                return (
                  <FadeIn key={member.id} delay={i * 0.1}>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
                      {/* Photo or placeholder */}
                      <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-[var(--surface-raised)]">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--foreground-muted)]">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-[var(--accent)]">
                        {member.role}
                      </p>

                      {member.bio && (
                        <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">
                          {member.bio}
                        </p>
                      )}

                      {/* Social links */}
                      {Object.values(socials).some(Boolean) && (
                        <div className="mt-4 flex items-center justify-center gap-3">
                          {SOCIAL_ICONS.map(({ key, icon: Icon, label }) => {
                            const url = socials[key];
                            if (!url) return null;
                            return (
                              <a
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.name} on ${label}`}
                                className="text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent)]"
                              >
                                <Icon className="h-4 w-4" />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          ) : (
            <FadeIn>
              <p className="text-center text-[var(--foreground-muted)]">
                Team information coming soon.
              </p>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
