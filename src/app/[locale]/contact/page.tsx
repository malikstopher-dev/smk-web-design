import type { Metadata } from "next"
import {
  Clock,
  CreditCard,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { JsonLd, SITE_URL, breadcrumbSchema, localBusinessSchema } from "@/components/json-ld"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { getDict } from "@/i18n/index"
import { SERVICES, SITE } from "@/lib/site"

function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.9 2.9 0 1 1-2.31-2.84V9.35a6.35 6.35 0 1 0 5.76 6.28V8.75a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.18Z" />
    </svg>
  )
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  LinkedIn: <Linkedin className="h-4 w-4" />,
  X: <Twitter className="h-4 w-4" />,
  TikTok: <TikTokIcon className="h-4 w-4" />,
  YouTube: <Youtube className="h-4 w-4" />,
}

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
    openGraph: { url: `${SITE_URL}/${locale}/contact` },
  }
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ service?: string | string[] }>
}) {
  const { locale } = await params
  const d = getDict(locale)
  const query = await searchParams
  const serviceOptions = SERVICES.map((_, i) => d.servicesPage.items[i].title)
  const requestedService = Array.isArray(query.service)
    ? query.service[0]
    : query.service
  const defaultService = serviceOptions.includes(requestedService ?? "")
    ? requestedService
    : undefined

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
            serviceOptions={serviceOptions}
            defaultService={defaultService}
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="flex h-full flex-col gap-4">
            <a
              href={SITE.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 border border-white/[0.06] p-6 transition-colors hover:border-white/[0.15]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 text-white/60 transition-colors group-hover:border-white/40 group-hover:text-white">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  {d.contactPage.whatsappCard}
                </span>
                <span className="mt-0.5 block text-sm text-white/40">
                  {SITE.whatsapp.label}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${SITE.email}`}
              className="group flex items-center gap-4 border border-white/[0.06] p-6 transition-colors hover:border-white/[0.15]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 text-white/50 transition-colors group-hover:border-white/30 group-hover:text-white/80">
                <Mail className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  Email
                </span>
                <span className="mt-0.5 block text-sm text-white/40">
                  {SITE.email}
                </span>
              </span>
            </a>

            <a
              href={`tel:${SITE.phone}`}
              className="group flex items-center gap-4 border border-white/[0.06] p-6 transition-colors hover:border-white/[0.15]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 text-white/50 transition-colors group-hover:border-white/30 group-hover:text-white/80">
                <Phone className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  Phone
                </span>
                <span className="mt-0.5 block text-sm text-white/40">
                  {SITE.phoneLabel}
                </span>
              </span>
            </a>

            <div className="border border-white/[0.06] p-6">
              <p className="text-sm font-semibold text-white">
                {d.contactPage.studio}
              </p>
              <ul className="mt-3 space-y-2.5 text-sm text-white/40">
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

            <div className="border border-white/[0.06] p-6">
              <p className="text-sm font-semibold text-white">
                {SITE.business}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SITE.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name} — ${s.handle}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {SOCIAL_ICONS[s.name]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6 pb-4 sm:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <p className="tech-label mb-4">{d.contactPage.payment.heading}</p>
            <p className="text-sm leading-relaxed text-white/45">
              {d.contactPage.payment.body}
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="h-full border border-white/[0.06] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 text-white/50">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {d.contactPage.payment.eftTitle}
                  </h2>
                  <p className="mt-1 text-sm text-white/40">
                    {d.contactPage.payment.eftBody}
                  </p>
                </div>
              </div>

              <dl className="mt-7 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
                {[
                  [d.contactPage.payment.bankLabel, d.contactPage.payment.bank],
                  [
                    d.contactPage.payment.accountNameLabel,
                    d.contactPage.payment.accountName,
                  ],
                  [
                    d.contactPage.payment.accountNumberLabel,
                    d.contactPage.payment.accountNumber,
                  ],
                  [d.contactPage.payment.branchLabel, d.contactPage.payment.branch],
                  [
                    d.contactPage.payment.referenceLabel,
                    d.contactPage.payment.reference,
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-white/30">{label}</dt>
                    <dd className="mt-1 font-medium text-white/75">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-7 border-t border-white/[0.06] pt-5 text-sm leading-relaxed text-white/40">
                {d.contactPage.payment.proof}
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full border border-white/[0.06] p-6 sm:p-8">
              <h2 className="text-base font-semibold text-white">
                {d.contactPage.payment.alternativesHeading}
              </h2>
              <div className="mt-6 divide-y divide-white/[0.06]">
                {d.contactPage.payment.alternatives.map((method) => (
                  <div key={method.title} className="py-4 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-medium text-white/75">
                      {method.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/40">
                      {method.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
