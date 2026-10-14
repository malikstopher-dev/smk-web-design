export const CONTACT_LIMITS = { name: { min: 2, max: 120 }, email: { max: 254 }, message: { min: 10, max: 5000 } } as const

export function contactFieldValid(field: "name" | "email" | "message", value: string) {
  const text = value.trim()
  if (field === "name") return text.length >= CONTACT_LIMITS.name.min && text.length <= CONTACT_LIMITS.name.max && !/[\r\n]/.test(text)
  if (field === "email") return text.length <= CONTACT_LIMITS.email.max && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
  return text.length >= CONTACT_LIMITS.message.min && text.length <= CONTACT_LIMITS.message.max
}
