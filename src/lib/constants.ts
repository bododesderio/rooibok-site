export const SITE_NAME = "Rooibok Technologies";
export const SITE_DESCRIPTION =
  "Building innovative digital solutions in Lira, Uganda and beyond.";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Who We Are", href: "/about" },
      { label: "Mission & Vision", href: "/about/mission" },
      { label: "The Team", href: "/about/team" },
      { label: "Our Story", href: "/about/story" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIAL_PLATFORMS = [
  "instagram",
  "facebook",
  "linkedin",
  "x",
  "tiktok",
] as const;

export const ADMIN_NAV_LINKS = [
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
] as const;
