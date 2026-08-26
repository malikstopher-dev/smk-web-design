import type { Metadata } from "next"
import { Clock, CreditCard, Mail, MapPin, MessageCircle } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { JsonLd, breadcrumbSchema, localBusinessSchema } from "@/components/json-ld"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { getDict } from "@/i18n/index"
import { SERVICES, SITE } from "@/lib/site"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const d = getDict(locale)
  return {
    title: d.contactPage.metaTitle,
    description: d.contactPage.metaDesc,
    alternates: { canonical: `/${locale}/contact` },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const d = getDict(locale)

  return (
    <>
      <JsonLd data={localBusinessSchema(d.jsonld.businessDesc)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, path: `/${locale}` },
          { name: d.nav.contact, path: `/${locale}/contact` },
        ])}
      />

      <PageHero
        eyebrow={d.nav.contact}
        title={d.contactPage.title}
        lede={d.contactPage.lede}
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-6 sm:px-10 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <ContactForm
            labels={d.contactPage.form}
            locale={locale}
            serviceOptions={SERVICES.map((_, i) => d.servicesPage.items[i].title)}
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="flex h-full flex-col gap-4">
            <a
              href={SITE.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-3xl border border-gray-200 p-6 transition-colors hover:border-gray-900 dark:border-gray-800 dark:hover:border-white"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-colors group-hover:bg-gray-700 dark:bg-white dark:text-gray-900">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {d.contactPage.whatsappCard}
                </span>
                <span className="mt-0.5 block text-sm text-gray-500 dark:text-gray-400">
                  {SITE.whatsapp.label}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${SITE.email}`}
              className="group flex items-center gap-4 rounded-3xl border border-gray-200 p-6 transition-colors hover:border-gray-900 dark:border-gray-800 dark:hover:border-white"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-900 dark:border-gray-700 dark:text-white">
                <Mail className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Email
                </span>
                <span className="mt-0.5 block text-sm text-gray-500 dark:text-gray-400">
                  {SITE.email}
                </span>
              </span>
            </a>

            <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {d.contactPage.studio}
              </p>
              <ul className="mt-3 space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {SITE.location.street}, {SITE.location.city}{" "}
                  {SITE.location.postalCode}
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                  {SITE.hours}
                </li>
                <li className="flex items-start gap-2.5">
                  <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
                  {d.contactPage.payments}
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
