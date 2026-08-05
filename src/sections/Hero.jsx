import React from 'react'
import { LinkButton } from '../components/LinkButton'
import { assetUrl } from '../utils/assets'

export function Hero({ copy, locale, navigate }) {
  return (
    <section className="hero-section border-b border-hairline">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_.98fr] lg:items-center">
          <div>
            <p className="badge">{copy.hero.label}</p>
            <h1 className="mt-6 max-w-3xl text-3xl font-normal leading-[1.35] tracking-[-0.01em] text-ink sm:text-4xl lg:text-5xl">{copy.hero.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-body">{copy.hero.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/about" locale={locale} navigate={navigate} className="bg-ink text-canvas hover:bg-primary" icon>{copy.hero.about}</LinkButton>
              <LinkButton href="/contact" locale={locale} navigate={navigate} className="border border-hairlineStrong bg-surface text-ink hover:border-ink">{copy.hero.contact}</LinkButton>
            </div>
          </div>
          <HeroImage />
        </div>
      </div>
    </section>
  )
}

function HeroImage() {
  return (
    <figure className="rounded-xl border border-hairline bg-surface p-3">
      <div className="overflow-hidden rounded-lg border border-hairline bg-canvasSoft">
        <img src={assetUrl('/assets/img/hero-image.webp')} alt="Polished turquoise gemstone" className="h-full min-h-[340px] w-full object-cover" decoding="async" fetchPriority="high" />
      </div>
    </figure>
  )
}
