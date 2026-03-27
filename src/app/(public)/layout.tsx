import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import {
  getSiteSettings,
  getSocialLinks,
  getFooterConfig,
  getNavConfig,
} from "@/server/queries/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, socialLinks, footerConfig, navConfig] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
    getFooterConfig(),
    getNavConfig(),
  ]);

  return (
    <>
      <Navbar navConfig={navConfig} />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer
        companyName={settings?.companyName ?? "Rooibok Technologies"}
        tagline={settings?.tagline ?? ""}
        socialLinks={socialLinks}
        footerConfig={footerConfig}
      />
    </>
  );
}
