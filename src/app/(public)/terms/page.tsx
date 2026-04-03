import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { TiptapRenderer } from "@/components/shared/tiptap-renderer";
import { getContentBlockRaw } from "@/server/queries/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the terms and conditions for using Rooibok Technologies services.",
};

export default async function TermsPage() {
  const content = await getContentBlockRaw("legal.terms_of_service");

  return (
    <>
      <PageHero title="Terms of Service" />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <TiptapRenderer content={content as never} />
        </div>
      </section>
    </>
  );
}
