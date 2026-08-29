import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import { SITE } from "@/lib/site"
import { HeroIn, HoverButton } from "@/components/motion"
import { Magnetic } from "@/components/magnetic"
import { RevealHeading } from "@/components/text-reveal"
import { Reveal } from "@/components/reveal"

export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: string
  lede?: string
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-10 pt-12 sm:px-10 sm:pt-24">
      <HeroIn>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
          {eyebrow}
        </p>
      </HeroIn>
      <HeroIn delay={0.1}>
        <RevealHeading
          as="h1"
          className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl dark:text-white"
        >
          {title}
        </RevealHeading>
      </HeroIn>
      {lede && (
        <HeroIn delay={0.2}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {lede}
          </p>
        </HeroIn>
      )}
    </div>
  )
}

export function CtaBand({
  title,
  body,
  secondaryHref = "/contact",
  secondaryLabel,
  primaryLabel,
}: {
  title: string
  body: string
  secondaryHref?: string
  secondaryLabel: string
  primaryLabel: string
}) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="mx-auto mt-24 max-w-6xl px-6 sm:px-10"
    >
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-gray-200 p-8 sm:p-12 md:flex-row md:items-center dark:border-gray-800">
          <div className="max-w-xl">
            <h2
              id="cta-heading"
              className="font-display text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
            >
              {title}
            </h2>
            <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
              {body}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <HoverButton
              href={SITE.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070f]"
            >
              <MessageCircle className="h-4 w-4" />
              {primaryLabel}
            </HoverButton>
            <Magnetic strength={0.25} maxShift={4}>
              <Link
                href={secondaryHref}
                className="inline-flex h-12 items-center gap-1.5 rounded-full border border-gray-300 px-7 text-sm font-medium text-gray-900 transition-colors hover:border-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:border-gray-700 dark:text-white dark:hover:border-white dark:focus-visible:ring-white"
              >
                {secondaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
