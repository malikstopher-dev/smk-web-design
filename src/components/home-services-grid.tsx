import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ServiceArtwork } from "./service-artwork"
import type { Dict } from "@/i18n/types"
import styles from "./home-services-grid.module.css"

function ServiceDiagram({ slug }: { slug: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  switch (slug) {
    case "website-design":
      return (
        <svg viewBox="0 0 320 140" {...common} aria-hidden="true">
          <rect x="44" y="17" width="223" height="112" rx="6" />
          <path d="M44 37h223M58 27h2m8 0h2m8 0h2" />
          <g className={styles.layoutPanel}>
            <rect x="60" y="51" width="96" height="62" rx="2" />
            <path d="m68 100 24-25 17 16 19-28 20 37" opacity=".5" />
          </g>
          <path className={styles.drawLines} pathLength="1" d="M169 53h77M169 65h59M169 85h74M169 97h49" />
          <rect className={styles.layoutButton} x="169" y="108" width="46" height="8" rx="2" />
          <path d="M32 75h12m223 0h20M280 54v42" opacity=".45" />
        </svg>
      )
    case "full-stack-development":
      return (
        <svg viewBox="0 0 320 140" {...common} aria-hidden="true">
          <rect x="30" y="20" width="112" height="92" rx="5" />
          <path d="M30 39h112M43 30h2m8 0h2m8 0h2M48 57l-9 8 9 8m15-16 9 8-9 8m24-24-9 33" />
          <path d="M142 66h34m0 0 19-26m-19 26 19 28" />
          <circle cx="176" cy="66" r="3" />
          <rect x="195" y="21" width="91" height="38" rx="4" />
          <rect x="195" y="76" width="91" height="38" rx="4" />
          <path d="M208 34h43m-43 11h29m-29 44h43m-43 11h29" />
          <circle className={styles.dataPacket} cx="142" cy="66" r="3" fill="currentColor" />
          <circle className={styles.dataReply} cx="195" cy="94" r="3" fill="currentColor" />
        </svg>
      )
    case "seo-performance":
      return (
        <svg viewBox="0 0 320 140" {...common} aria-hidden="true">
          <path d="M34 111h248" />
          <g className={styles.chartBars}>
            <path d="M43 103V78h34v25" /><path d="M93 103V67h34v36" />
            <path d="M143 103V53h34v50" /><path d="M193 103V38h34v65" />
          </g>
          <path className={styles.trendLine} pathLength="1" d="m47 69 46-8 46-20 47-5 40-18" />
          <circle className={styles.trendDot} cx="226" cy="18" r="5" />
          <path d="M254 35h25m-25 11h17M43 121h135" opacity=".45" />
        </svg>
      )
    case "cloud-deployment":
      return (
        <svg viewBox="0 0 320 140" {...common} aria-hidden="true">
          <rect x="42" y="25" width="92" height="34" rx="4" />
          <rect x="42" y="81" width="92" height="34" rx="4" />
          <path d="M56 37h41m-41 10h58M56 93h41m-41 10h58M134 42h31m-31 56h31m0-56v56m0-28h28" />
          <circle cx="165" cy="70" r="3" />
          <path d="M245 93h-37a18 18 0 0 1-2-36 26 26 0 0 1 50-4 20 20 0 0 1-11 40Z" />
          <path className={styles.deployArrow} d="M218 73h29M238 64l9 9-9 9" />
          <circle className={styles.deployPacket} cx="134" cy="42" r="3" fill="currentColor" />
        </svg>
      )
    case "ui-ux-design":
      return (
        <svg viewBox="0 0 320 140" {...common} aria-hidden="true">
          <rect x="43" y="21" width="211" height="94" rx="5" />
          <path d="M43 39h211M76 39v76M55 30h2m8 0h2M88 54h68m-68 13h49" />
          <rect x="167" y="52" width="70" height="45" rx="3" />
          <circle className={styles.clickRing} cx="209" cy="80" r="10" />
          <path className={styles.designCursor} d="m199 72 12 29 4-12 12-4-28-13Z" fill="#091522" />
          <path d="M267 49h17M267 61h12M267 73h17" opacity=".45" />
        </svg>
      )
    case "branding-identity":
      return (
        <svg viewBox="0 0 320 140" {...common} aria-hidden="true">
          <rect x="40" y="17" width="224" height="107" rx="4" />
          <circle className={styles.brandLeft} cx="133" cy="70" r="37" />
          <circle className={styles.brandRight} cx="169" cy="70" r="37" />
          <path d="M57 31h32M57 41h20M218 34h27m-27 9h17M218 98h27m-27 9h17" />
          <path d="M104 70h94M151 33v74" opacity=".4" />
        </svg>
      )
    default:
      return null
  }
}

export function HomeServicesGrid({
  items,
  viewLabel,
  locale,
  controls,
}: {
  items: { slug: string; title: string; short: string }[]
  viewLabel: string
  locale: string
  controls: Dict["sceneControls"]
}) {
  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <article key={item.slug} className={`${styles.card} ${index < 2 ? styles.featured : ""}`}>
          <ServiceArtwork title={item.title} slug={item.slug} controls={controls}>
            <ServiceDiagram slug={item.slug} />
          </ServiceArtwork>
          <Link href={`/${locale}/services#${item.slug}`} className={styles.link} aria-label={`${item.title}: ${viewLabel}`}>
            <div className={styles.copy}>
              <div className={styles.headingRow}>
                <h3>{item.title}</h3>
                <ArrowUpRight aria-hidden="true" className={styles.cornerArrow} />
              </div>
              <p>{item.short}</p>
              <span className={styles.action}>
                {viewLabel}
                <ArrowUpRight aria-hidden="true" />
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}
