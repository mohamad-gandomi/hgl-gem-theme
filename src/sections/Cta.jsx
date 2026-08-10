import React from 'react'
import { LinkButton } from '../components/LinkButton'

export function Cta({ copy, locale, navigate }) {
  return (
    <section className="section-pad border-y border-hairline bg-canvasSoft">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="badge mx-auto">{copy.cta.label}</p>
        <h2 className="section-title mt-5 text-2xl font-normal tracking-[-0.02em] text-ink sm:text-3xl">{copy.cta.title}</h2>
        <p className="mt-5 text-base leading-7 text-body">{copy.cta.text}</p>
        <LinkButton href="/contact" locale={locale} navigate={navigate} className="mt-8 bg-primary text-ink hover:bg-primaryActive" icon>{copy.cta.button}</LinkButton>
      </div>
    </section>
  )
}
