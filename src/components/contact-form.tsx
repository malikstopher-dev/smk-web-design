"use client"

import { useActionState } from "react"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { submitContact, type ContactState } from "@/app/actions/contact"
import { MagneticCta } from "@/components/contact-anim"
import type { Dict } from "@/i18n/types"
import { SITE } from "@/lib/site"

const initial: ContactState = { status: "idle" }

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-400">
      {msg}
    </p>
  )
}

export function ContactForm({
  labels,
  locale,
  serviceOptions,
  defaultService,
}: {
  labels: Dict["contactPage"]["form"]
  locale: string
  serviceOptions: string[]
  defaultService?: string
}) {
  const [state, action, pending] = useActionState(submitContact, initial)

  if (state.status === "success") {
    return (
      <div className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-4 border border-white/[0.06] p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center border border-white/20 text-white/60">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="display-md text-white">
          {labels.successTitle}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-white/40">
          {labels.successBody}
        </p>
        <a
          href={SITE.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex h-11 items-center gap-2 rounded-full border border-white bg-white px-6 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200"
        >
          {labels.whatsappCta}
        </a>
      </div>
    )
  }

  return (
    <form
      action={action}
      noValidate
      className="border border-white/[0.06] bg-[#03070f]/60 p-6 sm:p-8 backdrop-blur-sm"
    >
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium text-white">
            {labels.name}
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={labels.namePlaceholder}
            aria-invalid={Boolean(state.errors?.name)}
            className={`${inputCls} ${state.errors?.name ? "border-red-500 dark:border-red-500" : ""}`}
          />
          <FieldError msg={state.errors?.name} />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-sm font-medium text-white">
            {labels.email}
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={labels.emailPlaceholder}
            aria-invalid={Boolean(state.errors?.email)}
            className={`${inputCls} ${state.errors?.email ? "border-red-500 dark:border-red-500" : ""}`}
          />
          <FieldError msg={state.errors?.email} />
        </div>
        <div>
          <label htmlFor="cf-phone" className="mb-1.5 block text-sm font-medium text-white">
            {labels.phone}{" "}
            <span className="font-normal text-white/40">{labels.phoneOptional}</span>
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={labels.phonePlaceholder}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="cf-service" className="mb-1.5 block text-sm font-medium text-white">
            {labels.service}
          </label>
          <select
            id="cf-service"
            name="service"
            className={inputCls}
            defaultValue={defaultService ?? ""}
          >
            <option value="">{labels.servicePlaceholder}</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium text-white">
            {labels.message}
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={5}
            placeholder={labels.messagePlaceholder}
            aria-invalid={Boolean(state.errors?.message)}
            className={`w-full resize-y border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/30 focus-visible:ring-2 focus-visible:ring-white/10 ${
              state.errors?.message ? "border-red-500 dark:border-red-500" : ""
            }`}
          />
          <FieldError msg={state.errors?.message} />
        </div>
      </div>

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-4 border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
          {state.message}{" "}
          <a href={SITE.whatsapp.url} target="_blank" rel="noopener noreferrer" className="underline">
            {SITE.whatsapp.label}
          </a>
        </p>
      )}

      <MagneticCta
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full border border-white bg-white px-8 text-sm font-medium text-gray-900 shadow-lg shadow-white/10 hover:border-[#e8b04b] disabled:opacity-60 sm:w-auto"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin motion-reduce:hidden" />
            {labels.sending}
          </>
        ) : (
          <>
            {labels.submit}
            <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </>
        )}
      </MagneticCta>
    </form>
  )
}

const inputCls =
  "h-11 w-full border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/30 focus-visible:ring-2 focus-visible:ring-white/10"
