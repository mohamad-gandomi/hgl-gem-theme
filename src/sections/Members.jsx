import React from 'react'
import UserRoundCheck from 'lucide-react/dist/esm/icons/user-round-check.mjs'
import { memberIcons } from '../data/icons'
import { SectionIntro } from '../components/SectionIntro'

function memberPhoneHref(phone) {
  const digits = String(phone).replace(/\D/g, '')
  if (digits.startsWith('0')) return `tel:+98${digits.slice(1)}`
  return `tel:${digits}`
}

export function Members({ copy }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label={copy.members.label} title={copy.members.title} />
        <div className="grid gap-4 md:grid-cols-3">
          {copy.members.items.map((member, index) => {
            const MemberIcon = memberIcons[index] || UserRoundCheck

            return (
            <article key={member.name} className="feature-card">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary">
                <MemberIcon strokeWidth={1.8} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-body">{member.role}</p>
              <p className="mt-3 text-sm leading-6 text-body">{member.text}</p>
              <p className="mt-4 text-sm font-semibold text-ink">
                {copy.members.phone}:{' '}
                <a href={memberPhoneHref(member.phone)} className="hover:text-primary">{member.phone}</a>
              </p>
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
