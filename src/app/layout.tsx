import type { Viewport } from "next"
import { headers } from "next/headers"
import { Fraunces, Geist } from "next/font/google"
import { CosmicBackground } from "@/components/cosmic-background"
import { HTML_LANG, isLocale } from "@/i18n/config"
import "./globals.css"
import "./cosmic-bg.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
})

export const viewport: Viewport = {
  themeColor: "#03070f",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const h = await headers()
  const seg = h.get("x-smk-locale") ?? "en"
  const locale = isLocale(seg) ? seg : "en"
  const lang = HTML_LANG[locale]
  return (
    <html
      lang={lang}
      className={`dark bg-[#03070f] ${geistSans.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen font-sans text-foreground antialiased">
        <CosmicBackground />
        {children}
      </body>
    </html>
  )
}
