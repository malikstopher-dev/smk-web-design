export const email = "info@stopher-malik.co.za"
export const emailHref = `mailto:${email}`
export const phoneDisplay = "+27 82 510 0050"
export const phoneE164 = "+27825100050"
export const telUrl = `tel:${phoneE164}`
export const whatsappBase = "https://wa.me/27825100050"
export const whatsappDisplay = "082 510 0050"
export const hours = "Mon-Fri 08:00-18:00, Sat 09:00-14:00"

export function waLink(message?: string) {
  return message ? `${whatsappBase}?text=${encodeURIComponent(message)}` : whatsappBase
}
