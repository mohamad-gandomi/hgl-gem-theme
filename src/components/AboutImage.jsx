import React from 'react'
export function AboutImage({ className = '' }) {
  return (
    <figure className={`overflow-hidden rounded-xl border border-hairline bg-surface p-3 ${className}`}>
      <img src="/assets/img/about-us.webp" alt="Green gemstones under gemological inspection" className="h-full min-h-[320px] w-full rounded-lg object-cover" loading="lazy" decoding="async" />
    </figure>
  )
}
