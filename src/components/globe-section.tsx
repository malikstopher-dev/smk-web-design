"use client"

import { useMemo, useState } from "react"
import { GlobeMarkers } from "@/components/globe-markers"
import { CLIENT_GEO } from "@/lib/markers"
import type { Dict } from "@/i18n/types"

export function GlobeSection({ globe }: { globe: Dict["globe"] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [turn, setTurn] = useState(0)
  const [paused, setPaused] = useState(false)

  const markers = useMemo(() => CLIENT_GEO.map((m) => ({
    ...m,
    country: globe.markers[m.id].country,
    work: globe.markers[m.id].work,
  })), [globe.markers])
  const active = markers.find((m) => m.id === selected) ?? null

  return (
    <figure className="mx-auto w-full max-w-xl">
      <link rel="preload" as="image" href="/planets/earth-day-2k.jpg" fetchPriority="high" />
      {["earth-night-1k.jpg", "earth-clouds-1k.jpg", "jupiter-2k.jpg", "saturn-2k.jpg", "mars-2k.jpg", "venus-2k.jpg", "moon_1024.jpg"].map(texture => <link key={texture} rel="preload" as="image" href={`/planets/${texture}`} />)}
      <div data-solar-stage className="relative isolate aspect-square w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <GlobeMarkers markers={markers} onSelect={setSelected} selectedId={selected} rotationStep={turn} paused={paused} interactionLabel={globe.interactionLabel} cinematic speed={0.00065} className="!w-[62%]" />
        </div>
      </div>
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-56 text-xs leading-relaxed text-white/75">{globe.dragHint}</p>
        <div role="group" aria-label={globe.interactionLabel} className="flex gap-2">
          <button type="button" aria-label={globe.rotateLeft} onClick={() => { setSelected(null); setTurn(value => value - 1) }} className="h-11 w-11 rounded-full border border-white/25 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#e8b04b]">←</button>
          <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)} className="min-h-11 min-w-16 rounded-full border border-white/25 px-3 text-xs text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#e8b04b]">{paused ? globe.play : globe.pause}</button>
          <button type="button" aria-label={globe.rotateRight} onClick={() => { setSelected(null); setTurn(value => value + 1) }} className="h-11 w-11 rounded-full border border-white/25 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#e8b04b]">→</button>
        </div>
      </div>
      <figcaption
        aria-live="polite"
        aria-label={globe.figAria}
        className="relative z-10 mx-auto mt-6 flex min-h-[4.25rem] w-full max-w-md items-center justify-center border border-white/[0.06] bg-[#03070f]/60 px-5 py-3 text-center backdrop-blur-sm"
      >
        {active ? (
          <p key={active.id} className="text-sm">
            <span className="font-semibold text-white">
              {active.country}
            </span>
            <span className="text-white/50"> · </span>
            <span className="text-white/75">
              {active.work}
            </span>
          </p>
        ) : (
          <p className="text-sm text-white/70">
            {globe.captionIdle}
          </p>
        )}
      </figcaption>
      <div role="group" aria-label={globe.figAria} className="mt-4 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
        {markers.map((marker) => (
          <button
            key={marker.id}
            type="button"
            aria-pressed={selected === marker.id}
            onClick={() => setSelected(selected === marker.id ? null : marker.id)}
            className={`min-h-11 bg-[#050913] px-2 py-2 text-center text-xs transition-colors hover:bg-[#111a2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b04b] ${selected === marker.id ? "text-[#e8b04b]" : "text-white/75"}`}
          >
            {marker.country}
          </button>
        ))}
      </div>
    </figure>
  )
}
