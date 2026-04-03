import type { Metadata } from "next";
import Link from "next/link";
import { getContentBlock } from "@/server/queries/content";
import {
  getPublishedPosts,
  getCategories,
  searchPosts,
} from "@/server/queries/posts";
import { PageHero } from "@/components/shared/page-hero";
import { CtaBanner } from "@/components/shared/cta-banner";
import { BlogSearch } from "@/components/shared/blog-search";
import { FadeIn } from "@/components/effects/fade-in";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog | Rooibok Technologies",
  description: "Insights, tutorials, and stories from the Rooibok team.",
};

type Props = {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const categorySlug = params.category;
  const searchQuery = params.search;

  const [headline, subheadline, ctaHeadline, ctaButton, categories] =
    await Promise.all([
      getContentBlock("blog.hero.headline", "Our Blog"),
      getContentBlock(
        "blog.hero.subheadline",
        "Insights, tutorials, and stories from the Rooibok team."
      ),
      getContentBlock("cta.default.headline", "Ready to build something great?"),
      getContentBlock("cta.default.button", "Get in Touch"),
      getCategories(),
    ]);

  // Fetch posts based on search or category filter
  const { posts, total, pages } = searchQuery
    ? await searchPosts(searchQuery, page)
    : await getPublishedPosts({ page, categorySlug: categorySlug || undefined });

  return (
    <>
      <PageHero title={headline} subtitle={subheadline} />

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !categorySlug && !searchQuery
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "bg-[var(--surface)] text-[var(--foreground-muted)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  categorySlug === cat.slug
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "bg-[var(--surface)] text-[var(--foreground-muted)] hover:bg-[var(--surface-raised)]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <BlogSearch />
        </div>
      </div>

      {/* Posts grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {searchQuery && (
          <p className="mb-6 text-sm text-[var(--foreground-muted)]">
            {total} result{total !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
            <Link href="/blog" className="ml-2 text-[var(--accent)] hover:underline">
              Clear
            </Link>
          </p>
        )}

        {posts.length === 0 ? (
          <p className="py-12 text-center text-[var(--foreground-muted)]">
            No posts found. Check back soon!
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <FadeIn key={post.id} delay={i * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-lg"
                >
                  {/* Cover image */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[var(--accent)]/20 to-[var(--highlight)]/20">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    {post.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent-foreground)]">
                        {post.category.name}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--foreground-muted)]">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                      <div className="flex items-center gap-2">
                        {post.author.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[8px] font-bold text-[var(--accent)]">
                            {post.author.name.charAt(0)}
                          </div>
                        )}
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {post.readTime && <span>{post.readTime} min read</span>}
                        {post.publishedAt && (
                          <span>{formatDate(post.publishedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {page > 1 && (
              <Link
                href={`/blog?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  ...(searchQuery ? { search: searchQuery } : {}),
                  page: String(page - 1),
                }).toString()}`}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface)]"
              >
                Previous
              </Link>
            )}
            <span className="text-sm text-[var(--foreground-muted)]">
              Page {page} of {pages}
            </span>
            {page < pages && (
              <Link
                href={`/blog?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  ...(searchQuery ? { search: searchQuery } : {}),
                  page: String(page + 1),
                }).toString()}`}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface)]"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </section>

      <CtaBanner
        title={ctaHeadline}
        subtitle="Let's talk about your next project."
        buttonText={ctaButton}
        buttonHref="/contact"
      />
    </>
  );
}
