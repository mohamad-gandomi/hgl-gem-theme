import React from 'react'
export function Field({ label, placeholder, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <input className="mt-2 h-11 w-full rounded-lg border border-hairline bg-canvasSoft px-4 text-sm text-ink outline-none focus:border-primary" placeholder={placeholder} />
    </label>
  )
}
