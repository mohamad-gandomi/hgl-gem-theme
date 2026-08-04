import React from 'react'
import Check from 'lucide-react/dist/esm/icons/check.mjs'
import { whyIcons } from '../data/icons'
import { SectionIntro } from '../components/SectionIntro'

export function WhyUs({ copy }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label={copy.why.label} title={copy.why.title} text={copy.why.text} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {copy.why.points.map((point, index) => {
            const WhyIcon = whyIcons[index] || Check

            return (
            <article key={point.title} className="feature-card">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary">
                <WhyIcon strokeWidth={1.8} className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-lg font-semibold text-ink">{point.title}</h3>
              <p className="mt-3 text-sm leading-6 text-body">{point.text}</p>
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
