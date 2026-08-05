import React from 'react'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import { VerifyForm } from '../VerifyForm'

export function VerifyModal({ copy, open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/45 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="verify-title">
      <div className="w-full max-w-md rounded-xl border border-hairline bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="badge">{copy.ui.verifyLabel}</p>
            <h2 id="verify-title" className="mt-4 text-2xl font-normal tracking-[-0.01em] text-ink">{copy.ui.verifyTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-body">{copy.ui.verifyText}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-hairlineStrong bg-canvas text-ink hover:border-ink" aria-label={copy.ui.close}>
            <X strokeWidth={1.8} className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">
          <VerifyForm copy={copy} />
        </div>
      </div>
    </div>
  )
}
