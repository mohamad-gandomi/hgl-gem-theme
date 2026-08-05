import React from 'react'
import FileCheck2 from 'lucide-react/dist/esm/icons/file-check-2.mjs'
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check.mjs'
import { VerifyForm } from '../components/VerifyForm'

export function CertificatePage({ copy, slug }) {
  const certificateCopy = copy.certificatePage || {
    label: copy.ui.verifyLabel,
    title: copy.ui.verifyTitle,
    text: copy.ui.verifyText,
    slugLabel: 'Report number',
    protectedTitle: 'Protected report access',
    protectedText: 'Enter the code printed on the report to open the verified PDF report.'
  }

  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <p className="badge">{certificateCopy.label}</p>
            <h1 className="page-title mt-6 max-w-3xl text-4xl font-normal leading-tight text-ink sm:text-5xl">{certificateCopy.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-body">{certificateCopy.text}</p>
          </div>
          <div className="rounded-xl border border-hairline bg-surface p-6">
            <div className="flex items-center gap-3 border-b border-hairline pb-5">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary">
                <FileCheck2 strokeWidth={1.8} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-body">{certificateCopy.slugLabel}</p>
                <p className="mt-1 font-semibold text-ink">{slug}</p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <ShieldCheck strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p role="heading" aria-level="2" className="text-base font-semibold leading-7 text-ink">{certificateCopy.protectedTitle}</p>
                <p className="mt-2 text-sm leading-6 text-body">{certificateCopy.protectedText}</p>
              </div>
            </div>
            <div className="mt-6">
              <VerifyForm copy={copy} slug={slug} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
