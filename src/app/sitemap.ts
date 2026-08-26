import type { MetadataRoute } from "next"
import { SITE_URL } from "@/components/json-ld"
import { LOCALES } from "@/i18n/config"
import { BLOG_POSTS } from "@/lib/posts"

const PATHS: { path: string; priority: number; freq: "monthly" | "yearly" | "weekly" }[] = [
  { path: "", priority: 1, freq: "monthly" },
  { path: "/about", priority: 0.8, freq: "yearly" },
  { path: "/services", priority: 0.9, freq: "yearly" },
  { path: "/work", priority: 0.9, freq: "monthly" },
  { path: "/pricing", priority: 0.8, freq: "yearly" },
  { path: "/blog", priority: 0.9, freq: "weekly" },
  { path: "/contact", priority: 0.8, freq: "yearly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const { path, priority, freq } of PATHS) {
    entries.push({
      url: `${SITE_URL}/en${path}`,
      lastModified: now,
      changeFrequency: freq,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]),
        ),
      },
    })
  }

  for (const p of BLOG_POSTS) {
    entries.push({
      url: `${SITE_URL}/en/blog/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  return entries
}
