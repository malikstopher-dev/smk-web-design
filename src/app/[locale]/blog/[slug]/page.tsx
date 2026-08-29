import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
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
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${SITE_URL}/${locale}/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()
  if (locale !== "en") {
    redirect(`/en/blog/${post.slug}`)
  }
  const d = getDict(locale)
  const lp = (path: string) => `/${locale}${path}`

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

      <article className="smk-container smk-page">
        <HeroIn>
          <Link
            href={lp("/blog")}
            className="smk-link inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-gray-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {d.blogPost.backLabel}
          </Link>
        </HeroIn>

        <HeroIn delay={0.08}>
          <span className="mt-8 inline-block text-xs uppercase tracking-[0.14em] text-gray-500">
            {post.category}
          </span>
          <h1 className="mt-3 max-w-[var(--col-9)] text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-xs text-gray-500">{post.meta}</p>
        </HeroIn>

        <HeroIn delay={0.16}>
          <div
            className="blog-prose mt-12"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </HeroIn>

        <div className="mt-24 border-t border-white/15 pt-8">
          <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
            {d.ctaBand.title}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">
            {d.ctaBand.body}
          </p>
          <Link
            href={lp("/contact")}
            className="smk-link mt-6 inline-flex items-center gap-1.5 text-sm text-white"
          >
            {d.hero.quoteCta}
          </Link>
        </div>

        <h2 className="mt-24 text-sm uppercase tracking-[0.14em] text-gray-500">
          {d.blogPost.relatedLabel}
        </h2>
        <ol className="mt-6 grid grid-cols-1 gap-x-[var(--gutter)] gap-y-8 sm:grid-cols-3">
          {related.map((r) => (
            <li key={r.slug}>
              <Link
                href={lp(`/blog/${r.slug}`)}
                className="group block"
              >
                <span className="text-xs uppercase tracking-[0.12em] text-gray-500">
                  {r.category}
                </span>
                <span className="mt-2 block text-sm font-medium text-white transition-colors group-hover:text-gray-200">
                  {r.title}
                </span>
                <ArrowUpRight className="mt-3 h-4 w-4 text-gray-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            </li>
          ))}
        </ol>
      </article>
    </>
  )
}
