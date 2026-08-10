import React from 'react'
import { AboutPreview } from '../sections/AboutPreview'
import { Cta } from '../sections/Cta'
import { Hero } from '../sections/Hero'
import { LatestNews } from '../sections/LatestNews'
import { LicenseShowcase } from '../sections/LicenseShowcase'
import { Members } from '../sections/Members'
import { ServicesPreview } from '../sections/Services'
import { WhyUs } from '../sections/WhyUs'

export function HomePage({ copy, locale, posts, postsLoading = false, navigate }) {
  return (
    <>
      <Hero copy={copy} locale={locale} navigate={navigate} />
      <WhyUs copy={copy} />
      <AboutPreview copy={copy} locale={locale} navigate={navigate} />
      <LicenseShowcase copy={copy} />
      <Members copy={copy} locale={locale} />
      <Cta copy={copy} locale={locale} navigate={navigate} />
      <ServicesPreview copy={copy} locale={locale} navigate={navigate} />
      <LatestNews copy={copy} locale={locale} posts={posts} loading={postsLoading} navigate={navigate} />
    </>
  )
}
