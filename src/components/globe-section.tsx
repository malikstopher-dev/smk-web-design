"use client"

import { useState } from "react"
import { GlobeMarkers } from "@/components/globe-markers"
import { CLIENT_GEO } from "@/lib/markers"
import type { Dict } from "@/i18n/types"

export function GlobeSection({ globe }: { globe: Dict["globe"] }) {
  const [selected, setSelected] = useState<string | null>(null)

  const markers = CLIENT_GEO.map((m) => ({
    ...m,
    country: globe.markers[m.id]?.country ?? m.country,
    work: globe.markers[m.id]?.work ?? m.work,
  }))
  const active = markers.find((m) => m.id === selected) ?? null

  return (
    <figure className="mx-auto w-full max-w-xl">
      <GlobeMarkers markers={markers} onSelect={setSelected} />
      <figcaption
        aria-live="polite"
        aria-label={globe.figAria}
        className="mx-auto mt-6 flex min-h-[4.25rem] w-full max-w-md items-center justify-center border border-white/[0.06] bg-[#03070f]/60 px-5 py-3 text-center backdrop-blur-sm"
      >
        {active ? (
          <p key={active.id} className="text-sm">
            <span className="font-semibold text-white">
              {active.country}
            </span>
            <span className="text-white/25"> · </span>
            <span className="text-white/50">
              {active.work}
            </span>
          </p>
        ) : (
          <p className="text-sm text-white/35">
            {globe.captionIdle}
          </p>
        )}
      </figcaption>
    </figure>
  )
}
