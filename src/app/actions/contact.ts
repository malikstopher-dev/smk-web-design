"use server"

import { getDict } from "@/i18n/index"
import { contactFieldValid } from "@/lib/contact-validation"

export interface ContactState {
  status: "idle" | "ready" | "success" | "error"
  message?: string
  errors?: Partial<Record<"name" | "email" | "message", string>>
  submission?: Record<string, string>
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

  // Web3Forms requires browser delivery on its standard plan. The owner
  // approved exposing this public form identifier on 14 October 2026.
  // Return only validated fields; never proxy the provider request here.
  return {
    status: "ready",
    submission: {
      access_key: accessKey,
      from_name: "SMK Web Design Contact",
      subject: `New enquiry from ${name}`,
      name, email, replyto: email,
      phone: phone || "Not provided",
      service: service || "General enquiry",
      message,
    },
  }
}
