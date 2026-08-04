import React from 'react'
import { PageShell } from '../components/PageShell'
import { ServiceGrid } from '../sections/Services'

export function ServicesPage({ copy }) {
  return (
    <PageShell label={copy.services.label} title={copy.services.pageTitle} text={copy.services.pageText}>
      <ServiceGrid services={copy.services.items} />
    </PageShell>
  )
}
