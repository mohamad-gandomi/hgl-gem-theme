import React from 'react'
import { PageShell } from '../components/PageShell'
import { PostGrid } from '../components/PostGrid'

export function BlogPage({ copy, locale, posts, navigate }) {
  return (
    <PageShell label={copy.blogPage.label} title={copy.blogPage.title} text={copy.blogPage.text}>
      <PostGrid copy={copy} locale={locale} posts={posts} navigate={navigate} />
    </PageShell>
  )
}
