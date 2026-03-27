# Rooibok Technologies — Website Planning Document

> This is the primary reference document for the Rooibok Technologies website project. Every architectural decision, design choice, and development plan lives here. When in doubt, this document is the source of truth (alongside `prisma/schema.prisma` for the data model).

---

## 1. Overview

**Company:** Rooibok Technologies — a software development company based in Lira, Uganda, offering web applications, mobile apps, SaaS products, bulk SMS, social media marketing, and other IT services.

**Site Purpose:** A fully dynamic company website that serves clients, investors, and potential hires. The site includes:

- Public-facing pages (home, about, services, portfolio, blog, careers, contact, legal)
- An admin dashboard for managing all content, applications, inquiries, and site settings
- A blog system with multiple contributors
- A careers sub-system with job postings and application tracking
- A configurable popup system for announcements, CTAs, and promotions

**Key Principle:** ALL content visible on the public site is database-driven and editable from the admin dashboard. No text, headline, CTA label, or page section is hardcoded. The only things defined in code are layout structure, component composition, and design tokens. Content is fetched via the `ContentBlock` and `SiteSettings` models and cached with `revalidateTag`.

---

## 2. Pages & Routes

### 2.1 Home (`/`)

The home page is the primary landing experience. It combines multiple content sections to communicate who Rooibok is, what they do, and why visitors should engage.

**Sections (top to bottom):**

1. **Hero Section**
   - Gradient text headline (fetched from `ContentBlock` key: `home.hero.headline`)
   - Subheadline paragraph (key: `home.hero.subheadline`)
   - Two CTA buttons:
     - Primary: "Start a Project" → `/contact`
     - Secondary: "See Our Work" → `/portfolio`
   - Animated gradient orbs in background for visual depth

2. **Logo Bar / Trusted By**
   - Horizontal marquee of client logos
   - Sourced from the database (key: `home.logos` or a dedicated content group)
   - Auto-scrolling with pause-on-hover

3. **Services Overview**
   - Section header: "What We Do" (or similar, from DB)
   - Card grid pulled from the `Service` model (published services, ordered by `order` field)
   - Each card shows: icon (Lucide icon name), service name, short description
   - Link to `/services/[slug]` for each card

4. **Featured Projects**
   - 3 project cards from the `Project` model where `featured = true`
   - Each card: cover image, title, short description, tech stack tags
   - Link to `/portfolio/[slug]`

5. **Value Props / Metrics**
   - Animated countUp numbers (using the `CountUp` effect component)
   - Metrics like: years of experience, projects delivered, clients served, team size
   - Values fetched from `ContentBlock` (key group: `home.metrics`)

6. **Testimonials**
   - Carousel/slider of client testimonials
   - Each testimonial: quote, client name, role/company, optional avatar
   - Sourced from `ContentBlock` (key group: `home.testimonials`) or from `Project.testimonial` entries

7. **Blog Preview**
   - 3 latest published posts from the `Post` model
   - Each card: cover image, title, excerpt, author, read time, publish date
   - "View All Posts" link to `/blog`

8. **CTA Banner**
   - Full-width banner: "Ready to build something great?" (from DB)
   - CTA button linking to `/contact`
   - Uses the shared `CtaBanner` component

### 2.2 About (`/about`)

The About section uses subroutes for organized content while sharing a consistent layout.

**Routes:**

- `/about` — Who We Are (overview)
- `/about/mission` — Mission & Vision
- `/about/team` — The Team
- `/about/story` — Our Story

**`/about` (Who We Are)**
- Page hero with headline and subheadline
- Overview content block (rich text from DB)
- Quick links to mission, team, and story subroutes
- CTA banner

**`/about/mission` (Mission & Vision)**
- Mission statement (key: `about.mission`)
- Vision statement (key: `about.vision`)
- Company values grid (key group: `about.values`)

**`/about/team` (The Team)**
- Grid of team members from the `TeamMember` model
- Each card: photo, name, role, bio excerpt, social links (LinkedIn, X, GitHub, Instagram)
- Ordered by the `order` field
- Only shows members where `published = true`

