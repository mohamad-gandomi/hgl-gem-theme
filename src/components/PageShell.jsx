import React from 'react'
export function PageShell({ label, title, text, children }) {
  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="badge">{label}</p>
          <h1 className="page-title mt-6 max-w-4xl text-5xl font-normal leading-tight tracking-[-0.03em] text-ink sm:text-6xl">{title}</h1>
          {text && <p className="mt-5 max-w-2xl text-lg leading-8 text-body">{text}</p>}
        </div>
      </section>
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </section>
    </>
  )
}
