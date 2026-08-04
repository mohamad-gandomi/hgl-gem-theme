import React from 'react'
export function SectionIntro({ label, title, text }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="badge mx-auto">{label}</p>
      <h2 className="mt-5 text-4xl font-normal tracking-[-0.02em] text-ink sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-body">{text}</p>}
    </div>
  )
}