**`/about/story` (Our Story)**
- Company story timeline built from the `Milestone` model
- Each milestone: date, title, description, optional image
- Vertical timeline layout, ordered by `order` field
- CTA banner at bottom

### 2.3 Services (`/services`)

**`/services` (Index)**
- Page hero
- Services grid with cards from the `Service` model
- Each card: icon, name, short description
- Cards link to `/services/[slug]`
- Only shows services where `published = true`, ordered by `order`

**`/services/[slug]` (Service Detail)**
- Service name and icon
- Full description (rendered from Tiptap JSON stored in `fullDescription`)
- Tech stack tags (from `techStack` array)
- FAQs accordion (from `faqs` JSON: `[{ question, answer }]`)
- Process steps (if included in the content)
- Related projects: projects linked via the `ProjectServices` relation
- CTA banner: "Need this service?"

### 2.4 Portfolio (`/portfolio`)

**`/portfolio` (Index)**
- Page hero
- Filterable grid of projects from the `Project` model
- Filter by: service category (via `ProjectServices` relation), tech stack
- Each card: cover image, title, client, short description, tech stack tags
- Only shows projects where `published = true`

**`/portfolio/[slug]` (Project Detail)**
- Project title, client name, date range
- Screenshot gallery (from `images` array)
- Challenge / Solution / Result sections (each stored as Tiptap JSON)
- Tech stack tags
- Services used (linked via relation)
- Client testimonial (from `testimonial` JSON: `{ quote, author, role }`)
- CTA: "Have a similar project in mind?"

### 2.5 Blog (`/blog`)

**`/blog` (Index)**
- Page hero
- Category tabs (from `Category` model) for filtering
- Search input for filtering by title/excerpt
- Paginated grid of posts from the `Post` model
- Each card: cover image, title, excerpt, author name + avatar, category tag, read time, publish date
- Only shows posts where `published = true`

**`/blog/[slug]` (Post Detail)**
- Post title, cover image, author bio card, publish date, read time, category
- Content rendered from Tiptap JSON (`content` field)
- Table of contents sidebar (auto-generated from headings)
- Author bio section at bottom
- Share buttons (copy link, X, LinkedIn, Facebook)
- Tags list
- Related posts section (same category or shared tags)

### 2.6 Careers (`/careers`)

**`/careers` (Index)**
- Page hero with culture/values content (key: `careers.culture`)
- Job listings from the `Job` model where `published = true` and `closedAt` is null or in the future
- Filters: department, job type (`FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`), location
- Each listing: title, department, location, type badge, short description
- Salary range displayed if provided (in `salaryCurrency`)

**`/careers/[slug]` (Job Detail)**
- Job title, department, location, type, salary range
- Full job description (rendered from Tiptap JSON)
- Application form with fields:
  - Full name (required)
  - Email (required)
  - Phone (required)
  - Resume upload (required, file upload → stored via storage interface)
  - Cover letter (optional, textarea)
  - Portfolio URL (optional)
  - LinkedIn URL (optional)
  - Referral source (optional, dropdown: "How did you hear about us?")
- Form validated with Zod schema (`src/lib/validations/application.ts`)
- Success confirmation after submission

### 2.7 Contact (`/contact`)

**Layout:** Two-column on desktop (form left, info right), stacked on mobile.

**Contact Form (left column):**
- Full name (required)
- Email (required)
- Phone (optional)
- Service interested in (dropdown, populated from `Service` model)
- Budget range (dropdown with predefined ranges)
- Message (required, textarea)
- Honeypot field (hidden `website` field for spam protection — if filled, submission is silently discarded)
- Validated with Zod schema (`src/lib/validations/contact.ts`)
- Submitted via Server Action → creates `Inquiry` record

**Contact Info (right column):**
- Email address (from `SiteSettings.email`)
- Phone number (from `SiteSettings.phone`)
- Location/address (from `SiteSettings.address`)
- Social media links (from `SiteSettings.socialLinks`: Instagram, Facebook, LinkedIn, X, TikTok)
- Working hours (from `ContentBlock`, key: `contact.hours`)
- Optional embedded map

