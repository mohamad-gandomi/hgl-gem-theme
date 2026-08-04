import React from 'react'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import { localizeHref } from '../../utils/routing'

export function SearchModal({ copy, locale, navigate, open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/45 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <div className="w-full max-w-lg rounded-xl border border-hairline bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="badge">{copy.ui.search}</p>
            <h2 id="search-title" className="mt-4 text-2xl font-normal tracking-[-0.01em] text-ink">{copy.ui.searchTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-body">{copy.ui.searchText}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-hairlineStrong bg-canvas text-ink hover:border-ink" aria-label={copy.ui.close}>
            <X strokeWidth={1.8} className="h-4 w-4" />
          </button>
        </div>
        <label className="mt-6 block">
          <span className="text-sm font-medium text-ink">{copy.ui.searchTerm}</span>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-hairline bg-canvasSoft px-4 focus-within:border-primary">
            <Search strokeWidth={1.8} className="h-4 w-4 text-muted" />
            <input className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" placeholder={copy.ui.searchPlaceholder} />
          </div>
        </label>
        <button
          type="button"
          onClick={() => {
            onClose()
            navigate(localizeHref('/search', locale))
          }}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive"
        >
          {copy.ui.search}
        </button>
      </div>
    </div>
  )
}
