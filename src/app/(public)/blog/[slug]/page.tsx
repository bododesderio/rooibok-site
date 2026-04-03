import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getRelatedPosts } from "@/server/queries/posts";
import { getContentBlock } from "@/server/queries/content";
import { TiptapRenderer } from "@/components/shared/tiptap-renderer";
import { CtaBanner } from "@/components/shared/cta-banner";
import { ShareButtons } from "@/components/shared/share-buttons";
import { TableOfContents } from "@/components/shared/table-of-contents";
import { FadeIn } from "@/components/effects/fade-in";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Blog | Rooibok Technologies`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

// Extract headings from Tiptap JSON for table of contents
function extractHeadings(
  content: { type: string; content?: unknown[]; attrs?: Record<string, unknown> }[]
) {
  const headings: { level: number; text: string; id: string }[] = [];
  for (const node of content) {
    if (node.type === "heading" && node.content) {
      const text = (node.content as { text?: string }[])
        .map((n) => n.text ?? "")
        .join("");
      const level = (node.attrs?.level as number) ?? 2;
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      headings.push({ level, text, id });
    }
  }
  return headings;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const [relatedPosts, ctaHeadline, ctaButton] = await Promise.all([
    getRelatedPosts(post.id, post.categoryId),
    getContentBlock("cta.default.headline", "Ready to build something great?"),
    getContentBlock("cta.default.button", "Get in Touch"),
  ]);

  const postContent = post.content as {
    type: string;
    content?: { type: string; content?: unknown[]; attrs?: Record<string, unknown> }[];
  };
  const headings = postContent.content ? extractHeadings(postContent.content) : [];
  const postUrl = `https://rooibok.com/blog/${post.slug}`;

  const socialLinks = post.author.socialLinks as Record<string, string> | null;

  return (
    <>
      {/* Back link */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <FadeIn>
          <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative max-h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--highlight)]/20">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </FadeIn>
      )}

      {/* Header */}
      <FadeIn>
        <header className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--foreground-muted)]">
            {post.category && (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="rounded-full bg-[var(--accent)]/10 px-3 py-0.5 text-xs font-medium text-[var(--accent)]"
              >
                {post.category.name}
              </Link>
            )}
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            {post.readTime && <span>{post.readTime} min read</span>}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            {post.title}
          </h1>

          {/* Author */}
          <div className="mt-6 flex items-center gap-3">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/20 text-sm font-bold text-[var(--accent)]">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {post.author.name}
              </p>
              {post.author.bio && (
                <p className="text-xs text-[var(--foreground-muted)]">
                  {post.author.bio}
                </p>
              )}
            </div>
          </div>
        </header>
      </FadeIn>

      {/* Content + Sidebar */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:flex lg:gap-10 lg:px-8">
        {/* Main content */}
        <article className="min-w-0 flex-1">
          <TiptapRenderer
            content={post.content as Parameters<typeof TiptapRenderer>[0]["content"]}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-10 border-t border-[var(--border)] pt-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs text-[var(--foreground-muted)]"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-6 border-t border-[var(--border)] pt-6">
            <ShareButtons title={post.title} url={postUrl} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="mt-10 w-full shrink-0 lg:mt-0 lg:w-72">
          <div className="sticky top-8 space-y-6">
            {/* Table of Contents */}
            {headings.length > 0 && <TableOfContents items={headings} />}

            {/* Author card */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center gap-3">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/20 font-bold text-[var(--accent)]">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {post.author.name}
                  </p>
                </div>
              </div>
              {post.author.bio && (
                <p className="mt-3 text-sm text-[var(--foreground-muted)]">
                  {post.author.bio}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Related Posts
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <FadeIn key={rp.id}>
                  <Link
                    href={`/blog/${rp.slug}`}
                    className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[var(--accent)]/20 to-[var(--highlight)]/20">
                      {rp.coverImage && (
                        <img
                          src={rp.coverImage}
                          alt={rp.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                        {rp.title}
                      </h3>
                      {rp.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm text-[var(--foreground-muted)]">
                          {rp.excerpt}
                        </p>
                      )}
                      <p className="mt-3 text-xs text-[var(--foreground-muted)]">
                        {rp.publishedAt && formatDate(rp.publishedAt)}
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title={ctaHeadline}
        subtitle="Let's talk about your next project."
        buttonText={ctaButton}
        buttonHref="/contact"
      />
    </>
  );
}