### 2.8 Legal Pages

**`/privacy` (Privacy Policy)**
- Content fetched from `ContentBlock` with key `legal.privacy`
- Type: `RICH_TEXT`
- Rendered as formatted HTML/prose
- Editable from admin dashboard under Legal section

**`/terms` (Terms of Service)**
- Content fetched from `ContentBlock` with key `legal.terms`
- Type: `RICH_TEXT`
- Same rendering and admin editing as privacy policy

### 2.9 Admin Dashboard (`/admin`)

Protected by NextAuth.js. All admin routes require authentication (enforced by middleware at `src/middleware.ts`). The admin uses a sidebar layout (component: `src/components/admin/sidebar.tsx`).

**Routes & Functionality:**

| Route | Purpose | Access |
|---|---|---|
| `/admin` | Dashboard overview — stats (posts, projects, inquiries, applications) | ADMIN, EDITOR |
| `/admin/blog` | CRUD for blog posts, Tiptap editor, publish/unpublish, manage categories & tags | ADMIN, EDITOR |
| `/admin/portfolio` | CRUD for projects, image uploads, link to services | ADMIN, EDITOR |
| `/admin/services` | CRUD for services, set icon, tech stack, FAQs, ordering | ADMIN |
| `/admin/careers` | CRUD for job listings + view/manage applications with status tracking | ADMIN |
| `/admin/inquiries` | View contact form submissions, mark as read, internal notes | ADMIN |
| `/admin/team` | CRUD for team members, photo upload, ordering | ADMIN |
| `/admin/content` | ContentBlock editor — edit any content block by key with a searchable interface | ADMIN |
| `/admin/popups` | CRUD for popups — configure type, trigger, frequency, targeting, scheduling | ADMIN |
| `/admin/legal` | Edit privacy policy and terms of service (rich text editors) | ADMIN |
| `/admin/media` | Media library — upload, browse, delete images and files | ADMIN |
| `/admin/settings` | Site settings — company name, tagline, contact info, social links, SEO defaults, footer config, nav config | ADMIN |
| `/admin/login` | Login page (outside the sidebar layout) | Public |

**Roles:**
- `ADMIN` — Full access to all admin sections
- `EDITOR` — Access to blog and portfolio management only

### 2.10 Error Pages

- **404 (Not Found):** Custom page at `src/app/not-found.tsx`. Friendly message, search suggestion, link back to home.
- **500 (Error):** Custom error boundary at `src/app/error.tsx`. Apologetic message, retry button, link to contact.
- **Loading Skeletons:** Each major page section has a loading skeleton for Suspense boundaries.
- **Maintenance Mode:** Configurable via `SiteSettings` — when enabled, all public pages show a maintenance message while admin remains accessible.

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15+ (App Router) | Server Components by default, `"use client"` only for interactivity |
| Language | TypeScript | Strict mode, no `any` types |
| React | React 19 | Latest features including Server Components |
| Database | PostgreSQL 16 | Running in Docker (Alpine image) |
| ORM | Prisma | Schema at `prisma/schema.prisma`, client at `src/lib/db.ts` |
| Auth | NextAuth.js v4 | Credentials provider, JWT sessions |
| Styling | Tailwind CSS v4 | Utility-first, configured via `postcss.config.mjs` |
| Components | shadcn/ui | Copied into `src/components/ui/`, customized to brand |
| Animations | Framer Motion 12 | Respects `prefers-reduced-motion` |
| Icons | Lucide React | Consistent icon set throughout |
| Forms | React Hook Form + Zod | `@hookform/resolvers` for Zod integration |
| Rich Text | Tiptap | JSON document format stored in DB, rendered on frontend |
| Package Manager | pnpm | Lockfile committed, `pnpm-lock.yaml` |
| Containerization | Docker + Docker Compose | Postgres container in dev; full app container for production |
| Hosting | VPS (self-hosted) | Nginx or Caddy as reverse proxy |
| CI/CD | GitHub Actions | Build → test → SSH deploy to VPS |
| Dev Server | Next.js Turbopack | `pnpm dev` uses `--turbopack` flag |

