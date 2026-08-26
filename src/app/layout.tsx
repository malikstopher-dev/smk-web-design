import type { Viewport } from "next"
import { Fraunces, Geist, Geist_Mono } from "next/font/google"
import { CosmicBackground } from "@/components/cosmic-background"
import "./globals.css"
import "./cosmic-bg.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-ZA"
      className={`dark bg-[#03070f] ${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen font-sans text-foreground antialiased">
        <CosmicBackground />
        {children}
      </body>
    </html>
  )
}
