import React from 'react'
import { AboutImage } from '../components/AboutImage'
import { PageShell } from '../components/PageShell'

export function AboutPage({ copy }) {
  return (
    <PageShell label={copy.aboutPage.label} title={copy.aboutPage.title} text={copy.aboutPage.text}>
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <AboutImage className="lg:sticky lg:top-24" />
        <div className="space-y-4 text-base leading-7 text-body">
          {copy.aboutPage.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.aboutPage.cards.map((item) => (
              <div key={item} className="rounded-xl border border-hairline bg-surface p-5">
                <p className="text-sm font-semibold text-ink">{item}</p>
                <p className="mt-2 text-sm leading-6 text-body">{copy.aboutPage.cardText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
