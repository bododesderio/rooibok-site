import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin User ─────────────────────────────────────────
  // IMPORTANT: Change this password immediately after first login in production
  const adminPassword = await hash("ChangeMe!2024#Rooibok", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@rooibok.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@rooibok.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      bio: "Site administrator",
    },
  });
  console.log("  ✓ Admin user created");

  // ─── Site Settings ──────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      companyName: "Rooibok Technologies",
      tagline:
        "Building innovative digital solutions in Lira, Uganda — for the world.",
      email: "hello@rooibok.com",
      phone: "+256 XXX XXX XXX",
      address: "Lira, Uganda",
      socialLinks: {
        instagram: "https://instagram.com/rooibok",
        facebook: "https://facebook.com/rooibok",
        linkedin: "https://linkedin.com/company/rooibok",
        x: "https://x.com/rooibok",
        tiktok: "https://tiktok.com/@rooibok",
      },
      seoDefaults: {
        title: "Rooibok Technologies",
        description:
          "Building innovative digital solutions in Lira, Uganda — for the world.",
        ogImage: "/images/og-default.png",
      },
      footerConfig: {
        columns: [
          {
            heading: "Company",
            links: [
              { label: "About Us", url: "/about" },
              { label: "Our Team", url: "/about/team" },
              { label: "Careers", url: "/careers" },
              { label: "Contact", url: "/contact" },
            ],
          },
          {
            heading: "Services",
            links: [
              { label: "Web Development", url: "/services/web-development" },
              { label: "Mobile Apps", url: "/services/mobile-apps" },
              { label: "UI/UX Design", url: "/services/ui-ux-design" },
              { label: "Consulting", url: "/services/consulting" },
            ],
          },
          {
            heading: "Resources",
            links: [
              { label: "Blog", url: "/blog" },
              { label: "Portfolio", url: "/portfolio" },
              { label: "Privacy Policy", url: "/privacy" },
              { label: "Terms of Service", url: "/terms" },
            ],
          },
        ],
        copyright: `${new Date().getFullYear()} Rooibok Technologies. All rights reserved.`,
      },
      navConfig: {
        ctaText: "Get in Touch",
        ctaLink: "/contact",
      },
    },
  });
  console.log("  ✓ Site settings created");

  // ─── Content Blocks ─────────────────────────────────────
  const contentBlocks = [
    // Home hero
    {
      key: "home.hero.headline",
      content: { value: "We Build What's Next" },
      type: "TEXT" as const,
    },
    {
      key: "home.hero.subheadline",
      content: {
        value:
          "Innovative software solutions crafted in Lira, Uganda — for the world.",
      },
      type: "TEXT" as const,
    },
    {
      key: "home.hero.cta_primary",
      content: { value: "Start a Project" },
      type: "TEXT" as const,
    },
    {
      key: "home.hero.cta_secondary",
      content: { value: "See Our Work" },
      type: "TEXT" as const,
    },

    // Value props
    {
      key: "home.value_props.1",
      content: {
        title: "End-to-End Development",
        description:
          "From concept to deployment, we handle every stage of the software lifecycle.",
        icon: "Code2",
      },
      type: "GROUP" as const,
      order: 1,
    },
    {
      key: "home.value_props.2",
      content: {
        title: "Modern Tech Stack",
        description:
          "We use cutting-edge technologies to build fast, scalable, and maintainable solutions.",
        icon: "Layers",
      },
      type: "GROUP" as const,
      order: 2,
    },
    {
      key: "home.value_props.3",
      content: {
        title: "Client-First Approach",
        description:
          "Your vision drives our process. We collaborate closely to deliver exactly what you need.",
        icon: "Users",
      },
      type: "GROUP" as const,
      order: 3,
    },

    // Footer
    {
      key: "footer.tagline",
      content: {
        value:
          "Building innovative digital solutions in Lira, Uganda — for the world.",
      },
      type: "TEXT" as const,
    },
    {
      key: "footer.newsletter_heading",
      content: { value: "Stay in the loop" },
      type: "TEXT" as const,
    },

    // About
    {
      key: "about.hero.headline",
      content: { value: "Who We Are" },
      type: "TEXT" as const,
    },
    {
      key: "about.hero.subheadline",
      content: {
        value:
          "A passionate team of technologists building the future from Lira, Uganda.",
      },
      type: "TEXT" as const,
    },
    {
      key: "about.overview",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Rooibok Technologies is a software development company based in Lira, Uganda. We specialize in building web applications, mobile apps, and digital solutions that help businesses grow and thrive in the modern world.",
              },
            ],
          },
        ],
      },
      type: "RICH_TEXT" as const,
    },

    // Services
    {
      key: "services.hero.headline",
      content: { value: "What We Do" },
      type: "TEXT" as const,
    },
    {
      key: "services.hero.subheadline",
      content: {
        value:
          "Comprehensive digital services tailored to your business needs.",
      },
      type: "TEXT" as const,
    },

    // Careers
    {
      key: "careers.hero.headline",
      content: { value: "Join Our Team" },
      type: "TEXT" as const,
    },
    {
      key: "careers.hero.subheadline",
      content: {
        value:
          "Help us build innovative solutions and grow your career at Rooibok.",
      },
      type: "TEXT" as const,
    },

    // Contact
    {
      key: "contact.hero.headline",
      content: { value: "Let's Talk" },
      type: "TEXT" as const,
    },
    {
      key: "contact.hero.subheadline",
      content: {
        value:
          "Have a project in mind? We'd love to hear about it. Reach out and let's make it happen.",
      },
      type: "TEXT" as const,
    },
    {
      key: "contact.success_message",
      content: {
        value: "Thanks! We'll get back to you within 24 hours.",
      },
      type: "TEXT" as const,
    },

    // Home — section headings
    {
      key: "home.services.headline",
      content: { value: "What We Do" },
      type: "TEXT" as const,
    },
    {
      key: "home.services.subheadline",
      content: {
        value:
          "End-to-end digital services tailored to your business needs.",
      },
      type: "TEXT" as const,
    },
    {
      key: "home.projects.headline",
      content: { value: "Featured Work" },
      type: "TEXT" as const,
    },
    {
      key: "home.metrics.headline",
      content: { value: "By the Numbers" },
      type: "TEXT" as const,
    },
    {
      key: "home.testimonials.headline",
      content: { value: "What Our Clients Say" },
      type: "TEXT" as const,
    },
    {
      key: "home.blog.headline",
      content: { value: "From the Blog" },
      type: "TEXT" as const,
    },

    // Home — metrics
    {
      key: "home.metrics.years",
      content: { value: 2, label: "Years of Experience", suffix: "+" },
      type: "GROUP" as const,
      order: 1,
    },
    {
      key: "home.metrics.projects",
      content: { value: 15, label: "Projects Delivered", suffix: "+" },
      type: "GROUP" as const,
      order: 2,
    },
    {
      key: "home.metrics.clients",
      content: { value: 10, label: "Happy Clients", suffix: "+" },
      type: "GROUP" as const,
      order: 3,
    },
    {
      key: "home.metrics.team",
      content: { value: 5, label: "Team Members", suffix: "" },
      type: "GROUP" as const,
      order: 4,
    },

    // Home — testimonials
    {
      key: "home.testimonials.1",
      content: {
        quote:
          "Rooibok delivered our platform ahead of schedule with exceptional quality. Their attention to detail and communication throughout the process was outstanding.",
        name: "Sarah M.",
        role: "CEO",
        company: "TechStart Uganda",
      },
      type: "GROUP" as const,
      order: 1,
    },
    {
      key: "home.testimonials.2",
      content: {
        quote:
          "Working with Rooibok transformed our business. Their mobile app solution increased our customer engagement by 300% in the first quarter.",
        name: "James K.",
        role: "Founder",
        company: "AgroConnect",
      },
      type: "GROUP" as const,
      order: 2,
    },
    {
      key: "home.testimonials.3",
      content: {
        quote:
          "Professional, innovative, and reliable. Rooibok is our go-to technology partner for all digital projects.",
        name: "Grace N.",
        role: "Operations Director",
        company: "Lira Commerce Hub",
      },
      type: "GROUP" as const,
      order: 3,
    },

    // CTA defaults
    {
      key: "cta.default.headline",
      content: { value: "Ready to build something great?" },
      type: "TEXT" as const,
    },
    {
      key: "cta.default.subtitle",
      content: { value: "Let's talk about your next project." },
      type: "TEXT" as const,
    },
    {
      key: "cta.default.button",
      content: { value: "Get in Touch" },
      type: "TEXT" as const,
    },

    // About — mission & vision
    {
      key: "about.mission",
      content: {
        value:
          "To empower businesses across Africa and beyond with innovative, high-quality software solutions that drive growth, efficiency, and digital transformation.",
      },
      type: "TEXT" as const,
    },
    {
      key: "about.vision",
      content: {
        value:
          "To be the leading software development company in East Africa, recognized globally for delivering exceptional digital products and nurturing world-class tech talent.",
      },
      type: "TEXT" as const,
    },

    // About — values
    {
      key: "about.values.innovation",
      content: {
        title: "Innovation",
        description:
          "We embrace new technologies and creative approaches to solve complex problems.",
        icon: "Lightbulb",
      },
      type: "GROUP" as const,
      order: 1,
    },
    {
      key: "about.values.quality",
      content: {
        title: "Quality",
        description:
          "We never compromise on code quality, design standards, or user experience.",
        icon: "Shield",
      },
      type: "GROUP" as const,
      order: 2,
    },
    {
      key: "about.values.collaboration",
      content: {
        title: "Collaboration",
        description:
          "We work closely with our clients, treating every project as a true partnership.",
        icon: "Users",
      },
      type: "GROUP" as const,
      order: 3,
    },
    {
      key: "about.values.integrity",
      content: {
        title: "Integrity",
        description:
          "We communicate honestly, deliver on our promises, and operate with full transparency.",
        icon: "Heart",
      },
      type: "GROUP" as const,
      order: 4,
    },

    // About — story page
    {
      key: "about.story.headline",
      content: { value: "Our Story" },
      type: "TEXT" as const,
    },
    {
      key: "about.story.subheadline",
      content: {
        value:
          "From a bold idea in Lira to building digital solutions for the world.",
      },
      type: "TEXT" as const,
    },

    // About — mission page headings
    {
      key: "about.mission.headline",
      content: { value: "Mission & Vision" },
      type: "TEXT" as const,
    },
    {
      key: "about.mission.subheadline",
      content: {
        value: "What drives us and where we're headed.",
      },
      type: "TEXT" as const,
    },

    // About — team page headings
    {
      key: "about.team.headline",
      content: { value: "Meet the Team" },
      type: "TEXT" as const,
    },
    {
      key: "about.team.subheadline",
      content: {
        value: "The talented people behind Rooibok Technologies.",
      },
      type: "TEXT" as const,
    },

    // Contact — working hours
    {
      key: "contact.hours",
      content: { value: "Mon - Fri: 9:00 AM - 5:00 PM EAT" },
      type: "TEXT" as const,
    },

    // Error pages
    {
      key: "error.404.headline",
      content: { value: "Page not found" },
      type: "TEXT" as const,
    },
    {
      key: "error.404.message",
      content: {
        value:
          "Oops, this page doesn't exist. It might have been moved or deleted.",
      },
      type: "TEXT" as const,
    },
    {
      key: "error.500.headline",
      content: { value: "Something went wrong" },
      type: "TEXT" as const,
    },

    // Legal
    {
      key: "legal.privacy_policy",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Privacy Policy" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "This privacy policy explains how Rooibok Technologies collects, uses, and protects your personal data. Last updated: 2026.",
              },
            ],
          },
        ],
      },
      type: "RICH_TEXT" as const,
    },
    {
      key: "legal.terms_of_service",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Terms of Service" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "These terms govern your use of the Rooibok Technologies website and services. Last updated: 2026.",
              },
            ],
          },
        ],
      },
      type: "RICH_TEXT" as const,
    },

    // Blog / Portfolio / Careers hero content blocks
    {
      key: "blog.hero.headline",
      content: { value: "Our Blog" },
      type: "TEXT" as const,
    },
    {
      key: "blog.hero.subheadline",
      content: {
        value:
          "Insights, tutorials, and stories from the Rooibok team.",
      },
      type: "TEXT" as const,
    },
    {
      key: "portfolio.hero.headline",
      content: { value: "Our Work" },
      type: "TEXT" as const,
    },
    {
      key: "portfolio.hero.subheadline",
      content: {
        value:
          "Projects we're proud of — and the stories behind them.",
      },
      type: "TEXT" as const,
    },
    {
      key: "careers.culture",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "At Rooibok Technologies, we believe that great work comes from a culture of trust, curiosity, and mutual respect. Our team operates with a high degree of autonomy — we hire talented people, give them the context they need, and trust them to deliver exceptional results. Whether you're working from our office in Lira or remotely, you'll find a collaborative environment where ideas are valued over titles.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We invest in our people through continuous learning opportunities, regular knowledge-sharing sessions, and a genuine commitment to work-life balance. We're building something meaningful here — a company that proves world-class software can come from anywhere — and we want every team member to feel ownership in that mission. If you're passionate about technology and eager to grow, Rooibok is the place for you.",
              },
            ],
          },
        ],
      },
      type: "RICH_TEXT" as const,
    },
  ];

  for (const block of contentBlocks) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: { content: block.content, type: block.type },
      create: {
        key: block.key,
        content: block.content,
        type: block.type,
        order: block.order ?? 0,
      },
    });
  }
  console.log(`  ✓ ${contentBlocks.length} content blocks created`);

  // ─── Services ───────────────────────────────────────────
  const services = [
    {
      slug: "web-development",
      name: "Web Development",
      shortDescription:
        "Full-stack web applications built with modern frameworks and best practices.",
      icon: "Globe",
      techStack: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL"],
      order: 1,
    },
    {
      slug: "mobile-apps",
      name: "Mobile App Development",
      shortDescription:
        "Cross-platform mobile applications that deliver native performance.",
      icon: "Smartphone",
      techStack: ["React Native", "Flutter", "TypeScript", "Firebase"],
      order: 2,
    },
    {
      slug: "ui-ux-design",
      name: "UI/UX Design",
      shortDescription:
        "User-centered design that looks beautiful and works intuitively.",
      icon: "Palette",
      techStack: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      order: 3,
    },
    {
      slug: "consulting",
      name: "Tech Consulting",
      shortDescription:
        "Strategic technology guidance to help your business make smart decisions.",
      icon: "MessageCircle",
      techStack: [
        "Architecture Review",
        "Tech Stack Selection",
        "Process Optimization",
      ],
      order: 4,
    },
    {
      slug: "devops",
      name: "DevOps & Cloud",
      shortDescription:
        "Reliable infrastructure, CI/CD pipelines, and cloud deployments.",
      icon: "Cloud",
      techStack: ["Docker", "AWS", "GitHub Actions", "Nginx", "Linux"],
      order: 5,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        slug: service.slug,
        name: service.name,
        shortDescription: service.shortDescription,
        fullDescription: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: `${service.shortDescription} We bring years of experience and a passion for quality to every project.`,
                },
              ],
            },
          ],
        },
        icon: service.icon,
        techStack: service.techStack,
        faqs: [
          {
            question: "How long does a typical project take?",
            answer:
              "Project timelines vary based on scope and complexity. A simple website might take 2-4 weeks, while a complex application could take 2-6 months.",
          },
          {
            question: "Do you offer ongoing support?",
            answer:
              "Yes! We provide maintenance and support packages to keep your application running smoothly after launch.",
          },
        ],
        order: service.order,
        published: true,
      },
    });
  }
  console.log(`  ✓ ${services.length} services created`);

  // ─── Blog Categories ────────────────────────────────────
  const categories = [
    { slug: "engineering", name: "Engineering" },
    { slug: "product", name: "Product" },
    { slug: "company", name: "Company" },
    { slug: "tutorials", name: "Tutorials" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`  ✓ ${categories.length} blog categories created`);

  // ─── Blog Posts ─────────────────────────────────────────
  const engCategory = await prisma.category.findUnique({
    where: { slug: "engineering" },
  });
  const companyCategory = await prisma.category.findUnique({
    where: { slug: "company" },
  });
  const tutorialsCategory = await prisma.category.findUnique({
    where: { slug: "tutorials" },
  });
  const productCategory = await prisma.category.findUnique({
    where: { slug: "product" },
  });

  await prisma.post.upsert({
    where: { slug: "welcome-to-rooibok" },
    update: {},
    create: {
      slug: "welcome-to-rooibok",
      title: "Welcome to Rooibok Technologies",
      excerpt:
        "We're excited to launch our new website. Here's what we've been building and where we're headed.",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Welcome to Rooibok Technologies! We're a software development company based in Lira, Uganda, and we're thrilled to share our journey with you through this blog.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "What We Do" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We specialize in building modern web and mobile applications using cutting-edge technologies. Our team is passionate about creating solutions that make a real difference.",
              },
            ],
          },
        ],
      },
      authorId: admin.id,
      categoryId: engCategory?.id,
      published: true,
      featured: true,
      publishedAt: new Date(),
      readTime: 3,
    },
  });

  await prisma.post.upsert({
    where: { slug: "building-scalable-apis-with-nextjs" },
    update: {},
    create: {
      slug: "building-scalable-apis-with-nextjs",
      title: "Building Scalable APIs with Next.js",
      excerpt:
        "A deep dive into how we structure API routes in Next.js for performance, maintainability, and scalability.",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Why Next.js for APIs?" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "When most developers think of Next.js, they think of server-rendered React pages. But the App Router's route handlers are a powerful tool for building production-grade APIs. At Rooibok, we've adopted a pattern that keeps our API layer clean, type-safe, and easy to maintain as projects grow.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Our API Architecture" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We separate concerns into three layers: validation with Zod schemas at the edge, business logic in dedicated service modules, and data access through Prisma queries. This separation means each layer can be tested independently and swapped out without affecting the others. Combined with TypeScript's type inference, we catch most bugs before they ever reach production.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Rate limiting, caching headers, and error handling are applied consistently through middleware, so individual route handlers stay focused on their core responsibility. The result is an API layer that scales gracefully from a handful of endpoints to hundreds.",
              },
            ],
          },
        ],
      },
      authorId: admin.id,
      categoryId: engCategory?.id,
      published: true,
      featured: false,
      publishedAt: new Date("2026-02-15"),
      readTime: 5,
    },
  });

  await prisma.post.upsert({
    where: { slug: "why-we-chose-uganda-as-our-base" },
    update: {},
    create: {
      slug: "why-we-chose-uganda-as-our-base",
      title: "Why We Chose Uganda as Our Base",
      excerpt:
        "The story behind our decision to build a global software company from Lira, Uganda.",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              { type: "text", text: "Rooted in Lira, Reaching the World" },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "When we founded Rooibok Technologies, the obvious choice would have been to set up in Kampala or Nairobi — cities with established tech ecosystems. Instead, we chose Lira, a growing city in northern Uganda with untapped potential. We believe that world-class software can be built anywhere, and we wanted to prove it.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Uganda's young, ambitious population is one of its greatest assets. By basing ourselves here, we're able to tap into a talent pool that's eager to learn and grow, while also contributing to the local economy. Our team members don't have to relocate to a capital city to do meaningful, challenging work — and that's exactly the kind of future we want to help build.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Remote work and modern collaboration tools make geography less relevant than ever for software delivery. Our clients span multiple countries, and they choose us for the quality of our work, not our postal code. Being based in Lira gives us lower overhead, a tight-knit team culture, and a genuine connection to the community we serve.",
              },
            ],
          },
        ],
      },
      authorId: admin.id,
      categoryId: companyCategory?.id,
      published: true,
      featured: true,
      publishedAt: new Date("2026-01-20"),
      readTime: 4,
    },
  });

  await prisma.post.upsert({
    where: { slug: "getting-started-with-react-native" },
    update: {},
    create: {
      slug: "getting-started-with-react-native",
      title: "Getting Started with React Native",
      excerpt:
        "A beginner-friendly guide to building your first cross-platform mobile app with React Native.",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Why React Native?" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "React Native lets you build truly native mobile apps for both iOS and Android from a single JavaScript codebase. If you already know React, you're halfway there. The framework has matured significantly over the past few years, and with the new architecture rolling out, performance is better than ever. At Rooibok, it's our go-to choice for most mobile projects.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              { type: "text", text: "Setting Up Your Environment" },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Start by installing Node.js and the Expo CLI, which provides a streamlined development experience. Expo handles the native build toolchain for you, so you can focus on writing your app instead of wrestling with Xcode or Android Studio. Run `npx create-expo-app` and you'll have a working project in under a minute.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "From there, learn the core components — View, Text, ScrollView, FlatList — and how styling works with the StyleSheet API. Navigation is handled by React Navigation, and state management patterns are identical to what you'd use in a web React app. Once you're comfortable with the basics, explore native modules for camera access, push notifications, and offline storage to build truly compelling mobile experiences.",
              },
            ],
          },
        ],
      },
      authorId: admin.id,
      categoryId: tutorialsCategory?.id,
      published: true,
      featured: false,
      publishedAt: new Date("2026-03-01"),
      readTime: 8,
    },
  });

  await prisma.post.upsert({
    where: { slug: "our-design-process-from-wireframes-to-launch" },
    update: {},
    create: {
      slug: "our-design-process-from-wireframes-to-launch",
      title: "Our Design Process: From Wireframes to Launch",
      excerpt:
        "A behind-the-scenes look at how we approach UI/UX design for client projects at Rooibok.",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              { type: "text", text: "Discovery and Research" },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Every project at Rooibok begins with a discovery phase. We sit down with stakeholders to understand the business goals, target audience, and competitive landscape. This isn't a formality — it's where we uncover the insights that shape every design decision that follows. We create user personas, map out key user journeys, and define success metrics before a single pixel is placed.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              {
                type: "text",
                text: "From Wireframes to High-Fidelity Prototypes",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Low-fidelity wireframes come first — rough layouts that let us iterate on structure and flow without getting attached to visual details. Once the information architecture is validated, we move to high-fidelity prototypes in Figma. These are interactive, pixel-perfect representations of the final product that clients can click through and test with real users before we write any code.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Design and development happen in close collaboration at Rooibok. Our designers use a component-based approach that maps directly to our frontend architecture, which means the handoff is seamless. By the time we reach launch day, the product has been tested, refined, and polished through multiple rounds of feedback — and it shows.",
              },
            ],
          },
        ],
      },
      authorId: admin.id,
      categoryId: productCategory?.id,
      published: true,
      featured: false,
      publishedAt: new Date("2026-03-10"),
      readTime: 6,
    },
  });
  console.log("  ✓ 5 blog posts created");

  // ─── Tags ───────────────────────────────────────────────
  const tagData = [
    { slug: "nextjs", name: "Next.js" },
    { slug: "react", name: "React" },
    { slug: "typescript", name: "TypeScript" },
    { slug: "mobile", name: "Mobile" },
    { slug: "design", name: "Design" },
    { slug: "devops", name: "DevOps" },
    { slug: "tutorial", name: "Tutorial" },
    { slug: "startup", name: "Startup" },
  ];

  for (const tag of tagData) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log(`  ✓ ${tagData.length} tags created`);

  // Connect tags to posts
  await prisma.post.update({
    where: { slug: "welcome-to-rooibok" },
    data: { tags: { connect: [{ slug: "startup" }] } },
  });
  await prisma.post.update({
    where: { slug: "building-scalable-apis-with-nextjs" },
    data: {
      tags: {
        connect: [
          { slug: "nextjs" },
          { slug: "typescript" },
          { slug: "devops" },
        ],
      },
    },
  });
  await prisma.post.update({
    where: { slug: "why-we-chose-uganda-as-our-base" },
    data: { tags: { connect: [{ slug: "startup" }] } },
  });
  await prisma.post.update({
    where: { slug: "getting-started-with-react-native" },
    data: {
      tags: {
        connect: [
          { slug: "react" },
          { slug: "mobile" },
          { slug: "tutorial" },
        ],
      },
    },
  });
  await prisma.post.update({
    where: { slug: "our-design-process-from-wireframes-to-launch" },
    data: { tags: { connect: [{ slug: "design" }] } },
  });
  console.log("  ✓ Tags connected to posts");

  // ─── Projects ───────────────────────────────────────────
  await prisma.project.upsert({
    where: { slug: "sample-project" },
    update: {},
    create: {
      slug: "sample-project",
      title: "Sample Project",
      client: "Demo Client",
      shortDescription:
        "A showcase project demonstrating our web development capabilities.",
      description: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "This is a sample project to demonstrate the portfolio section. Replace with real project details.",
              },
            ],
          },
        ],
      },
      coverImage: "/images/placeholder-project.jpg",
      images: [],
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
      published: true,
      featured: true,
    },
  });

  await prisma.project.upsert({
    where: { slug: "agroconnect-mobile-app" },
    update: {},
    create: {
      slug: "agroconnect-mobile-app",
      title: "AgroConnect Mobile App",
      client: "AgroConnect Ltd",
      shortDescription:
        "A mobile platform connecting smallholder farmers with buyers, real-time market prices, and agricultural advisory services across northern Uganda.",
      description: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "AgroConnect needed a mobile solution that would work reliably in areas with limited connectivity while providing real-time market data to smallholder farmers. The app needed to be intuitive enough for users with varying levels of digital literacy, yet powerful enough to handle complex supply chain logistics.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We built a cross-platform mobile app with offline-first architecture, ensuring farmers could access critical information even without an internet connection. The platform includes a marketplace for produce listings, a price tracking dashboard, and an advisory module with localized agricultural content.",
              },
            ],
          },
        ],
      },
      challenge: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "The primary challenge was building an app that performed well in low-bandwidth environments while still providing real-time data synchronization. Many target users had basic smartphones, so the app needed to be lightweight and battery-efficient.",
              },
            ],
          },
        ],
      },
      solution: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We implemented an offline-first architecture using local SQLite storage with background sync when connectivity was available. Push notifications via Firebase kept users informed of price changes, and the UI was designed with large touch targets and simple navigation flows for accessibility.",
              },
            ],
          },
        ],
      },
      result: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Within six months of launch, the app onboarded over 2,000 farmers and facilitated more than UGX 500 million in transactions. User engagement increased by 300% compared to the client's previous SMS-based system.",
              },
            ],
          },
        ],
      },
      testimonial: {
        quote:
          "Rooibok understood our users deeply. The app they built is transforming how farmers in northern Uganda access markets and information.",
        author: "James K.",
        role: "Founder, AgroConnect Ltd",
      },
      coverImage: "/images/placeholder-project.jpg",
      images: [],
      techStack: ["React Native", "Node.js", "PostgreSQL", "Firebase"],
      published: true,
      featured: true,
    },
  });

  await prisma.project.upsert({
    where: { slug: "lira-commerce-hub" },
    update: {},
    create: {
      slug: "lira-commerce-hub",
      title: "Lira Commerce Hub",
      client: "Lira Chamber of Commerce",
      shortDescription:
        "A comprehensive web platform for the Lira Chamber of Commerce, featuring a business directory, event management, and member portal.",
      description: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "The Lira Chamber of Commerce needed a modern digital presence to serve its members and promote local businesses. The existing website was outdated, difficult to update, and lacked the interactive features members were requesting.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We delivered a full-featured web platform with a searchable business directory, event calendar with online registration, member dashboard for managing profiles and dues, and a content management system that chamber staff could update without developer assistance.",
              },
            ],
          },
        ],
      },
      challenge: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "The Chamber needed a platform that non-technical staff could manage day-to-day, while also being sophisticated enough to handle member payments, event registrations, and a growing directory of businesses with complex categorization.",
              },
            ],
          },
        ],
      },
      solution: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We built a Next.js application with a custom admin dashboard using an intuitive drag-and-drop interface for content management. Prisma ORM ensured type-safe data access, and Tailwind CSS enabled rapid UI development with a consistent design language throughout the platform.",
              },
            ],
          },
        ],
      },
      result: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "The new platform increased member engagement by 150% and reduced the administrative workload for chamber staff by automating event registrations and membership renewals. The business directory became a go-to resource for people looking for services in Lira.",
              },
            ],
          },
        ],
      },
      testimonial: {
        quote:
          "Professional, innovative, and reliable. Rooibok delivered exactly what our members needed — and the platform practically runs itself.",
        author: "Grace N.",
        role: "Operations Director, Lira Chamber of Commerce",
      },
      coverImage: "/images/placeholder-project.jpg",
      images: [],
      techStack: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS"],
      published: true,
      featured: false,
    },
  });

  await prisma.project.upsert({
    where: { slug: "techstart-dashboard" },
    update: {},
    create: {
      slug: "techstart-dashboard",
      title: "TechStart Dashboard",
      client: "TechStart Uganda",
      shortDescription:
        "An analytics dashboard for TechStart Uganda to track startup ecosystem metrics, mentor matching, and program outcomes across their incubator network.",
      description: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "TechStart Uganda runs one of the largest startup incubator programs in northern Uganda. They needed a centralized dashboard to track key performance indicators across their portfolio of startups, manage mentor-mentee relationships, and generate reports for stakeholders and funding partners.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We designed and built a data-rich analytics platform with interactive visualizations, automated reporting, and a mentor matching system powered by skills-based algorithms. The dashboard aggregates data from multiple sources and presents it in an intuitive, actionable format.",
              },
            ],
          },
        ],
      },
      challenge: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Data was scattered across spreadsheets, email threads, and disconnected tools. The team spent hours each week manually compiling reports, and there was no systematic way to track startup progress or measure program impact over time.",
              },
            ],
          },
        ],
      },
      solution: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We built a React-based SPA with D3.js for custom data visualizations and a Node.js backend connected to MongoDB for flexible document storage. The dashboard features real-time data syncing, exportable PDF reports, and role-based access controls for different stakeholder groups.",
              },
            ],
          },
        ],
      },
      result: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Report generation time dropped from 8 hours per week to under 15 minutes. The mentor matching system improved pairing satisfaction scores by 40%, and stakeholders gained real-time visibility into program outcomes for the first time.",
              },
            ],
          },
        ],
      },
      testimonial: {
        quote:
          "Rooibok delivered our platform ahead of schedule with exceptional quality. Their attention to detail and communication throughout the process was outstanding.",
        author: "Sarah M.",
        role: "CEO, TechStart Uganda",
      },
      coverImage: "/images/placeholder-project.jpg",
      images: [],
      techStack: ["React", "D3.js", "Node.js", "MongoDB"],
      published: true,
      featured: true,
    },
  });
  console.log("  ✓ 4 projects created");

  // Connect projects to services
  await prisma.project.update({
    where: { slug: "agroconnect-mobile-app" },
    data: { services: { connect: [{ slug: "mobile-apps" }] } },
  });
  await prisma.project.update({
    where: { slug: "lira-commerce-hub" },
    data: { services: { connect: [{ slug: "web-development" }] } },
  });
  await prisma.project.update({
    where: { slug: "techstart-dashboard" },
    data: {
      services: {
        connect: [{ slug: "web-development" }, { slug: "ui-ux-design" }],
      },
    },
  });
  console.log("  ✓ Projects connected to services");

  // ─── Team Members ───────────────────────────────────────
  await prisma.teamMember.upsert({
    where: { id: "team-philip-ayo" },
    update: {},
    create: {
      id: "team-philip-ayo",
      name: "Philip Ayo",
      role: "Founder & Lead Developer",
      bio: "Philip founded Rooibok Technologies with a vision to build world-class software from Lira, Uganda. With a passion for clean architecture and scalable systems, he leads the technical direction of every project and mentors the growing development team.",
      order: 1,
      published: true,
    },
  });

  await prisma.teamMember.upsert({
    where: { id: "team-grace-amono" },
    update: {},
    create: {
      id: "team-grace-amono",
      name: "Grace Amono",
      role: "UI/UX Designer",
      bio: "Grace brings a keen eye for detail and a deep understanding of user behavior to every design she creates. She specializes in translating complex requirements into intuitive, beautiful interfaces that users love.",
      order: 2,
      published: true,
    },
  });

  await prisma.teamMember.upsert({
    where: { id: "team-daniel-okello" },
    update: {},
    create: {
      id: "team-daniel-okello",
      name: "Daniel Okello",
      role: "Backend Developer",
      bio: "Daniel is passionate about building robust, high-performance backend systems. He specializes in API design, database optimization, and cloud infrastructure, ensuring that every application Rooibok delivers is fast, secure, and reliable.",
      order: 3,
      published: true,
    },
  });

  // Update existing placeholder to James Odong
  await prisma.teamMember.upsert({
    where: { id: "team-placeholder" },
    update: {
      name: "James Odong",
      role: "Mobile Developer",
      bio: "James is a skilled mobile developer who thrives on creating smooth, performant cross-platform apps. With deep expertise in React Native and a growing interest in native iOS development, he ensures Rooibok's mobile projects exceed client expectations.",
      order: 4,
    },
    create: {
      id: "team-placeholder",
      name: "James Odong",
      role: "Mobile Developer",
      bio: "James is a skilled mobile developer who thrives on creating smooth, performant cross-platform apps. With deep expertise in React Native and a growing interest in native iOS development, he ensures Rooibok's mobile projects exceed client expectations.",
      order: 4,
      published: true,
    },
  });
  console.log("  ✓ 4 team members created");

  // ─── Jobs ───────────────────────────────────────────────
  await prisma.job.upsert({
    where: { slug: "full-stack-developer" },
    update: {},
    create: {
      slug: "full-stack-developer",
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Lira, Uganda / Remote",
      type: "FULL_TIME",
      shortDescription:
        "Join our team and help build innovative web applications.",
      description: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "About the Role" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We're looking for a Full Stack Developer to join our growing team. You'll work on exciting projects using modern technologies like Next.js, TypeScript, and PostgreSQL.",
              },
            ],
          },
        ],
      },
      published: true,
      publishedAt: new Date(),
    },
  });

  await prisma.job.upsert({
    where: { slug: "ui-ux-designer" },
    update: {},
    create: {
      slug: "ui-ux-designer",
      title: "UI/UX Designer",
      department: "Design",
      location: "Lira, Uganda",
      type: "FULL_TIME",
      shortDescription:
        "Design intuitive, beautiful interfaces for web and mobile applications that delight users and solve real problems.",
      description: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "About the Role" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We're looking for a talented UI/UX Designer to join our design team in Lira. You'll work closely with developers and clients to create user-centered designs for web and mobile applications. You should be proficient in Figma, have a strong portfolio demonstrating your design process, and be comfortable conducting user research and usability testing.",
              },
            ],
          },
        ],
      },
      published: true,
      publishedAt: new Date(),
    },
  });

  await prisma.job.upsert({
    where: { slug: "marketing-intern" },
    update: {},
    create: {
      slug: "marketing-intern",
      title: "Marketing Intern",
      department: "Marketing",
      location: "Remote",
      type: "INTERNSHIP",
      shortDescription:
        "Gain hands-on experience in digital marketing, content creation, and social media management at a growing tech company.",
      description: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "About the Role" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "This internship is a great opportunity to learn digital marketing in a hands-on environment. You'll help manage our social media channels, create content for our blog and newsletter, assist with SEO strategy, and support campaign planning. We're looking for someone who is creative, eager to learn, and passionate about technology and storytelling.",
              },
            ],
          },
        ],
      },
      published: true,
      publishedAt: new Date(),
    },
  });
  console.log("  ✓ 3 job listings created");

  // ─── Milestones ─────────────────────────────────────────
  await prisma.milestone.upsert({
    where: { id: "milestone-founded" },
    update: {},
    create: {
      id: "milestone-founded",
      date: new Date("2024-01-01"),
      title: "Rooibok Technologies Founded",
      description:
        "The journey begins — Rooibok Technologies is officially launched in Lira, Uganda.",
      order: 1,
    },
  });

  await prisma.milestone.upsert({
    where: { id: "milestone-first-client" },
    update: {},
    create: {
      id: "milestone-first-client",
      date: new Date("2024-06-01"),
      title: "First Client Project Delivered",
      description:
        "We delivered our first client project on time and on budget, marking the beginning of a growing portfolio.",
      order: 2,
    },
  });

  await prisma.milestone.upsert({
    where: { id: "milestone-team-grows" },
    update: {},
    create: {
      id: "milestone-team-grows",
      date: new Date("2025-01-15"),
      title: "Team Grows to 5 Members",
      description:
        "Our team expanded to five talented individuals, bringing new expertise in design, mobile development, and backend engineering.",
      order: 3,
    },
  });

  await prisma.milestone.upsert({
    where: { id: "milestone-new-website" },
    update: {},
    create: {
      id: "milestone-new-website",
      date: new Date("2026-03-01"),
      title: "Launch of New Website",
      description:
        "We launched our fully redesigned website — a dynamic, admin-managed platform showcasing our work and capabilities.",
      order: 4,
    },
  });
  console.log("  ✓ 4 milestones created");

  // ─── Sample Popup ───────────────────────────────────────
  await prisma.popup.create({
    data: {
      name: "Welcome Banner",
      title: "Welcome to Rooibok!",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We're glad you're here. Explore our services and see how we can help bring your ideas to life.",
              },
            ],
          },
        ],
      },
      type: "BANNER",
      trigger: "ON_LOAD",
      pages: ["*"],
      frequency: "ONCE_PER_SESSION",
      active: false, // disabled by default
      ctaText: "Explore Services",
      ctaLink: "/services",
      order: 1,
    },
  });
  console.log("  ✓ Sample popup created");

  console.log("\n✅ Database seeded successfully!");
  console.log("   Admin login: admin@rooibok.com / ChangeMe!2024#Rooibok");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