**Key Dependencies (from `package.json`):**
- `next` (^15.3), `react` (^19), `react-dom` (^19)
- `@prisma/client` (^6), `prisma` (^6)
- `next-auth` (^4), `bcryptjs` (^3)
- `framer-motion` (^12), `lucide-react` (^0.500)
- `class-variance-authority`, `clsx`, `tailwind-merge` (for styling utilities)
- `next-themes` (^0.4) for dark/light mode
- `react-hook-form` (^7), `@hookform/resolvers` (^5), `zod` (^3)

---

## 4. Design System

### Brand Colors

| Name | Hex | Usage |
|---|---|---|
| Blue Slate | `#516171` | Secondary text, links in light mode, muted accents |
| Icy Blue | `#B3D1ED` | Highlights and accents in dark mode, hover states |
| Graphite | `#2B2B2B` | Dark mode background, primary text in light mode |
| Pastel Pink | `#FEBFCA` | Primary accent color, CTAs, buttons, interactive highlights |
| White | `#FFFFFF` | Light mode background |
| Light Surface | `#F8FAFC` | Light mode card/surface backgrounds |
| Dark Surface | `#363636` | Dark mode card/surface backgrounds |

### Design Direction

The site should feel **fun, innovative, and approachable** while maintaining professionalism. Think creative tech agency, not corporate enterprise.

**Inspiration references:**
- **hear.ai** — Clean editorial structure, whitespace, typography hierarchy
- **junabase.com** — Dark mode animations, gradient glows, glassmorphism effects

### Light Mode

- Clean, editorial aesthetic
- White backgrounds with light surface cards
- Graphite (`#2B2B2B`) primary text
- Blue Slate (`#516171`) secondary text and links
- Pastel Pink (`#FEBFCA`) accents and CTAs
- Generous whitespace, clear typography hierarchy

### Dark Mode

- Showcase/portfolio mode — this is where the site shines visually
- Graphite (`#2B2B2B`) background with dark surface (`#363636`) cards
- Near-white (`#F8FAFC`) primary text
- Icy Blue (`#B3D1ED`) secondary text, links, and accents
- Pastel Pink (`#FEBFCA`) remains the primary accent
- **Glassmorphism:** Frosted glass card effects with backdrop blur and subtle borders
- **Gradient Glows:** Animated gradient orbs behind sections for visual depth (component: `src/components/effects/gradient-orbs.tsx`)
- **Grain/Noise Texture:** Subtle noise overlay across pages for tactile depth

### Typography

- **Primary Font:** Inter (variable weight, loaded via `next/font`)
- **Headings:** Bold/Semibold, large sizes, occasional gradient text treatment
- **Body:** Regular weight, comfortable reading line-height

### Animations & Motion

- Powered by **Framer Motion**
- **FadeIn** component (`src/components/effects/fade-in.tsx`) for scroll-triggered reveals
- **GradientText** component (`src/components/effects/gradient-text.tsx`) for animated gradient headlines
- **CountUp** component (`src/components/effects/count-up.tsx`) for animated number metrics
- All animations respect `prefers-reduced-motion` media query
- Motion should be purposeful, not decorative — guide attention, indicate state changes, create delight

### Accessibility

- **Target:** WCAG 2.1 AA compliance
- Sufficient color contrast ratios in both light and dark modes
- Semantic HTML structure
- Keyboard navigable interactive elements
- ARIA labels where needed
- Focus indicators on all interactive elements
- Reduced motion support

---

## 5. Database Schema

The complete schema is defined in `prisma/schema.prisma` (source of truth). Below is a summary of all models and enums.

### Enums

```
Role             — ADMIN, EDITOR
JobType          — FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
ApplicationStatus — NEW, REVIEWING, INTERVIEW, OFFERED, REJECTED, HIRED
ContentBlockType — TEXT, RICH_TEXT, IMAGE, LINK, GROUP
PopupType        — BANNER, MODAL, SLIDE_IN, BOTTOM_BAR
PopupTrigger     — ON_LOAD, ON_SCROLL, ON_EXIT_INTENT, AFTER_DELAY, ON_CLICK
PopupFrequency   — ONCE_PER_SESSION, ONCE_EVER, ALWAYS, EVERY_X_DAYS
```

