import React from 'react'
import { PageShell } from '../components/PageShell'
import { PostGrid } from '../components/PostGrid'
import { useWordPressCategories, useWordPressPosts } from '../hooks/useWordPressPosts'
import { localizeHref } from '../utils/routing'

export function BlogPage({ copy, locale, posts: fallbackPosts, query, navigate }) {
  const params = new URLSearchParams(query)
  const page = Math.max(Number(params.get('page') || 1), 1)
  const category = params.get('category') || ''
  const { posts, meta, loading } = useWordPressPosts(fallbackPosts, locale, { perPage: 9, page, category })
  const categories = useWordPressCategories(locale)
  const labels = locale === 'fa'
    ? { loading: 'در حال بارگذاری...', previous: 'قبلی', next: 'بعدی' }
    : { loading: 'Loading...', previous: 'Previous', next: 'Next' }

  const goTo = (nextPage, nextCategory = category) => {
    const next = new URLSearchParams()
    if (nextPage > 1) next.set('page', String(nextPage))
    if (nextCategory) next.set('category', nextCategory)
    const suffix = next.toString() ? `?${next.toString()}` : ''
    navigate(localizeHref(`/blog${suffix}`, locale))
  }

  return (
    <PageShell label={copy.blogPage.label} title={copy.blogPage.title} text={copy.blogPage.text}>
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button type="button" onClick={() => goTo(1, '')} className={`rounded-full border px-3 py-2 text-sm ${category === '' ? 'border-primary bg-primary text-ink' : 'border-hairline bg-surface text-body hover:border-hairlineStrong'}`}>
            {locale === 'fa' ? 'همه' : 'All'}
          </button>
          {categories.map((item) => (
            <button key={item.slug} type="button" onClick={() => goTo(1, item.slug)} className={`rounded-full border px-3 py-2 text-sm ${category === item.slug ? 'border-primary bg-primary text-ink' : 'border-hairline bg-surface text-body hover:border-hairlineStrong'}`}>
              {item.name}
            </button>
          ))}
        </div>
      )}
      {loading && <p className="mb-4 text-sm text-body">{copy.searchPage.loading || labels.loading}</p>}
      <PostGrid copy={copy} locale={locale} posts={posts} navigate={navigate} loading={loading} skeletonCount={9} />
      {meta.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between gap-3">
          <button type="button" disabled={page <= 1} onClick={() => goTo(page - 1)} className="rounded-lg border border-hairlineStrong bg-surface px-4 py-2 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-40">
            {copy.blogPage.previous || labels.previous}
          </button>
          <span className="text-sm text-body">{page} / {meta.totalPages}</span>
          <button type="button" disabled={page >= meta.totalPages} onClick={() => goTo(page + 1)} className="rounded-lg border border-hairlineStrong bg-surface px-4 py-2 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-40">
            {copy.blogPage.next || labels.next}
          </button>
        </div>
      )}
    </PageShell>
  )
}
