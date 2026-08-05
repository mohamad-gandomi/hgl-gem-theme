import React from 'react'
import { brandName, contactInfo } from '../data/siteContent'
import { assetUrl } from '../utils/assets'
import { localizeHref } from '../utils/routing'

export function Footer({ copy, contacts, locale, posts, navigate }) {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1.7fr_repeat(2,1fr)] lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink p-1.5">
              <img src={assetUrl('/assets/img/hgl-logo.webp')} alt="HGL GEM logo" className="h-full w-full object-contain" />
            </span>
            <span className="font-semibold">{brandName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-body">{copy.footer.text}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">{copy.footer.contact}</h3>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-body">
            <p>{contacts.address}</p>
            <p>{copy.footer.hoursPrefix}: {contacts.hours}</p>
            <p className="flex flex-wrap gap-x-2 gap-y-1">
              <span>{contacts.phoneLabel}:</span>
              {contactInfo.phones.map((phone, index) => (
                <React.Fragment key={phone.href}>
                  {index > 0 && <span>|</span>}
                  <a href={phone.href} className="font-medium text-ink hover:text-primary">{phone.label}</a>
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">{copy.footer.lastPosts}</h3>
          <div className="mt-4 grid gap-3">
            {posts.slice(0, 3).map((post) => (
              <button key={`footer-${post.slug}`} type="button" onClick={() => navigate(localizeHref(`/blog/${post.slug}`, locale))} className="text-start text-sm leading-6 text-body hover:text-ink">
                {post.title}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">{copy.footer.services}</h3>
          <div className="mt-4 grid gap-3">
            {copy.services.items.map((service) => (
              <button key={`footer-${service.title}`} type="button" onClick={() => navigate(localizeHref('/services', locale))} className="text-start text-sm text-body hover:text-ink">
                {service.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
