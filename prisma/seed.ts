import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin User ─────────────────────────────────────────
  const adminPassword = await hash("admin123", 12);
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

  // ─── Sample Blog Post ───────────────────────────────────
  const engCategory = await prisma.category.findUnique({
    where: { slug: "engineering" },
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
  console.log("  ✓ Sample blog post created");

  // ─── Sample Project ─────────────────────────────────────
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
  console.log("  ✓ Sample project created");

  // ─── Team Members ───────────────────────────────────────
  await prisma.teamMember.upsert({
    where: { id: "team-placeholder" },
    update: {},
    create: {
      id: "team-placeholder",
      name: "Team Member",
      role: "Founder & Developer",
      bio: "Passionate about building great software.",
      order: 1,
      published: true,
    },
  });
  console.log("  ✓ Team member placeholder created");

  // ─── Sample Job ─────────────────────────────────────────
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
  console.log("  ✓ Sample job listing created");

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
  console.log("  ✓ Milestone created");

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
  console.log("   Admin login: admin@rooibok.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
