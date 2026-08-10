import React from 'react'
import { AboutImage } from '../components/AboutImage'
import { LinkButton } from '../components/LinkButton'

export function AboutPreview({ copy, locale, navigate }) {
  return (
    <section className="section-pad border-y border-hairline bg-canvasSoft">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="badge">{copy.aboutPreview.label}</p>
          <h2 className="section-title mt-5 text-2xl font-normal tracking-[-0.02em] text-ink sm:text-3xl">{copy.aboutPreview.title}</h2>
          <p className="mt-5 text-base leading-7 text-body">{copy.aboutPreview.text}</p>
          <LinkButton href="/about" locale={locale} navigate={navigate} className="mt-8 border border-hairlineStrong bg-surface text-ink hover:border-ink" icon>{copy.aboutPreview.button}</LinkButton>
        </div>
        <AboutImage />
      </div>
    </section>
  )
}
