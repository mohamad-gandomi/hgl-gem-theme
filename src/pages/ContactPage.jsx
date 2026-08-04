import React from 'react'
import MapPin from 'lucide-react/dist/esm/icons/map-pin.mjs'
import Clock from 'lucide-react/dist/esm/icons/clock.mjs'
import PhoneCall from 'lucide-react/dist/esm/icons/phone-call.mjs'
import { contactInfo } from '../data/siteContent'
import { Field } from '../components/Field'
import { PageShell } from '../components/PageShell'

export function ContactPage({ copy, contacts }) {
  return (
    <PageShell label={copy.contactPage.label} title={copy.contactPage.title} text={copy.contactPage.text}>
      <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
        <aside className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="text-2xl font-normal tracking-[-0.01em] text-ink">{copy.contactPage.infoTitle}</h2>
          <div className="mt-6 grid gap-5 text-sm leading-6 text-body">
            <div className="flex gap-3">
              <MapPin strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span>{contacts.address}</span>
            </div>
            <div className="flex gap-3">
              <Clock strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span>{contacts.hours}</span>
            </div>
            <div className="flex gap-3">
              <PhoneCall strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div className="grid gap-2">
                {contactInfo.phones.map((phone) => <a key={phone.href} href={phone.href} className="font-medium text-ink hover:text-primary">{phone.label}</a>)}
              </div>
            </div>
          </div>
        </aside>
        <form className="rounded-xl border border-hairline bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={copy.contactPage.name} placeholder={copy.contactPage.namePlaceholder} />
            <Field label={copy.contactPage.email} placeholder={copy.contactPage.emailPlaceholder} />
          </div>
          <Field label={copy.contactPage.requestType} placeholder={copy.contactPage.requestPlaceholder} className="mt-4" />
          <label className="mt-4 block">
            <span className="text-sm font-medium text-ink">{copy.contactPage.message}</span>
            <textarea className="mt-2 min-h-36 w-full rounded-lg border border-hairline bg-canvasSoft px-4 py-3 text-sm text-ink outline-none focus:border-primary" placeholder={copy.contactPage.messagePlaceholder} />
          </label>
          <button type="button" className="mt-5 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive">{copy.contactPage.send}</button>
        </form>
      </div>
    </PageShell>
  )
}
