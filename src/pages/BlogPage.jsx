import React from 'react'
import { PageShell } from '../components/PageShell'
import { PostGrid } from '../components/PostGrid'

export function BlogPage({ copy, locale, navigate }) {
  return (
    <PageShell label={copy.blogPage.label} title={copy.blogPage.title} text={copy.blogPage.text}>
      <PostGrid copy={copy} locale={locale} posts={copy.posts} navigate={navigate} />
    </PageShell>
  )
}
