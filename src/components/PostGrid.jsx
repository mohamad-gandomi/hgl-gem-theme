import React from 'react'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import { Placeholder } from './Placeholder'
import { localizeHref } from '../utils/routing'

export function PostGrid({ copy, locale, posts, navigate }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map((post) => (
        <article key={post.slug} className="feature-card">
          {post.cover ? (
            <img src={post.cover} alt="" className="aspect-[4/3] w-full rounded-lg border border-hairline object-cover" loading="lazy" decoding="async" />
          ) : (
            <Placeholder label={copy.singlePost.cover} />
          )}
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-muted">{post.date}</p>
          <h3 className="mt-3 text-xl font-normal tracking-[-0.01em] text-ink">{post.title}</h3>
          <p className="mt-3 text-sm leading-6 text-body">{post.excerpt}</p>
          <button type="button" onClick={() => navigate(localizeHref(`/blog/${post.slug}`, locale))} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-primary">
            {copy.ui.readArticle} <ArrowRight strokeWidth={1.8} className="direction-arrow h-4 w-4" />
          </button>
        </article>
      ))}
    </div>
  )
}
