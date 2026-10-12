import assert from "node:assert/strict"
const base = process.argv[2] ?? "http://127.0.0.1:3012"
const origin = "https://smk.stopher-malik.co.za"
for (const [route, language] of [["/en", "en-ZA"], ["/fr", "fr-CD"], ["/pt", "pt-MZ"], ["/fr/blog", "fr-CD"], ["/en/about", "en-ZA"], ["/en/contact", "en-ZA"]]) {
  const response = await fetch(base + route, { signal: AbortSignal.timeout(30000) })
  assert.equal(response.status, 200, route)
  const html = await response.text()
  assert.ok(html.includes(`<html lang="${language}"`), `${route}: html language`)
  assert.ok(html.includes(`rel="canonical" href="${origin}${route}"`), `${route}: canonical`)
  assert.ok(html.includes(`property="og:url" content="${origin}${route}"`), `${route}: Open Graph URL`)
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route}: single h1`)
  for (const locale of ["en", "fr", "pt"]) assert.ok(html.includes(`hrefLang="${locale}"`), `${route}: ${locale} alternate`)
  console.log(`PASS: ${route}, language, canonical, Open Graph, heading and alternates`)
}
const redirect = await fetch(base + "/fr/blog/web-design-johannesburg", { redirect: "manual" })
assert.equal(redirect.status, 307)
assert.ok(redirect.headers.get("location")?.endsWith("/en/blog/web-design-johannesburg"))
const robots = await (await fetch(base + "/robots.txt")).text()
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`))
const sitemap = await (await fetch(base + "/sitemap.xml")).text()
assert.equal((sitemap.match(/<url>/g) ?? []).length, 80)
console.log("PASS: French article redirect, robots and 80-URL sitemap")
