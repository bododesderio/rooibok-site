# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Rooibok Technologies company website — a fully dynamic site with an admin dashboard, blog, portfolio, careers sub-system, popup builder, and public-facing pages. See `PLANNING.md` for full design and architecture decisions.

## Tech Stack

- **Framework:** Next.js (App Router) with TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS + shadcn/ui components + Framer Motion animations
- **Containerization:** Docker + Docker Compose
- **Hosting:** Self-hosted on VPS

## Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
pnpm db:push                # Push Prisma schema to DB
pnpm db:migrate             # Run Prisma migrations
pnpm db:studio              # Open Prisma Studio (DB GUI)
pnpm db:seed                # Seed database with placeholder data

# Docker
docker compose up -d        # Start Postgres + app
docker compose down         # Stop containers

# shadcn/ui
pnpx shadcn@latest add [component]   # Add a new shadcn/ui component
```

## Architecture

- `src/app/(public)/` — public routes (home, about, services, blog, careers, contact, legal)
- `src/app/(admin)/` — admin dashboard routes (behind auth)
- `src/app/api/` — API routes
- `src/components/ui/` — shadcn/ui base components (do not edit directly unless customizing the design system)
- `src/components/shared/` — reusable layout components (header, footer, nav, popup manager)
- `src/components/effects/` — visual effect components (gradient orbs, grain, animated text, fade-in)
- `src/server/queries/` — read-only DB queries (used in Server Components)
- `src/server/actions/` — Server Actions for mutations
- `src/lib/validations/` — Zod schemas for form validation
- `prisma/schema.prisma` — database schema (source of truth for data model)

## Dynamic Content System

**Critical principle: NOTHING is hardcoded.** Every visible piece of text on the public site — hero headlines, footer tagline, CTA button labels, error page messages, legal pages — is stored in the database and editable from the admin dashboard.

- **ContentBlock model** — key-value content store. Keys follow dot notation: `home.hero.headline`, `footer.tagline`, `careers.culture`, etc.
- **SiteSettings model** — global config: company name, social links, footer layout, nav CTA text
- **Popup model** — admin-designed popups with configurable type, trigger, frequency, and targeting
- Fetch content via `src/server/queries/content.ts` → `getContentBlock(key)`, `getContentGroup(prefix)`
- Cache with `revalidateTag("content")` — invalidated on admin save

When building any public page, **always fetch text from ContentBlock** instead of writing string literals. The only things in code are layout structure, component composition, and design tokens.

## Design System

- **Brand colors:** Blue Slate (#516171), Icy Blue (#B3D1ED), Graphite (#2B2B2B), Pastel Pink (#FEBFCA)
- **Light mode:** White (#FFFFFF) background, graphite text, blue slate secondary, pastel pink accents
- **Dark mode:** Graphite (#2B2B2B) background, near-white text, icy blue secondary, pastel pink accents
- **Animations:** Framer Motion. Respect `prefers-reduced-motion`. Purposeful, not decorative.
- **Social platforms:** Instagram, Facebook, LinkedIn, X, TikTok
- **Logo:** Text-based fallback until graphic designer delivers final logo

## Conventions

- All content is database-driven via ContentBlock and SiteSettings models
- Use Next.js Server Components by default; `"use client"` only for interactivity or browser APIs
- Server-side data fetching in `src/server/` — keep Prisma calls out of components
- Use Next.js Server Actions for mutations
- Route groups `(public)` and `(admin)` separate concerns without affecting URL paths
- File uploads abstracted behind a storage interface (local VPS initially, S3-compatible later)
- Email sending abstracted behind a provider interface (provider TBD)
