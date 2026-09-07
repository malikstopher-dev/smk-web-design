import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { FadeIn } from "@/components/motion"
import { Magnetic } from "@/components/magnetic"
import { JsonLd, SITE_URL, breadcrumbSchema, websiteSchema } from "@/components/json-ld"
import { InnerHero } from "@/components/inner-hero"
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

      <InnerHero eyebrow={d.nav.blog} heading={d.blogPage.title} subtext={d.blogPage.lede} scene="blog" />

      <section className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="editorial-divider mb-12" />
        {isEn ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {BLOG_POSTS.map((post, i) => (
                <FadeIn key={post.slug} delay={(i % 3) * 0.08} className="h-full">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="group flex h-full flex-col border border-white/[0.06] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span className="inline-flex w-fit items-center rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/40">
                      {post.category}
                    </span>
                    <h2 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight text-white">
                      {post.title}
                    </h2>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-white/35">
                      {post.description}
                    </p>
                    <span className="mt-auto flex items-center justify-between pt-5 text-xs text-white/30">
                      {d.blogPage.readCta}
                      <ArrowUpRight className="h-4 w-4 text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/60" />
                    </span>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </>
        ) : (
          <div className="border border-white/[0.06] p-8 text-center sm:p-12">
            <h2 className="display-md text-white">
              {d.blogPage.comingSoonTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/35">
              {d.blogPage.comingSoonBody}
            </p>
            <Link
              href="/en/blog"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white bg-white px-6 text-sm font-medium text-gray-900 shadow-lg shadow-white/10 transition-colors hover:bg-gray-200"
            >
              {d.blogPage.readCta} (EN)
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <Reveal className="mt-16">
          <div className="border border-white/[0.06] p-8 text-center sm:p-12">
            <h2 className="display-md text-white">
              {d.blogPage.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/35">
              {d.blogPage.ctaBody}
            </p>
            <Magnetic strength={0.25} maxShift={4}>
              <Link
                href={lp("/contact")}
                className="mt-6 inline-flex h-11 items-center rounded-full border border-white bg-white px-6 text-sm font-medium text-gray-900 shadow-lg shadow-white/10 transition-colors hover:bg-gray-200"
              >
                {d.blogPage.ctaButton}
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  )
}
