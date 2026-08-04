import React from 'react'
import { LinkButton } from '../components/LinkButton'
import { PageShell } from '../components/PageShell'

export function NotFoundPage({ copy, locale, navigate }) {
  return (
    <PageShell label={copy.notFoundPage.label} title={copy.notFoundPage.title} text={copy.notFoundPage.text}>
      <div className="rounded-xl border border-hairline bg-surface p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/" locale={locale} navigate={navigate} className="bg-primary text-ink hover:bg-primaryActive" icon>{copy.notFoundPage.home}</LinkButton>
          <LinkButton href="/contact" locale={locale} navigate={navigate} className="border border-hairlineStrong bg-canvas text-ink hover:border-ink">{copy.notFoundPage.contact}</LinkButton>
        </div>
      </div>
    </PageShell>
  )
}
