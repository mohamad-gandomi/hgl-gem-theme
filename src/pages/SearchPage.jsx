import React, { useEffect, useState } from 'react'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import { PageShell } from '../components/PageShell'
import { PostGrid } from '../components/PostGrid'
import { useWordPressPosts } from '../hooks/useWordPressPosts'
import { localizeHref } from '../utils/routing'

const emptyPosts = []

export function SearchPage({ copy, locale, query, navigate }) {
  const params = new URLSearchParams(query)
  const initialTerm = params.get('q') || ''
  const page = Math.max(Number(params.get('page') || 1), 1)
  const [term, setTerm] = useState(initialTerm)
  const hasSearch = initialTerm.trim().length > 0
  const { posts, meta, loading } = useWordPressPosts(emptyPosts, locale, { perPage: 8, page, search: initialTerm, enabled: hasSearch })
  const labels = locale === 'fa'
    ? { loading: 'در حال بارگذاری...', previous: 'قبلی', next: 'بعدی', emptyTitle: 'نتایج جستجو', emptyText: 'برای شروع، عبارت مورد نظر خود را وارد کنید.', noResults: 'نتیجه‌ای پیدا نشد.' }
    : { loading: 'Loading...', previous: 'Previous', next: 'Next', emptyTitle: 'Search results', emptyText: 'Enter a search term to begin.', noResults: 'No posts found.' }

  useEffect(() => setTerm(initialTerm), [initialTerm])

  const runSearch = (value = term, nextPage = 1) => {
    const trimmed = value.trim()
    const next = new URLSearchParams()
    if (trimmed) next.set('q', trimmed)
    if (nextPage > 1) next.set('page', String(nextPage))
    const suffix = next.toString() ? `?${next.toString()}` : ''
    navigate(localizeHref(`/search${suffix}`, locale))
  }

  return (
    <PageShell label={copy.searchPage.label} title={copy.searchPage.title} text={copy.searchPage.text}>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <form onSubmit={(event) => { event.preventDefault(); runSearch() }} className="rounded-xl border border-hairline bg-surface p-6">
          <label className="block">
            <span className="text-sm font-medium text-ink">{copy.searchPage.field}</span>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-hairline bg-canvasSoft px-4 focus-within:border-primary">
              <Search strokeWidth={1.8} className="h-4 w-4 shrink-0 text-muted" />
              <input value={term} onChange={(event) => setTerm(event.target.value)} className="h-12 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" placeholder={copy.searchPage.placeholder} />
            </div>
          </label>
          <button type="submit" className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive">
            {copy.searchPage.button}
          </button>
        </form>
        <aside className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="text-2xl font-normal tracking-[-0.01em] text-ink">{copy.searchPage.quickTitle}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {copy.searchPage.quickItems.map((item) => (
              <button key={item} type="button" onClick={() => runSearch(item)} className="rounded-full border border-hairline bg-canvasSoft px-3 py-2 text-sm text-body hover:border-hairlineStrong hover:text-ink">
                {item}
              </button>
            ))}
          </div>
        </aside>
      </div>
      <section className="mt-6 rounded-xl border border-hairline bg-surface p-6">
        <h2 className="text-2xl font-normal tracking-[-0.01em] text-ink">{hasSearch ? copy.searchPage.resultTitle : labels.emptyTitle}</h2>
        {hasSearch && loading && posts.length === 0 && <p className="mt-3 text-sm leading-6 text-body">{copy.searchPage.loading || labels.loading}</p>}
        {!hasSearch ? (
          <p className="mt-3 text-sm leading-6 text-body">{labels.emptyText}</p>
        ) : (
          <div className="mt-5">
            {posts.length > 0 ? (
              <PostGrid copy={copy} locale={locale} posts={posts} navigate={navigate} />
            ) : (
              !loading && <div className="rounded-xl border border-hairline bg-canvasSoft p-6 text-sm leading-6 text-body">{copy.searchPage?.empty || labels.noResults}</div>
            )}
            {meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between gap-3">
                <button type="button" disabled={page <= 1} onClick={() => runSearch(initialTerm, page - 1)} className="rounded-lg border border-hairlineStrong bg-canvas px-4 py-2 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-40">{copy.blogPage.previous || labels.previous}</button>
                <span className="text-sm text-body">{page} / {meta.totalPages}</span>
                <button type="button" disabled={page >= meta.totalPages} onClick={() => runSearch(initialTerm, page + 1)} className="rounded-lg border border-hairlineStrong bg-canvas px-4 py-2 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-40">{copy.blogPage.next || labels.next}</button>
              </div>
            )}
          </div>
        )}
      </section>
    </PageShell>
  )
}
