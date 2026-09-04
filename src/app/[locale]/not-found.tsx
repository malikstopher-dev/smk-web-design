"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { isLocale } from "@/i18n/config"
import { getDict } from "@/i18n/index"

export default function LocaleNotFound() {
  const rawLocale = useParams<{ locale?: string }>().locale
  const locale = rawLocale && isLocale(rawLocale) ? rawLocale : "en"
  const d = getDict(locale)

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
      <p className="project-number text-lg">404</p>
      <h1 className="display-lg mt-4 text-white">
        {d.notFound.title}
      </h1>
      <p className="mt-4 max-w-md text-white/40">
        {d.notFound.body}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/${locale}`}
          className="inline-flex h-12 items-center rounded-full border border-white bg-white px-7 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200"
        >
          {d.notFound.home}
        </Link>
        <a
          href="https://wa.me/27825100050"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-7 text-sm font-medium text-white/60 transition-colors hover:border-white/40 hover:text-white"
        >
          <MessageCircle className="h-4 w-4" />
          {d.notFound.whatsapp}
        </a>
      </div>
    </div>
  )
}
