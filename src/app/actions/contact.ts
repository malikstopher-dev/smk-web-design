"use server"

import { getDict } from "@/i18n/index"
import { contactFieldValid } from "@/lib/contact-validation"

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

  const text = (key: string) => {
    const value = formData.get(key)
    return typeof value === "string" ? value.trim() : ""
  }
  const name = text("name")
  const email = text("email")
  const phone = text("phone")
  const service = text("service")
  const message = text("message")

  const errors: ContactState["errors"] = {}
  if (!contactFieldValid("name", name)) errors.name = t.name
  if (!contactFieldValid("email", email)) errors.email = t.email
  if (!contactFieldValid("message", message)) errors.message = t.message
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors }
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim()
  if (!accessKey || phone.length > 40 || service.length > 120) {
    return { status: "error", message: t.send }
  }

  const fd = new FormData()
  fd.set("access_key", accessKey)
  fd.set("from_name", "SMK Web Design Contact")
  fd.set("subject", `New enquiry from ${name}`)
  fd.set("name", name)
  fd.set("email", email)
  fd.set("replyto", email)
  fd.set("phone", phone || "Not provided")
  fd.set("service", service || "General enquiry")
  fd.set("message", message)

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
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
