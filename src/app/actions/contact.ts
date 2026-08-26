"use server"

import { getDict } from "@/i18n/index"

export interface ContactState {
  status: "idle" | "success" | "error"
  message?: string
  errors?: Partial<Record<"name" | "email" | "message", string>>
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (formData.get("company")) {
    return { status: "success" }
  }

  const locale = String(formData.get("locale") ?? "en")
  const t = getDict(locale).contactPage.form.errors

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const service = String(formData.get("service") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  const errors: ContactState["errors"] = {}
  if (name.length < 2) errors.name = t.name
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t.email
  if (message.length < 10) errors.message = t.message
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors }
  }

  const fd = new FormData()
  fd.set("access_key", process.env.WEB3FORMS_ACCESS_KEY ?? "")
  fd.set("from_name", "SMK Web Design Contact")
  fd.set("subject", `New enquiry from ${name}`)
  fd.set("name", name)
  fd.set("email", email)
  fd.set("phone", phone || "Not provided")
  fd.set("service", service || "General enquiry")
  fd.set("message", message)

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" },
    })
    const data = (await res.json().catch(() => ({}))) as { success?: boolean }
    if (res.ok && data.success) {
      return { status: "success" }
    }
    return { status: "error", message: t.send }
  } catch {
    return { status: "error", message: t.network }
  }
}
