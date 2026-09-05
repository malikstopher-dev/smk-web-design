import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import { SITE } from "@/lib/site"
import { HeroIn, HoverButton } from "@/components/motion"
import { Magnetic } from "@/components/magnetic"
import { RevealHeading } from "@/components/text-reveal"
import { Reveal } from "@/components/reveal"
import { TypewriterLede } from "@/components/contact-anim"

export function PageHero({
  eyebrow,
  title,
  lede,
  ledeAsTypewriter = false,
}: {
  eyebrow: string
  title: string
  lede?: string
  ledeAsTypewriter?: boolean
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-10 pt-28 sm:px-10 sm:pt-36">
      <HeroIn>
        <p className="tech-label">
          {eyebrow}
        </p>
      </HeroIn>
      <HeroIn delay={0.1}>
        <RevealHeading
          as="h1"
          className="display-lg mt-5 max-w-3xl text-white"
        >
          {title}
        </RevealHeading>
      </HeroIn>
      {lede && ledeAsTypewriter && (
        <HeroIn delay={0.2}>
          <TypewriterLede text={lede} />
        </HeroIn>
      )}
      {lede && !ledeAsTypewriter && (
        <HeroIn delay={0.2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">
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
      className="mx-auto mt-28 max-w-6xl px-6 sm:px-10"
    >
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-8 rounded-none border border-white/[0.06] p-8 sm:p-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="tech-label mb-4">Contact</p>
            <h2
              id="cta-heading"
              className="display-md text-white"
            >
              {title}
            </h2>
            <p className="mt-4 leading-relaxed text-white/45">
              {body}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <HoverButton
              href={SITE.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-white bg-white px-7 text-sm font-medium text-gray-900 shadow-lg shadow-white/10 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070f]"
            >
              <MessageCircle className="h-4 w-4" />
              {primaryLabel}
            </HoverButton>
            <Magnetic strength={0.25} maxShift={4}>
              <Link
                href={secondaryHref}
                className="inline-flex h-12 items-center gap-1.5 rounded-full border border-white/15 px-7 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
