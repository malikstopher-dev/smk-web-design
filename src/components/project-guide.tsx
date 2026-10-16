import Link from "next/link"
import { ArrowUpRight, Plus } from "lucide-react"
import type { Dict } from "@/i18n/types"

type Guide = Dict["projectGuide"]

export function ProjectOutcomes({ copy }: { copy: Guide }) {
  return <section aria-labelledby="project-outcomes" className="mx-auto my-20 max-w-6xl px-6 sm:px-10">
    <div className="max-w-2xl">
      <h2 id="project-outcomes" className="display-md text-[#ececea]">{copy.title}</h2>
      <p className="mt-5 text-base leading-relaxed text-slate-300">{copy.intro}</p>
    </div>
    <div className="mt-10 grid gap-8 md:grid-cols-3">
      {copy.outcomes.map(item => <div key={item.title} className="border-t border-white/20 pt-6">
        <h3 className="font-display text-2xl text-[#ececea]">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
      </div>)}
    </div>
  </section>
}

export function ProjectProcess({ dict, locale }: { dict: Dict; locale: string }) {
  return <section aria-labelledby="home-process" className="mx-auto mt-20 max-w-6xl px-6 sm:px-10">
    <div className="grid gap-8 border-t border-white/15 pt-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
      <div>
        <h2 id="home-process" className="display-md text-[#ececea]">{dict.aboutPage.processHeading}</h2>
        <p className="mt-5 text-base leading-relaxed text-slate-300">{dict.projectGuide.processIntro}</p>
        <Link href={`/${locale}/pricing`} className="mt-6 inline-flex min-h-11 items-center gap-3 text-sm text-[#ececea] underline decoration-white/30 underline-offset-8 hover:decoration-white focus-visible:outline-2 focus-visible:outline-white">
          {dict.projectGuide.pricingLink}<ArrowUpRight size={16} aria-hidden />
        </Link>
        <p className="mt-4 text-sm leading-6 text-slate-400">{dict.projectGuide.pricingNote}</p>
      </div>
      <ol className="divide-y divide-white/15">
        {dict.aboutPage.process.map(step => <li key={step.title} className="py-5 first:pt-0">
          <h3 className="font-display text-2xl text-[#ececea]">{step.title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">{step.body}</p>
        </li>)}
      </ol>
    </div>
  </section>
}

export function ProjectScope({ copy }: { copy: Guide }) {
  return <section aria-labelledby="project-scope" className="mx-auto mt-12 max-w-6xl px-6 sm:px-10">
    <div className="border-t border-white/15 pt-10">
      <h2 id="project-scope" className="display-md text-[#ececea]">{copy.scopeTitle}</h2>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">{copy.scopeIntro}</p>
      <dl className="mt-8 divide-y divide-white/15">
        {copy.scope.map(item => <div key={item.title} className="grid gap-3 py-6 md:grid-cols-[1fr_2fr] md:gap-12">
          <dt className="font-display text-2xl text-[#ececea]">{item.title}</dt>
          <dd className="max-w-2xl text-base leading-relaxed text-slate-300">{item.body}</dd>
        </div>)}
      </dl>
    </div>
  </section>
}

export function PricingQuestions({ copy }: { copy: Guide }) {
  return <section aria-labelledby="pricing-questions" className="mx-auto mt-20 max-w-6xl px-6 sm:px-10">
    <div className="grid gap-8 border-t border-white/15 pt-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
      <h2 id="pricing-questions" className="display-md text-[#ececea]">{copy.faqTitle}</h2>
      <div className="divide-y divide-white/15">
        {copy.faqs.map((item, index) => <details key={item.question} className="group py-5 first:pt-0" open={index === 0}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-5 text-base font-medium text-[#ececea] focus-visible:outline-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
            {item.question}<Plus aria-hidden className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none" />
          </summary>
          <p className="mt-3 pr-6 text-sm leading-7 text-slate-300">{item.answer}</p>
        </details>)}
      </div>
    </div>
  </section>
}

export function ProjectBrief({ copy }: { copy: Guide }) {
  return <section aria-labelledby="project-brief" className="mx-auto mb-10 max-w-6xl px-6 sm:px-10">
    <div className="grid gap-6 border-y border-white/15 py-7 md:grid-cols-2 md:gap-12">
      <div>
        <h2 id="project-brief" className="font-display text-2xl text-[#ececea]">{copy.briefTitle}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">{copy.briefBody}</p>
      </div>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-300 marker:text-slate-500">
        {copy.briefPoints.map(point => <li key={point}>{point}</li>)}
      </ul>
    </div>
  </section>
}
