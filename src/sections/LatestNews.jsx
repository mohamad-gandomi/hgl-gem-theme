import React from 'react'
import { PostGrid } from '../components/PostGrid'
import { SectionIntro } from '../components/SectionIntro'

export function LatestNews({ copy, locale, navigate }) {
  return (
    <section className="section-pad border-t border-hairline bg-canvasSoft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label={copy.news.label} title={copy.news.title} />
        <PostGrid copy={copy} locale={locale} posts={copy.posts.slice(0, 3)} navigate={navigate} />
      </div>
    </section>
  )
}
