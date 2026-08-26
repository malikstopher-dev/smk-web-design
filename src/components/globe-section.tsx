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
        className="mx-auto mt-6 flex min-h-[4.25rem] w-full max-w-md items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-center dark:border-gray-800 dark:bg-gray-900/60"
      >
        {active ? (
          <p key={active.id} className="text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">
              {active.country}
            </span>
            <span className="text-gray-300 dark:text-gray-600"> · </span>
            <span className="text-gray-600 dark:text-gray-400">
              {active.work}
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {globe.captionIdle}
          </p>
        )}
      </figcaption>
    </figure>
  )
}
