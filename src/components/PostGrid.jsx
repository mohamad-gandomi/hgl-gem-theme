import React from 'react'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import { Placeholder } from './Placeholder'
import { localizeHref } from '../utils/routing'

export function PostGrid({ copy, locale, posts, navigate }) {
  if (!posts.length) {
    const emptyLabel = locale === 'fa' ? 'نتیجه‌ای پیدا نشد.' : 'No posts found.'

    return <div className="rounded-xl border border-hairline bg-surface p-6 text-sm leading-6 text-body">{copy.searchPage?.empty || emptyLabel}</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map((post) => (
        <article key={post.slug} className="feature-card flex h-full flex-col">
          {post.coverImage?.src || post.cover ? (
            <img
              src={post.coverImage?.src || post.cover}
              srcSet={post.coverImage?.srcset || undefined}
              sizes={post.coverImage?.sizes || undefined}
              width={post.coverImage?.width || undefined}
              height={post.coverImage?.height || undefined}
              alt={post.coverImage?.alt || ''}
              className="aspect-[4/3] w-full rounded-lg border border-hairline object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <Placeholder label={copy.singlePost.cover} />
          )}
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-muted">{post.date}</p>
          {post.categories?.length > 0 && <p className="mt-2 text-xs font-medium text-primary">{post.categories[0].name}</p>}
          <h3 className="mt-3 truncate text-xl font-normal text-ink">{post.title}</h3>
          <p className="mt-3 text-sm leading-6 text-body">{post.excerpt}</p>
          <button type="button" onClick={() => navigate(localizeHref(`/blog/${post.slug}`, locale))} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-ink hover:text-primary">
            {copy.ui.readArticle} <ArrowRight strokeWidth={1.8} className="direction-arrow h-4 w-4" />
          </button>
        </article>
      ))}
    </div>
  )
}
