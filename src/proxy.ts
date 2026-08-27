import { NextRequest, NextResponse } from "next/server"
import { isLocale, type Locale } from "@/i18n/config"

function detectLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get("smk-lang")?.value
  if (cookie && isLocale(cookie)) return cookie

  const acceptLanguage = req.headers.get("accept-language") ?? ""
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase())

  for (const locale of preferred) {
    if (isLocale(locale)) return locale
  }

  return "en"
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const seg = pathname.split("/")[1]

  if (isLocale(seg)) {
    const res = NextResponse.next()
    res.headers.set("x-smk-locale", seg)
    res.headers.set("Vary", "Cookie, Accept-Language")
    return res
  }

  const locale = detectLocale(req)
  const url = req.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  const redirect = NextResponse.redirect(url)
  redirect.headers.set("Vary", "Cookie, Accept-Language")
  return redirect
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
