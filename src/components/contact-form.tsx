"use client"

import { useActionState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { submitContact, type ContactState } from "@/app/actions/contact"
import type { Dict } from "@/i18n/types"
import { SITE } from "@/lib/site"

const initial: ContactState = { status: "idle" }

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
      {msg}
    </p>
  )
}

export function ContactForm({
  labels,
  locale,
  serviceOptions,
}: {
  labels: Dict["contactPage"]["form"]
  locale: string
  serviceOptions: string[]
}) {
  const [state, action, pending] = useActionState(submitContact, initial)

  if (state.status === "success") {
    return (
      <div className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-10 text-center dark:border-gray-800">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
          <CheckCircle2 className="h-7 w-7 text-white dark:text-gray-900" />
        </span>
        <h3 className="font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {labels.successTitle}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {labels.successBody}
        </p>
        <a
          href={SITE.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex h-11 items-center gap-2 rounded-full bg-gray-900 px-6 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
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
      className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900/60"
    >
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium text-gray-900 dark:text-white">
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
          <label htmlFor="cf-email" className="mb-1.5 block text-sm font-medium text-gray-900 dark:text-white">
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
          <label htmlFor="cf-phone" className="mb-1.5 block text-sm font-medium text-gray-900 dark:text-white">
            {labels.phone}{" "}
            <span className="font-normal text-gray-400">{labels.phoneOptional}</span>
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
          <label htmlFor="cf-service" className="mb-1.5 block text-sm font-medium text-gray-900 dark:text-white">
            {labels.service}
          </label>
          <select id="cf-service" name="service" className={inputCls} defaultValue="">
            <option value="">{labels.servicePlaceholder}</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium text-gray-900 dark:text-white">
            {labels.message}
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={5}
            placeholder={labels.messagePlaceholder}
            aria-invalid={Boolean(state.errors?.message)}
            className={`w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus-visible:ring-white/20 ${
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
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.message}{" "}
          <a href={SITE.whatsapp.url} target="_blank" rel="noopener noreferrer" className="underline">
            {SITE.whatsapp.label}
          </a>
        </p>
      )}

      <motion.button
        type="submit"
        disabled={pending}
        whileHover={pending ? undefined : { scale: 1.03 }}
        whileTap={pending ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 hover:bg-gray-200 disabled:opacity-60 sm:w-auto dark:bg-white dark:text-gray-900"
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
      </motion.button>
    </form>
  )
}

const inputCls =
  "h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus-visible:ring-white/20"
