import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { HeroIn } from "@/components/motion"
import { JsonLd, SITE_URL, breadcrumbSchema } from "@/components/json-ld"
import { getDict } from "@/i18n/index"
import { BLOG_POSTS, getBlogPost } from "@/lib/posts"

export async function generateStaticParams({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  if (locale !== "en") return []
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/${locale}/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: "article" },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const d = getDict(locale)
  const lp = (path: string) => `/${locale}${path}`
  const post = getBlogPost(slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => (a.category === post.category ? -1 : b.category === post.category ? 1 : 0))
    .slice(0, 3)

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          author: { "@type": "Person", name: "Stopher Malik", url: SITE_URL },
          publisher: { "@type": "Organization", name: "SMK Web Design" },
          mainEntityOfPage: `${SITE_URL}${lp(`/blog/${post.slug}`)}`,
          articleSection: post.category,
          inLanguage: "en",
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, path: `/${locale}` },
          { name: d.nav.blog, path: lp("/blog") },
          { name: post.title, path: lp(`/blog/${post.slug}`) },
        ])}
      />

      <article className="mx-auto max-w-3xl px-6 pb-16 pt-16 sm:pt-24">
        <HeroIn>
          <Link
            href={lp("/blog")}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-700 px-4 text-xs font-medium text-gray-400 transition-colors hover:border-white hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {d.blogPost.backLabel}
          </Link>
        </HeroIn>

        <HeroIn delay={0.08}>
          <span className="mt-8 inline-flex items-center rounded-full border border-gray-700 px-2.5 py-0.5 text-[11px] font-medium text-gray-400">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">{post.meta}</p>
        </HeroIn>

        {locale !== "en" && (
          <p className="mt-6 rounded-2xl border border-gray-800 bg-[#0a1220]/60 px-5 py-3.5 text-sm italic text-gray-400">
            {d.blogPost.untranslatedNote}
          </p>
        )}

        <HeroIn delay={0.16}>
          <div
            className="blog-prose mt-10"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </HeroIn>

        <div className="mt-16 rounded-3xl border border-gray-800 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {d.ctaBand.title}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            {d.ctaBand.body}
          </p>
          <Link
            href={lp("/contact")}
            className="mt-5 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 transition-colors hover:bg-gray-200"
          >
            {d.hero.quoteCta}
          </Link>
        </div>

        <h2 className="mt-16 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {d.blogPost.relatedLabel}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={lp(`/blog/${r.slug}`)}
              className="group rounded-2xl border border-gray-800 p-5 transition-colors hover:border-gray-600"
            >
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                {r.category}
              </span>
              <span className="mt-2 block font-display text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                {r.title}
              </span>
              <ArrowUpRight className="mt-3 h-4 w-4 text-gray-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          ))}
        </div>
      </article>
    </>
  )
}
