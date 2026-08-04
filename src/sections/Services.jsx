import React from 'react'
import BriefcaseBusiness from 'lucide-react/dist/esm/icons/briefcase-business.mjs'
import { serviceIcons } from '../data/icons'
import { LinkButton } from '../components/LinkButton'
import { SectionIntro } from '../components/SectionIntro'

export function ServicesPreview({ copy, locale, navigate }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label={copy.services.label} title={copy.services.title} />
        <ServiceGrid services={copy.services.items} />
        <div className="mt-8 text-center">
          <LinkButton href="/services" locale={locale} navigate={navigate} className="border border-hairlineStrong bg-surface text-ink hover:border-ink" icon>{copy.services.all}</LinkButton>
        </div>
      </div>
    </section>
  )
}

export function ServiceGrid({ services }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((service, index) => {
        const ServiceIcon = serviceIcons[index] || BriefcaseBusiness

        return (
        <article key={service.title} className="feature-card">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary">
              <ServiceIcon strokeWidth={1.8} className="h-6 w-6" />
            </span>
            <span className="badge">{service.pill}</span>
          </div>
          <h3 className="mt-6 text-2xl font-normal tracking-[-0.01em] text-ink">{service.title}</h3>
          <p className="mt-3 text-sm leading-6 text-body">{service.text}</p>
        </article>
        )
      })}
    </div>
  )
}
