import React from 'react'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import { localizeHref } from '../utils/routing'

export function LinkButton({ href, locale, navigate, children, className = '', icon = false }) {
  return (
    <button
      type="button"
      onClick={() => navigate(localizeHref(href, locale))}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      {children}
      {icon && <ArrowRight strokeWidth={1.8} className="direction-arrow h-4 w-4" />}
    </button>
  )
}
