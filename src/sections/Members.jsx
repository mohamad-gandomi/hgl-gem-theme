import React from 'react'
import UserRoundCheck from 'lucide-react/dist/esm/icons/user-round-check.mjs'
import { memberIcons } from '../data/icons'
import { SectionIntro } from '../components/SectionIntro'

function memberPhoneHref(phone) {
  const digits = String(phone).replace(/\D/g, '')
  if (digits.startsWith('0')) return `tel:+98${digits.slice(1)}`
  return `tel:${digits}`
}

function memberPhoneLabel(phone, locale) {
  if (locale !== 'en') return phone

  const digits = String(phone).replace(/\D/g, '')
  if (digits.startsWith('0')) return `0098 ${digits.slice(1, 4)} ${digits.slice(4)}`
  return `0098 ${digits}`
}

export function Members({ copy, locale }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label={copy.members.label} title={copy.members.title} />
        <div className="grid gap-4 md:grid-cols-3">
          {copy.members.items.map((member, index) => {
            const MemberIcon = memberIcons[index] || UserRoundCheck

            return (
            <article key={member.name} className="feature-card">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-purpleDeep/10 text-purpleDeep">
                <MemberIcon strokeWidth={1.8} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-body">{member.role}</p>
              <p className="mt-3 text-sm leading-6 text-body">{member.text}</p>
              <p className="mt-5 text-sm font-medium text-body">
                {copy.members.phone}:{' '}
                <a href={memberPhoneHref(member.phone)} className="text-xl font-semibold text-ink hover:text-primary">{memberPhoneLabel(member.phone, locale)}</a>
              </p>
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
