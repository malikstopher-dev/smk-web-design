import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function HomeServicesGrid({
  items,
  viewLabel,
  locale,
}: {
  items: { slug: string; title: string; short: string }[]
  viewLabel: string
  locale: string
}) {
  return (
    <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.slug} className="smk-surface group flex min-h-56 flex-col p-7">
          <ArrowUpRight aria-hidden className="ml-auto h-5 w-5 text-[#e8b04b]" />
          <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-white">{item.title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">{item.short}</p>
          <Link
            href={`/${locale}/services#${item.slug}`}
            className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-sm font-medium text-[#e8b04b] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b04b]"
          >
            {viewLabel}
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </Link>
        </article>
      ))}
    </div>
  )
}
