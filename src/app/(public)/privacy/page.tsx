import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { TiptapRenderer } from "@/components/shared/tiptap-renderer";
import { getContentBlockRaw } from "@/server/queries/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Rooibok Technologies collects, uses, and protects your personal information.",
};

export default async function PrivacyPage() {
  const content = await getContentBlockRaw("legal.privacy_policy");

  return (
    <>
      <PageHero title="Privacy Policy" />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <TiptapRenderer content={content as never} />
        </div>
      </section>
    </>
  );
}