### Models

**User**
- Fields: id, name, email (unique), passwordHash, role (ADMIN/EDITOR), avatar, bio, socialLinks (JSON)
- Relations: has many Posts

**Post**
- Fields: id, slug (unique), title, excerpt, content (Tiptap JSON), coverImage, published, featured, publishedAt, readTime
- Relations: belongs to User (author), belongs to Category, many-to-many with Tag

**Category**
- Fields: id, slug (unique), name
- Relations: has many Posts

**Tag**
- Fields: id, slug (unique), name
- Relations: many-to-many with Post

**Service**
- Fields: id, slug (unique), name, shortDescription, fullDescription (Tiptap JSON), icon (Lucide icon name), techStack (string array), faqs (JSON), order, published
- Relations: many-to-many with Project (via `ProjectServices`)

**Project**
- Fields: id, slug (unique), title, client, shortDescription, description (Tiptap JSON), challenge (Tiptap JSON), solution (Tiptap JSON), result (Tiptap JSON), coverImage, images (string array), techStack (string array), testimonial (JSON), startDate, endDate, published, featured
- Relations: many-to-many with Service (via `ProjectServices`)

**Job**
- Fields: id, slug (unique), title, department, location, type (JobType enum), description (Tiptap JSON), shortDescription, salaryMin, salaryMax, salaryCurrency (default "UGX"), published, publishedAt, closedAt
- Relations: has many Applications

**Application**
- Fields: id, fullName, email, phone, resumeUrl, coverLetter, portfolioUrl, linkedinUrl, referralSource, notes, internalNotes, status (ApplicationStatus enum)
- Relations: belongs to Job

**Inquiry**
- Fields: id, fullName, email, phone, service, budget, message, read (boolean)
- No relations

**TeamMember**
- Fields: id, name, role, bio, photo, socialLinks (JSON), order, published

**Milestone**
- Fields: id, date, title, description, image, order

**Media**
- Fields: id, filename, url, mimeType, size (bytes), alt

**SiteSettings** (singleton, id defaults to "default")
- Fields: companyName (default "Rooibok Technologies"), tagline, email, phone, address, socialLinks (JSON), seoDefaults (JSON), footerConfig (JSON), navConfig (JSON)

**ContentBlock**
- Fields: id, key (unique), content (JSON), type (ContentBlockType enum), order

**Popup**
- Fields: id, name, title, content (JSON), type (PopupType), trigger (PopupTrigger), delay, scrollThreshold, pages (string array of route patterns), frequency (PopupFrequency), frequencyDays, startDate, endDate, active, ctaText, ctaLink, styleOverrides (JSON), order

---

## 6. Dynamic Content Architecture

### ContentBlock System

The `ContentBlock` model is a flexible key-value content store. Each block has:
- A unique `key` using dot notation (e.g., `home.hero.headline`, `footer.tagline`, `careers.culture`)
- A `content` field (JSON) that holds the actual content value
- A `type` that determines how the content is interpreted and rendered:
  - `TEXT` — plain string
  - `RICH_TEXT` — Tiptap JSON document
  - `IMAGE` — image URL with optional alt text
  - `LINK` — URL with label
  - `GROUP` — collection of related content items

**Fetching content in Server Components:**

Content is fetched via query functions in `src/server/queries/content.ts`:
- `getContentBlock(key)` — fetch a single block by its key
- `getContentGroup(prefix)` — fetch all blocks whose keys start with a prefix (e.g., `home.metrics` returns `home.metrics.projects`, `home.metrics.clients`, etc.)

**Caching strategy:**
- All content queries use Next.js `unstable_cache` with the `"content"` tag
- When content is updated via admin, the `"content"` tag is revalidated via `revalidateTag("content")` in the Server Action (`src/server/actions/content.ts`)
- This means content updates are reflected on the live site without a full rebuild

