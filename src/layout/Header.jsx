import React, { useEffect, useState } from 'react'
import Globe2 from 'lucide-react/dist/esm/icons/globe-2.mjs'
import MapPin from 'lucide-react/dist/esm/icons/map-pin.mjs'
import Clock from 'lucide-react/dist/esm/icons/clock.mjs'
import Menu from 'lucide-react/dist/esm/icons/menu.mjs'
import PhoneCall from 'lucide-react/dist/esm/icons/phone-call.mjs'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import { brandName, contactInfo, content } from '../data/siteContent'
import { navIcons } from '../data/icons'
import { assetUrl } from '../utils/assets'
import { alternateHref, localizeHref } from '../utils/routing'

export function Header({ copy, locale, routePath, query = '', alternateRoutePath, navigate, onVerify, onSearch }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const go = (href) => {
    navigate(localizeHref(href, locale))
    setOpen(false)
  }

  const languageHref = alternateHref(alternateRoutePath || routePath, copy.altLocale, query)

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => go('/')} className="flex items-center gap-2 text-start text-ink">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink p-1.5">
            <img src={assetUrl('/assets/img/hgl-logo-mark.webp')} alt="HGL GEM logo" width="80" height="67" className="h-full w-full object-contain" />
          </span>
          <span className="text-base font-semibold">{brandName}</span>
        </button>
        <div className="hidden items-center gap-7 md:flex">
          {copy.nav.map((item) => {
            const NavIcon = navIcons[item.href]

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-ink ${routePath === item.href ? 'text-ink' : 'text-body'}`}
              >
                <NavIcon strokeWidth={1.7} className={`h-[18px] w-[18px] ${routePath === item.href ? 'text-primary' : 'text-muted'}`} />
                {item.label}
              </button>
            )
          })}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button type="button" onClick={() => navigate(languageHref)} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-hairlineStrong bg-surface px-3 text-sm font-medium text-ink hover:border-ink" aria-label="Switch language">
            {copy.langName}
            <Globe2 strokeWidth={1.8} className="h-4 w-4 text-muted" />
          </button>
          <button type="button" onClick={onSearch} className="grid h-10 w-10 place-items-center rounded-lg border border-hairlineStrong bg-surface text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label={copy.ui.search}>
            <Search strokeWidth={1.8} className="h-4 w-4" />
          </button>
          <button type="button" onClick={onVerify} className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink transition-colors hover:bg-primaryActive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {copy.ui.verify}
          </button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={onVerify} className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-ink transition-colors hover:bg-primaryActive">
            {copy.ui.verify}
          </button>
          <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-lg border border-hairline bg-surface" aria-label={copy.ui.menu}>
            {open ? <X strokeWidth={1.8} /> : <Menu strokeWidth={1.8} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-hairline bg-canvas md:hidden">
          <div className="mx-auto flex min-h-full max-w-7xl flex-col px-4 py-5">
            <div className="grid gap-3">
              {copy.nav.map((item) => {
                const NavIcon = navIcons[item.href]
                const active = routePath === item.href

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => go(item.href)}
                    className={`inline-flex min-h-14 items-center gap-3 rounded-xl border px-4 text-start text-base font-medium transition-colors ${active ? 'border-primary/60 bg-primary/10 text-ink' : 'border-hairline bg-surface text-body hover:border-hairlineStrong hover:text-ink'}`}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-lg ${active ? 'bg-primary text-ink' : 'bg-canvasSoft text-muted'}`}>
                      <NavIcon strokeWidth={1.8} className="h-5 w-5" />
                    </span>
                    {item.label}
                  </button>
                )
              })}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => navigate(languageHref)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-hairlineStrong bg-surface px-4 text-sm font-medium text-ink" aria-label="Switch language">
                {copy.langName}
                <Globe2 strokeWidth={1.8} className="h-5 w-5 text-muted" />
              </button>
              <button type="button" onClick={() => { setOpen(false); onSearch() }} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-hairlineStrong bg-surface px-4 text-sm font-medium text-ink" aria-label={copy.ui.search}>
                <Search strokeWidth={1.8} className="h-5 w-5 text-muted" />
                {copy.ui.search}
              </button>
            </div>
            <div className="mt-auto pt-8">
              <div className="rounded-xl border border-hairline bg-surface p-4 text-sm leading-7 text-body">
                <div className="flex gap-3 border-b border-hairline pb-4">
                  <MapPin strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <p>{contactInfo[locale].address}</p>
                </div>
                <div className="flex gap-3 border-b border-hairline py-4">
                  <Clock strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <p>{content[locale].footer.hoursPrefix}: {contactInfo[locale].hours}</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <PhoneCall strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <p className="flex flex-wrap gap-x-2 gap-y-1">
                    <span>{contactInfo[locale].phoneLabel}:</span>
                    {contactInfo.phones.map((phone, index) => (
                      <React.Fragment key={`mobile-${phone.href}`}>
                        {index > 0 && <span className="text-mutedSoft">|</span>}
                        <a href={phone.href} className="font-semibold text-ink hover:text-primary">{phone.label}</a>
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
