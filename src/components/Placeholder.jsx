import React from 'react'
export function Placeholder({ label }) {
  return (
    <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-hairlineStrong bg-canvasSoft p-4 text-center text-xs font-medium uppercase tracking-[0.08em] text-muted">
      {label}
    </div>
  )
}
