import React, { useState } from 'react'
import MapPin from 'lucide-react/dist/esm/icons/map-pin.mjs'
import Clock from 'lucide-react/dist/esm/icons/clock.mjs'
import PhoneCall from 'lucide-react/dist/esm/icons/phone-call.mjs'
import { contactInfo } from '../data/siteContent'
import { Field } from '../components/Field'
import { PageShell } from '../components/PageShell'

const contactFallbacks = {
  fa: {
    required: 'لطفا فیلدهای ضروری را کامل کنید.',
    invalidEmail: 'لطفا یک ایمیل معتبر وارد کنید.',
    error: 'ارسال پیام انجام نشد. لطفا دوباره تلاش کنید یا با شماره‌های تماس ارتباط بگیرید.',
    success: 'پیام شما با موفقیت ارسال شد.',
    sending: 'در حال ارسال...',
  },
  en: {
    required: 'Please complete the required fields.',
    invalidEmail: 'Please enter a valid email address.',
    error: 'Could not send your message. Please try again or call us directly.',
    success: 'Your message was sent successfully.',
    sending: 'Sending...',
  },
}

export function ContactPage({ copy, contacts, locale }) {
  const [form, setForm] = useState({ name: '', email: '', requestType: '', message: '', website: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)
  const contactCopy = copy.contactPage
  const fallback = contactFallbacks[locale] || contactFallbacks.en
  const restUrl = window.HGL_WP?.restUrl || '/wp-json/hgl/v1/'

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    if (status.type) setStatus({ type: '', message: '' })
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: contactCopy.required || fallback.required })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({ type: 'error', message: contactCopy.invalidEmail || fallback.invalidEmail })
      return
    }

    setSending(true)

    try {
      const response = await fetch(`${restUrl}contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(window.HGL_WP?.nonce ? { 'X-WP-Nonce': window.HGL_WP.nonce } : {}),
        },
        body: JSON.stringify(form),
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload?.message || contactCopy.error || fallback.error)
      }

      setForm({ name: '', email: '', requestType: '', message: '', website: '' })
      setStatus({ type: 'success', message: contactCopy.success || fallback.success })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || contactCopy.error || fallback.error })
    } finally {
      setSending(false)
    }
  }

  return (
    <PageShell label={copy.contactPage.label} title={copy.contactPage.title} text={copy.contactPage.text}>
      <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
        <aside className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="text-2xl font-normal tracking-[-0.01em] text-ink">{copy.contactPage.infoTitle}</h2>
          <div className="mt-6 grid gap-5 text-sm leading-6 text-body">
            <div className="flex gap-3">
              <MapPin strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-purpleDeep" />
              <span>{contacts.address}</span>
            </div>
            <div className="flex gap-3">
              <Clock strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-purpleDeep" />
              <span>{contacts.hours}</span>
            </div>
            <div className="flex gap-3">
              <PhoneCall strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-purpleDeep" />
              <div className="grid gap-2">
                {contactInfo.phones.map((phone) => <a key={phone.href} href={phone.href} className="text-base font-semibold text-ink hover:text-primary">{locale === 'en' ? phone.enLabel : phone.label}</a>)}
              </div>
            </div>
          </div>
        </aside>
        <form onSubmit={submit} className="rounded-xl border border-hairline bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={copy.contactPage.name} placeholder={copy.contactPage.namePlaceholder} value={form.name} onChange={updateField('name')} autoComplete="name" required />
            <Field label={copy.contactPage.email} placeholder={copy.contactPage.emailPlaceholder} value={form.email} onChange={updateField('email')} type="email" autoComplete="email" required />
          </div>
          <Field label={copy.contactPage.requestType} placeholder={copy.contactPage.requestPlaceholder} className="mt-4" value={form.requestType} onChange={updateField('requestType')} />
          <input className="hidden" tabIndex="-1" autoComplete="off" value={form.website} onChange={updateField('website')} aria-hidden="true" />
          <label className="mt-4 block">
            <span className="text-sm font-medium text-ink">{copy.contactPage.message}</span>
            <textarea value={form.message} onChange={updateField('message')} className="mt-2 min-h-36 w-full rounded-lg border border-hairline bg-canvasSoft px-4 py-3 text-sm text-ink outline-none focus:border-primary" placeholder={copy.contactPage.messagePlaceholder} required />
          </label>
          {status.message && (
            <p className={`mt-4 rounded-lg border px-4 py-3 text-sm leading-6 ${status.type === 'success' ? 'border-primary/40 bg-primary/10 text-ink' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {status.message}
            </p>
          )}
          <button type="submit" disabled={sending} className="mt-5 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive disabled:cursor-not-allowed disabled:opacity-60">
            {sending ? (copy.contactPage.sending || fallback.sending) : copy.contactPage.send}
          </button>
        </form>
      </div>
    </PageShell>
  )
}
