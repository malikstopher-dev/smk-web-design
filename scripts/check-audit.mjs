import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import ts from "typescript"

// Execute the server action with an isolated provider stub. No real enquiries.
const require = createRequire(import.meta.url)
function load(file, dependencies = {}) {
  const filename = fileURLToPath(new URL(`../${file}`, import.meta.url))
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const compiled = { exports: {} }
  new Function("require", "module", "exports", code)(id => dependencies[id] ?? (id.startsWith("@/") ? load(`src/${id.slice(2)}.ts`) : require(id)), compiled, compiled.exports)
  return compiled.exports
}
const dictionaries = Object.fromEntries(["en", "fr", "pt"].map(locale => {
  const exports = load(`src/i18n/messages/${locale}.ts`)
  return [locale, exports.default ?? exports[locale]]
}))
const { submitContact } = load("src/app/actions/contact.ts", {
  "@/i18n/index": { getDict: locale => dictionaries[locale] ?? dictionaries.en },
})
const form = (overrides = {}) => {
  const data = new FormData()
  Object.entries({ locale: "en", name: "Audit check", email: "audit@example.com", message: "A mocked contact form check.", ...overrides }).forEach(([key, value]) => data.set(key, value))
  return data
}
const originalFetch = globalThis.fetch
const originalKey = process.env.WEB3FORMS_ACCESS_KEY
let calls = 0
try {
  globalThis.fetch = async (_url, options) => {
    calls++
    assert.equal(options.body.get("replyto"), "audit@example.com")
    assert.ok(options.signal instanceof AbortSignal)
    return new Response(JSON.stringify({ success: true }))
  }
  process.env.WEB3FORMS_ACCESS_KEY = "mock-access-key"
  for (const locale of ["en", "fr", "pt"]) {
    const invalid = await submitContact({}, form({ locale, name: "", email: "bad", message: "short" }))
    assert.deepEqual(Object.keys(invalid.errors).sort(), ["email", "message", "name"])
    assert.equal(invalid.errors.name, dictionaries[locale].contactPage.form.errors.name)
  }
  assert.equal(calls, 0)
  assert.equal((await submitContact({}, form({ company: "bot" }))).status, "success")
  assert.equal(calls, 0)
  assert.equal((await submitContact({}, form({ name: new Blob(["file"]) }))).status, "error")
  assert.equal((await submitContact({}, form({ message: "x".repeat(5001) }))).status, "error")
  assert.equal((await submitContact({}, form({ name: "Header\r\ninjection" }))).status, "error")
  delete process.env.WEB3FORMS_ACCESS_KEY
  assert.equal((await submitContact({}, form())).status, "error")
  assert.equal(calls, 0)
  process.env.WEB3FORMS_ACCESS_KEY = "mock-access-key"
  assert.equal((await submitContact({}, form())).status, "success")
  assert.equal(calls, 1)
  globalThis.fetch = async () => new Response(JSON.stringify({ success: false }), { status: 429 })
  assert.equal((await submitContact({}, form())).status, "error")
  globalThis.fetch = async () => new Response("invalid JSON")
  assert.equal((await submitContact({}, form())).status, "error")
  globalThis.fetch = async () => { throw new DOMException("Timed out", "TimeoutError") }
  assert.equal((await submitContact({}, form())).message, dictionaries.en.contactPage.form.errors.network)
  console.log("PASS: contact validation in EN/FR/PT, honeypot, field limits, missing key, provider success/failure and timeout")
} finally {
  globalThis.fetch = originalFetch
  if (originalKey === undefined) delete process.env.WEB3FORMS_ACCESS_KEY
  else process.env.WEB3FORMS_ACCESS_KEY = originalKey
}

const site = "https://smk.stopher-malik.co.za"
const posts = JSON.parse(readFileSync(new URL("../src/lib/blog-posts.json", import.meta.url), "utf8"))
const { default: sitemap } = load("src/app/sitemap.ts", {
  "@/components/json-ld": { SITE_URL: site },
  "@/i18n/config": { LOCALES: ["en", "fr", "pt"] },
  "@/lib/posts": { BLOG_POSTS: posts },
})
const entries = sitemap()
assert.equal(entries.length, 30 + posts.length)
assert.equal(new Set(entries.map(entry => entry.url)).size, entries.length)
for (const locale of ["en", "fr", "pt"]) {
  const entry = entries.find(entry => entry.url === `${site}/${locale}/contact`)
  assert.ok(entry)
  assert.equal(entry.alternates.languages[locale], entry.url)
  assert.equal(entry.lastModified, undefined)
}
for (const post of posts) {
  assert.ok(Number.isFinite(Date.parse(post.date)), `Invalid date: ${post.slug}`)
  assert.equal(entries.find(entry => entry.url === `${site}/en/blog/${post.slug}`).lastModified, post.date)
}
console.log(`PASS: ${entries.length} unique sitemap URLs, all three locales, source article dates`)