### SiteSettings

The `SiteSettings` model stores global configuration in a singleton record (id: `"default"`):
- Company name and tagline
- Contact information (email, phone, address)
- Social media links (Instagram, Facebook, LinkedIn, X, TikTok)
- SEO defaults (title, description, OG image)
- Footer configuration (column layout, links, copyright text)
- Navigation CTA (button text and link in the navbar)

Fetched via `src/server/queries/settings.ts`, cached with `"settings"` tag.

### Content Key Conventions

Keys follow a hierarchical dot notation pattern:

```
home.hero.headline          — Home page hero headline
home.hero.subheadline       — Home page hero subheadline
home.metrics.projects       — Home page metrics: projects count
home.metrics.clients        — Home page metrics: clients count
about.mission               — About mission statement
about.vision                — About vision statement
about.values.innovation     — About values: innovation
careers.culture             — Careers page culture section
contact.hours               — Contact page working hours
legal.privacy               — Privacy policy content
legal.terms                 — Terms of service content
footer.tagline              — Footer tagline
cta.default.headline        — Default CTA banner headline
cta.default.button          — Default CTA banner button text
error.404.headline          — 404 page headline
error.500.headline          — 500 page headline
```

---

## 7. Popup System

The popup system allows admins to create and manage custom popups that appear on public pages based on configurable rules.

### Popup Types

| Type | Behavior |
|---|---|
| `BANNER` | Full-width bar at top or bottom of the viewport |
| `MODAL` | Centered overlay dialog with backdrop |
| `SLIDE_IN` | Slides in from a screen edge (typically bottom-right) |
| `BOTTOM_BAR` | Sticky bar fixed to the bottom of the viewport |

### Trigger Conditions

| Trigger | Behavior |
|---|---|
| `ON_LOAD` | Shows immediately when the page loads |
| `ON_SCROLL` | Shows when user scrolls past `scrollThreshold` percentage |
| `ON_EXIT_INTENT` | Shows when the cursor moves toward the browser's close/back area |
| `AFTER_DELAY` | Shows after `delay` milliseconds |
| `ON_CLICK` | Shows when a specific element (identified by CSS selector or data attribute) is clicked |

### Display Frequency

| Frequency | Behavior |
|---|---|
| `ONCE_PER_SESSION` | Shows once per browser session (sessionStorage) |
| `ONCE_EVER` | Shows once ever per device (localStorage) |
| `ALWAYS` | Shows every time trigger conditions are met |
| `EVERY_X_DAYS` | Shows once every `frequencyDays` days (localStorage with timestamp) |

### Page Targeting

The `pages` field (string array) contains route patterns that determine which pages the popup appears on:
- `"/"` — home page only
- `"/blog/*"` — all blog pages
- `"*"` — all pages
- `"/services"` — services index only

### Scheduling

Popups can have `startDate` and `endDate` for time-limited campaigns. The `active` boolean provides a manual on/off switch.

### Implementation

- Active popups are fetched server-side via `src/server/queries/popups.ts`
- A client-side `PopupManager` component (in `src/components/shared/`) handles:
  - Matching current route against popup page patterns
  - Evaluating trigger conditions
  - Checking frequency rules against browser storage
  - Rendering the correct popup type with animations
  - Dismissal handling and frequency tracking

---

## 8. Project Structure

