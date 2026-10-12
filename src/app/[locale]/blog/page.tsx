import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { JournalIndex } from "@/components/journal-index"
import { Magnetic } from "@/components/magnetic"
import { JsonLd, breadcrumbSchema, websiteSchema } from "@/components/json-ld"
import { InnerHero } from "@/components/inner-hero"
import { Reveal } from "@/components/reveal"
import { HTML_LANG } from "@/i18n/config"
import { getDict } from "@/i18n/index"
import { BLOG_POSTS } from "@/lib/posts"
import { siteAlternates, siteOpenGraph } from "@/lib/seo"

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
    alternates: siteAlternates(`/${locale}/blog`),
    openGraph: siteOpenGraph({ locale, path: `/${locale}/blog` }),
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

      <InnerHero eyebrow={d.nav.blog} heading={d.blogPage.title} subtext={d.blogPage.lede} scene="blog" controls={d.sceneControls} link={{ href: "#journal-index", label: isEn ? d.sceneControls.search : d.blogPage.comingSoonTitle }} />

      <section id="journal-index" className="mx-auto max-w-6xl scroll-mt-28 px-6 sm:px-10">
        <div className="editorial-divider mb-12" />
        {isEn ? (
          <JournalIndex posts={BLOG_POSTS.map(({ slug, title, category, description }) => ({ slug, title, category, description }))} controls={d.sceneControls} readLabel={d.blogPage.readCta} locale={locale} />
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
              {d.blogPage.readEnglishCta}
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
