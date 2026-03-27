import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  x?: string;
  tiktok?: string;
};

export type FooterColumn = {
  heading: string;
  links: { label: string; url: string }[];
};

export type FooterConfig = {
  columns: FooterColumn[];
  copyright: string;
};

export type NavConfig = {
  ctaText: string;
  ctaLink: string;
};

export const getSiteSettings = unstable_cache(
  async () => {
    const settings = await db.siteSettings.findUnique({
      where: { id: "default" },
    });
    return settings;
  },
  ["site-settings"],
  { tags: ["settings"], revalidate: 3600 }
);

export async function getSocialLinks(): Promise<SocialLinks> {
  const settings = await getSiteSettings();
  return (settings?.socialLinks as SocialLinks) ?? {};
}

export async function getFooterConfig(): Promise<FooterConfig | null> {
  const settings = await getSiteSettings();
  return (settings?.footerConfig as FooterConfig) ?? null;
}

export async function getNavConfig(): Promise<NavConfig | null> {
  const settings = await getSiteSettings();
  return (settings?.navConfig as NavConfig) ?? null;
}
