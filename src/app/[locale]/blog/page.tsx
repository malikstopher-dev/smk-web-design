import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { FadeIn } from "@/components/motion"
import { JsonLd, SITE_URL, breadcrumbSchema, websiteSchema } from "@/components/json-ld"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { HTML_LANG } from "@/i18n/config"
import { getDict } from "@/i18n/index"
import { BLOG_POSTS } from "@/lib/posts"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const d = getDict(locale)
  return {
    title: d.blogPage.metaTitle,
    description: d.blogPage.metaDesc,
    alternates: { canonical: `/${locale}/blog` },
    openGraph: { url: `${SITE_URL}/${locale}/blog` },
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const d = getDict(locale)
  const lp = (path: string) => `/${locale}${path}`

  const isEn = locale === "en"

  return (
    <>
      <JsonLd data={websiteSchema(HTML_LANG[locale as keyof typeof HTML_LANG] ?? "en-ZA")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, path: `/${locale}` },
          { name: d.nav.blog, path: lp("/blog") },
        ])}
      />

      <PageHero
        eyebrow={d.nav.blog}
        title={d.blogPage.title}
        lede={d.blogPage.lede}
      />

      <section className="smk-container">
        {isEn ? (
          <ol className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post, i) => (
              <FadeIn key={post.slug} delay={(i % 3) * 0.08}>
                <li>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="group block"
                  >
                    <h2 className="text-lg font-medium text-white transition-colors group-hover:text-gray-200 sm:text-xl">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-400 line-clamp-3">
                      {post.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-gray-500 transition-colors group-hover:text-white">
                      {d.blogPage.readCta}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </li>
              </FadeIn>
            ))}
          </ol>
        ) : (
          <div className="border-t border-white/15 pt-8 text-center">
            <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
              {d.blogPage.comingSoonTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400">
              {d.blogPage.comingSoonBody}
            </p>
            <Link
              href="/en/blog"
              className="smk-link mt-6 inline-flex items-center gap-1.5 text-sm text-white"
            >
              {d.blogPage.readCta} (EN)
            </Link>
          </div>
        )}

        <Reveal className="mt-24">
          <div className="border-t border-white/15 pt-8">
            <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
              {d.blogPage.ctaTitle}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400">
              {d.blogPage.ctaBody}
            </p>
            <Link
              href={lp("/contact")}
              className="smk-link mt-6 inline-flex items-center gap-1.5 text-sm text-white"
            >
              {d.blogPage.ctaButton}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