```
/home/byteme/dev/rooibok/
├── CLAUDE.md                         # AI assistant instructions
├── PLANNING.md                       # This document
├── docker-compose.yml                # Docker services (PostgreSQL)
├── package.json                      # Dependencies and scripts
├── pnpm-lock.yaml                    # Lockfile
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS / Tailwind config
├── eslint.config.mjs                 # ESLint configuration
├── prisma/
│   ├── schema.prisma                 # Database schema (source of truth)
│   └── seed.ts                       # Database seed script
├── public/                           # Static assets
└── src/
    ├── middleware.ts                  # Auth middleware (protects /admin routes)
    ├── app/
    │   ├── layout.tsx                # Root layout (fonts, theme provider, metadata)
    │   ├── not-found.tsx             # Custom 404 page
    │   ├── error.tsx                 # Custom error boundary
    │   ├── (public)/                 # Public route group
    │   │   ├── layout.tsx            # Public layout (navbar + footer)
    │   │   └── page.tsx              # Home page (/)
    │   ├── (admin)/                  # Admin route group
    │   │   ├── layout.tsx            # Admin layout (auth check + sidebar)
    │   │   └── admin/
    │   │       ├── page.tsx          # Admin dashboard (/admin)
    │   │       └── login/
    │   │           ├── layout.tsx    # Login layout (no sidebar)
    │   │           └── page.tsx      # Login page (/admin/login)
    │   └── api/
    │       └── auth/
    │           └── [...nextauth]/
    │               └── route.ts      # NextAuth API route
    ├── components/
    │   ├── ui/                       # shadcn/ui base components (do not edit unless customizing design system)
    │   ├── shared/                   # Reusable layout components
    │   │   ├── navbar.tsx            # Site navigation
    │   │   ├── footer.tsx            # Site footer
    │   │   ├── cta-banner.tsx        # Reusable CTA banner section
    │   │   ├── page-hero.tsx         # Reusable page hero section
    │   │   ├── section-header.tsx    # Reusable section heading
    │   │   ├── theme-provider.tsx    # next-themes provider
    │   │   └── theme-toggle.tsx      # Dark/light mode toggle
    │   ├── effects/                  # Visual effect components
    │   │   ├── gradient-orbs.tsx     # Animated gradient background orbs
    │   │   ├── gradient-text.tsx     # Gradient text animation
    │   │   ├── count-up.tsx          # Animated number counter
    │   │   └── fade-in.tsx           # Scroll-triggered fade-in wrapper
    │   ├── admin/                    # Admin-specific components
    │   │   └── sidebar.tsx           # Admin sidebar navigation
    │   ├── home/                     # Home page section components
    │   ├── about/                    # About page components
    │   ├── services/                 # Services page components
    │   ├── portfolio/                # Portfolio page components
    │   ├── blog/                     # Blog page components
    │   ├── careers/                  # Careers page components
    │   └── contact/                  # Contact page components
    ├── server/
    │   ├── queries/                  # Read-only DB queries (used in Server Components)
    │   │   ├── content.ts            # ContentBlock queries
    │   │   ├── settings.ts           # SiteSettings queries
    │   │   ├── posts.ts              # Blog post queries
    │   │   ├── services.ts           # Service queries
    │   │   ├── projects.ts           # Portfolio project queries
    │   │   ├── jobs.ts               # Job listing queries
    │   │   ├── team.ts               # Team member queries
    │   │   └── popups.ts             # Popup queries
    │   └── actions/                  # Server Actions for mutations
    │       ├── content.ts            # ContentBlock mutations + cache invalidation
    │       ├── inquiries.ts          # Contact form submission
    │       └── settings.ts           # SiteSettings mutations
    ├── lib/
    │   ├── auth.ts                   # NextAuth configuration
    │   ├── db.ts                     # Prisma client instance
    │   ├── utils.ts                  # Utility functions (cn, etc.)
    │   ├── constants.ts              # Navigation links, social platforms, admin nav
    │   └── validations/              # Zod validation schemas
    │       ├── auth.ts               # Login form validation
    │       ├── contact.ts            # Contact form validation
    │       └── application.ts        # Job application form validation
    └── styles/                       # Global styles
```

---

## 9. Development Phases

### Phase 1 — Foundation (CURRENT)

**Status:** In progress

