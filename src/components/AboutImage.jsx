import React from 'react'
import { assetUrl } from '../utils/assets'

export function AboutImage({ className = '' }) {
  return (
    <figure className={`overflow-hidden rounded-xl border border-hairline bg-surface p-3 ${className}`}>
      <img
        src={assetUrl('/assets/img/about-us-768.webp')}
        srcSet={`${assetUrl('/assets/img/about-us-640.webp')} 640w, ${assetUrl('/assets/img/about-us-768.webp')} 768w`}
        sizes="(min-width: 1024px) 576px, calc(100vw - 32px)"
        width="768"
        height="431"
        alt="Green gemstones under gemological inspection"
        className="h-full min-h-[320px] w-full rounded-lg object-cover"
        loading="lazy"
        decoding="async"
      />
    </figure>
  )
}
