"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/effects/fade-in";
import { formatDate } from "@/lib/utils";

type Service = {
  id: string;
  slug: string;
  name: string;
};

type Project = {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  shortDescription: string;
  coverImage: string;
  techStack: string[];
  services: Service[];
  createdAt: Date;
};

type PortfolioFilterProps = {
  projects: Project[];
  services: Service[];
};

export function PortfolioFilter({ projects, services }: PortfolioFilterProps) {
  const [activeService, setActiveService] = useState<string | null>(null);

  const filtered = activeService
    ? projects.filter((p) =>
        p.services.some((s) => s.slug === activeService)
      )
    : projects;

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={() => setActiveService(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeService === null
              ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
              : "bg-[var(--surface)] text-[var(--foreground-muted)] hover:bg-[var(--surface-raised)]"
          }`}
        >
          All
        </button>
        {services.map((s) => (
          <button
            key={s.slug}
            onClick={() =>
              setActiveService(activeService === s.slug ? null : s.slug)
            }
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeService === s.slug
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "bg-[var(--surface)] text-[var(--foreground-muted)] hover:bg-[var(--surface-raised)]"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-[var(--foreground-muted)]">
            No projects found for this service.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <FadeIn key={project.id} delay={i * 0.05}>
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-lg"
                >
                  {/* Cover image */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[var(--accent)]/20 to-[var(--highlight)]/20">
                    {project.coverImage &&
                      !project.coverImage.includes("placeholder") && (
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                  </div>

                  <div className="p-5">
                    {/* Client */}
                    {project.client && (
                      <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                        {project.client}
                      </p>
                    )}

                    <h3 className="mt-1 text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                      {project.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-[var(--foreground-muted)]">
                      {project.shortDescription}
                    </p>

                    {/* Tech stack */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-xs text-[var(--foreground-muted)]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-xs text-[var(--foreground-muted)]">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Services */}
                    {project.services.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.services.map((s) => (
                          <span
                            key={s.id}
                            className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--highlight)]"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-3 text-xs text-[var(--foreground-muted)]">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