**Scope:**
- [x] Project scaffolding (Next.js, TypeScript, Tailwind, pnpm)
- [x] Docker Compose setup (PostgreSQL)
- [x] Prisma schema design (all models and enums)
- [x] NextAuth.js configuration (credentials provider, JWT sessions)
- [x] Middleware for admin route protection
- [x] Root layout with theme provider (next-themes)
- [x] Design system foundations (brand colors, dark/light mode)
- [x] Base shared components (navbar, footer, CTA banner, page hero, section header, theme toggle)
- [x] Visual effect components (gradient orbs, gradient text, count-up, fade-in)
- [x] Admin sidebar component
- [x] Admin login page
- [x] Constants file (nav links, social platforms, admin nav)
- [x] Server query and action structure
- [x] Zod validation schemas (auth, contact, application)
- [x] Custom 404 and error pages
- [ ] Database seed script with placeholder data
- [ ] shadcn/ui component library setup (add core components)

### Phase 2 — Public Pages

**Scope:**
- Home page (all sections: hero, logo bar, services overview, featured projects, metrics, testimonials, blog preview, CTA)
- About pages (overview, mission, team, story)
- Services pages (index + detail)
- Contact page (form + info)
- Legal pages (privacy, terms)
- Footer fully wired to SiteSettings
- Navbar with dropdown for About subroutes
- Responsive design for all pages
- SEO metadata for all routes

### Phase 3 — Content Systems

**Scope:**
- Blog system (index page with categories/search/pagination, post detail with Tiptap rendering, ToC, share, related posts)
- Portfolio system (filterable index, project detail with gallery, challenge/solution/result)
- Admin dashboard CRUD:
  - Blog post management with Tiptap editor
  - Category and tag management
  - Portfolio project management with image uploads
  - Service management
  - Team member management
  - Content block editor
  - Site settings editor
  - Media library
  - Legal page editor
- Popup system (admin CRUD + PopupManager client component)

### Phase 4 — Careers System

**Scope:**
- Careers index page with filters
- Job detail page
- Application form with file upload
- Admin careers management:
  - Job listing CRUD
  - Application inbox with status tracking (NEW → REVIEWING → INTERVIEW → OFFERED/REJECTED/HIRED)
  - Internal notes on applications
- Email notifications for new applications (abstracted behind provider interface)

### Phase 5 — Polish & Launch

**Scope:**
- Page transition animations
- Scroll-triggered animations on all sections
- Loading skeletons for all Suspense boundaries
- Image optimization (Next.js Image component, proper sizes/formats)
- SEO audit (meta tags, Open Graph, structured data, sitemap, robots.txt)
- Performance audit (Core Web Vitals, bundle analysis, lazy loading)
- Accessibility audit (keyboard navigation, screen reader testing, contrast ratios)
- Maintenance mode implementation
- Production Docker configuration (multi-stage build)
- Nginx/Caddy reverse proxy configuration
- GitHub Actions CI/CD pipeline (lint → build → deploy)
- SSL certificate setup
- Automated PostgreSQL backup strategy
- Final QA and launch

---

## 10. Resolved Questions

| # | Question | Resolution |
|---|---|---|
| 1 | **Domain name** | TBD — targeting `rooibok.net` or `rooibok.com` |
| 2 | **Logo** | Being designed by a graphic designer. Code uses a text-based fallback ("Rooibok") until the final logo is delivered. |
| 3 | **Illustrations/Doodles** | Not a launch priority. Use placeholders where illustrations would go. Can be added later. |
| 4 | **Email provider** | TBD — email sending is abstracted behind a provider interface so the implementation can be swapped without code changes. |
| 5 | **Analytics** | Future phase — plan to build an in-house analytics dashboard rather than using third-party services. |
| 6 | **Legal pages** | Yes, the site will have a Privacy Policy and Terms of Service, both editable from the admin dashboard via ContentBlock. |
| 7 | **Social media platforms** | Instagram, Facebook, LinkedIn, X (Twitter), TikTok — stored in `SiteSettings.socialLinks` as JSON. |
| 8 | **Blog authorship** | Multiple contributors supported. Each `Post` belongs to a `User` (author). Users have profiles with avatar, bio, and social links. |
| 9 | **File storage** | TBD — starting with local VPS storage, abstracted behind a storage interface for future migration to S3-compatible object storage. |
| 10 | **Database backups** | Automated PostgreSQL backups will be configured as part of the production deployment (Phase 5). Strategy TBD (pg_dump cron, WAL archiving, or managed backup service). |
