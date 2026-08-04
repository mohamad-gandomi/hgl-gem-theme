import React from 'react'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import { PageShell } from '../components/PageShell'

export function SearchPage({ copy }) {
  return (
    <PageShell label={copy.searchPage.label} title={copy.searchPage.title} text={copy.searchPage.text}>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-xl border border-hairline bg-surface p-6">
          <label className="block">
            <span className="text-sm font-medium text-ink">{copy.searchPage.field}</span>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-hairline bg-canvasSoft px-4 focus-within:border-primary">
              <Search strokeWidth={1.8} className="h-4 w-4 shrink-0 text-muted" />
              <input className="h-12 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" placeholder={copy.searchPage.placeholder} />
            </div>
          </label>
          <button type="button" className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive">
            {copy.searchPage.button}
          </button>
        </section>
        <aside className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="text-2xl font-normal tracking-[-0.01em] text-ink">{copy.searchPage.quickTitle}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {copy.searchPage.quickItems.map((item) => (
              <span key={item} className="rounded-full border border-hairline bg-canvasSoft px-3 py-2 text-sm text-body">
                {item}
              </span>
            ))}
          </div>
        </aside>
      </div>
      <section className="mt-6 rounded-xl border border-hairline bg-surface p-6">
        <h2 className="text-2xl font-normal tracking-[-0.01em] text-ink">{copy.searchPage.resultTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-body">{copy.searchPage.resultText}</p>
      </section>
    </PageShell>
  )
}
