import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import { SITE } from "@/lib/site"
import { HeroIn, HoverButton } from "@/components/motion"
import { Reveal } from "@/components/reveal"

export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string
  title: string
  lede?: string
}) {
  return (
    <div className="smk-container smk-page pb-16 sm:pb-24">
      {eyebrow && (
        <HeroIn>
          <p className="smk-eyebrow">{eyebrow}</p>
        </HeroIn>
      )}
      <HeroIn delay={0.1}>
        <h1
          className="mt-4 max-w-[var(--col-8)] text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ fontSize: "var(--fs-large)" }}
        >
          {title}
        </h1>
      </HeroIn>
      {lede && (
        <HeroIn delay={0.2}>
          <p className="mt-6 max-w-[var(--col-6)] text-base leading-relaxed text-gray-400 sm:text-lg">
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
      className="smk-container mt-32 mb-32"
    >
      <Reveal>
        <div className="border-t border-white/10 pt-12 sm:flex sm:items-end sm:justify-between sm:gap-12">
          <div className="max-w-[var(--col-7)]">
            <h2
              id="cta-heading"
              className="text-3xl font-medium leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl"
              style={{ fontSize: "var(--fs-studio)" }}
            >
              {title}
            </h2>
            <p className="mt-4 max-w-[var(--col-5)] text-base leading-relaxed text-gray-400">
              {body}
            </p>
          </div>
          <div className="mt-8 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 sm:mt-0">
            <HoverButton
              href={SITE.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 text-sm text-white smk-link"
            >
              <MessageCircle className="h-4 w-4" />
              {primaryLabel}
            </HoverButton>
            <Link
              href={secondaryHref}
              className="inline-flex h-11 items-center gap-1.5 text-sm text-white smk-link"
            >
              {secondaryLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
