import React from 'react'
import { LinkButton } from '../components/LinkButton'
import { PageShell } from '../components/PageShell'
import { Placeholder } from '../components/Placeholder'

export function SingleBlogPage({ copy, locale, post, navigate }) {
  return (
    <PageShell label={post.date} title={post.title} text={post.excerpt}>
      <article className="mx-auto max-w-3xl rounded-xl border border-hairline bg-surface p-6 sm:p-8">
        <Placeholder label={copy.singlePost.cover} />
        <div className="prose-copy mt-8">
          <p>{copy.singlePost.intro}</p>
          <h2>{copy.singlePost.headingOne}</h2>
          <p>{copy.singlePost.textOne}</p>
          <h2>{copy.singlePost.headingTwo}</h2>
          <p>{copy.singlePost.textTwo}</p>
        </div>
        <LinkButton href="/blog" locale={locale} navigate={navigate} className="mt-8 border border-hairlineStrong bg-canvas text-ink hover:border-ink">{copy.ui.backToBlog}</LinkButton>
      </article>
    </PageShell>
  )
}
