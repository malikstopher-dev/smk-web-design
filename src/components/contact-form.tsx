"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { submitContact, type ContactState } from "@/app/actions/contact"
import styles from "./signal-panels.module.css"
import type { Dict } from "@/i18n/types"
import { SITE } from "@/lib/site"

const initial: ContactState = { status: "idle" }

function FieldError({ msg, id }: { msg?: string; id: string }) {
  if (!msg) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-red-400">
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
  const formRef = useRef<HTMLFormElement>(null)
  const [filled, setFilled] = useState<string[]>([])
  const [focused, setFocused] = useState("")
  const [values, setValues] = useState({ name: "", email: "", phone: "", service: defaultService ?? "", message: "" })
  const successRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (state.status === "success") successRef.current?.focus()
    if (state.status === "error") formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-submit-error]')?.focus()
  }, [state])

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-4 border border-white/[0.06] p-10 text-center">
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
      ref={formRef}
      action={action}
      noValidate
      aria-busy={pending}
      className={styles.contactForm}
      onInput={event => {
        const form = event.currentTarget
        setFilled(["name", "email", "message"].filter(name => {
          const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null
          return field && field.value.trim() && field.validity.valid
        }))
      }}
      onFocus={event => {
        setFocused(event.target.getAttribute("name") ?? "")
        window.dispatchEvent(new CustomEvent("smk:contact-focus", { detail: true }))
      }}
      onBlur={event => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
        setFocused("")
        window.dispatchEvent(new CustomEvent("smk:contact-focus", { detail: false }))
      }}
    >
      <input type="hidden" name="locale" value={locale} />
      <div className={styles.formProgress}>
        {(["name", "email", "message"] as const).map(name => <button type="button" key={name} data-filled={filled.includes(name)} data-focused={focused === name} onClick={() => (formRef.current?.elements.namedItem(name) as HTMLElement | null)?.focus()}>{labels[name]}</button>)}
      </div>
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
            minLength={2}
            maxLength={120}
            value={values.name}
            onChange={event => setValues(value => ({ ...value, name: event.target.value }))}
            placeholder={labels.namePlaceholder}
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? "cf-name-error" : undefined}
            className={`${inputCls} ${state.errors?.name ? "border-red-500 dark:border-red-500" : ""}`}
          />
          <FieldError id="cf-name-error" msg={state.errors?.name} />
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
            maxLength={254}
            value={values.email}
            onChange={event => setValues(value => ({ ...value, email: event.target.value }))}
            placeholder={labels.emailPlaceholder}
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? "cf-email-error" : undefined}
            className={`${inputCls} ${state.errors?.email ? "border-red-500 dark:border-red-500" : ""}`}
          />
          <FieldError id="cf-email-error" msg={state.errors?.email} />
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
            maxLength={40}
            value={values.phone}
            onChange={event => setValues(value => ({ ...value, phone: event.target.value }))}
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
            value={values.service}
            onChange={event => setValues(value => ({ ...value, service: event.target.value }))}
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
            minLength={10}
            maxLength={5000}
            value={values.message}
            onChange={event => setValues(value => ({ ...value, message: event.target.value }))}
            placeholder={labels.messagePlaceholder}
            aria-invalid={Boolean(state.errors?.message)}
            aria-describedby={state.errors?.message ? "cf-message-error" : undefined}
            className={`w-full resize-y border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/30 focus-visible:ring-2 focus-visible:ring-white/10 ${
              state.errors?.message ? "border-red-500 dark:border-red-500" : ""
            }`}
          />
          <FieldError id="cf-message-error" msg={state.errors?.message} />
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
        <p role="alert" data-submit-error tabIndex={-1} className="mt-4 border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
          {state.message}{" "}
          <a href={SITE.whatsapp.url} target="_blank" rel="noopener noreferrer" className="underline">
            {SITE.whatsapp.label}
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={`${styles.primary} mt-6 w-full disabled:opacity-60 sm:w-auto`}
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
      </button>
      <p className="mt-4 max-w-xl text-xs leading-5 text-white/35">
        {labels.legalNotice.prefix}
        <Link
          href={`/${locale}/terms`}
          className="underline underline-offset-4 transition-colors hover:text-white/70"
        >
          {labels.legalNotice.terms}
        </Link>
        {labels.legalNotice.middle}
        <Link
          href={`/${locale}/privacy`}
          className="underline underline-offset-4 transition-colors hover:text-white/70"
        >
          {labels.legalNotice.privacy}
        </Link>
        {labels.legalNotice.suffix}
      </p>
    </form>
  )
}

const inputCls =
  "h-11 w-full border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/30 focus-visible:ring-2 focus-visible:ring-white/10"
