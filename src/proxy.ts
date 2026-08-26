import { NextRequest, NextResponse } from "next/server"

const LOCALES = ["en", "fr", "pt"]

function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get("smk-lang")?.value
  if (cookie && LOCALES.includes(cookie)) return cookie

  const acceptLanguage = req.headers.get("accept-language") ?? ""
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase())

  for (const locale of preferred) {
    if (LOCALES.includes(locale)) return locale
  }

  return "en"
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const seg = pathname.split("/")[1]

  if (LOCALES.includes(seg)) {
    return NextResponse.next()
  }

  const locale = detectLocale(req)
  const url = req.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
