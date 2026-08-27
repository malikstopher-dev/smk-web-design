import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { FadeIn } from "@/components/motion"
import { Magnetic } from "@/components/magnetic"
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

      <PageHero eyebrow={d.nav.blog} title={d.blogPage.title} lede={d.blogPage.lede} />

      <section className="mx-auto max-w-6xl px-6 sm:px-10">
        {isEn ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {BLOG_POSTS.map((post, i) => (
                <FadeIn key={post.slug} delay={(i % 3) * 0.08} className="h-full">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-gray-800 bg-[#050a14]/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gray-600 hover:shadow-2xl hover:shadow-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span className="inline-flex w-fit items-center rounded-full border border-gray-700 px-2.5 py-0.5 text-[11px] font-medium text-gray-400">
                      {post.category}
                    </span>
                    <h2 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight text-gray-900 dark:text-white">
                      {post.title}
                    </h2>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {post.description}
                    </p>
                    <span className="mt-auto flex items-center justify-between pt-5 text-xs text-gray-500 dark:text-gray-500">
                      {d.blogPage.readCta}
                      <ArrowUpRight className="h-4 w-4 text-gray-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </span>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-gray-800 bg-[#050a14]/70 p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              {d.blogPage.comingSoonTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {d.blogPage.comingSoonBody}
            </p>
            <Link
              href="/en/blog"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 transition-colors hover:bg-gray-200"
            >
              {d.blogPage.readCta} (EN)
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <Reveal className="mt-16">
          <div className="rounded-3xl border border-gray-800 p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              {d.blogPage.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {d.blogPage.ctaBody}
            </p>
            <Magnetic strength={0.25} maxShift={4}>
              <Link
                href={lp("/contact")}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 transition-colors hover:bg-gray-200"
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
