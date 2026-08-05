import React from 'react'
import { LinkButton } from '../components/LinkButton'
import { PageShell } from '../components/PageShell'
import { Placeholder } from '../components/Placeholder'
import { localizeHref } from '../utils/routing'

export function SingleBlogPage({ copy, locale, post, posts = [], navigate }) {
  const recentPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 4)
  const categories = post.categories || []
  const image = post.heroImage?.src ? post.heroImage : post.coverImage
  const categoryLabel = locale === 'fa' ? 'دسته‌بندی‌ها' : 'Categories'

  return (
    <PageShell label={post.date} title={post.title} text={post.excerpt}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="rounded-xl border border-hairline bg-surface p-6 sm:p-8">
          {image?.src ? (
            <img
              src={image.src}
              srcSet={image.srcset || undefined}
              sizes={image.sizes || '(min-width: 1024px) 768px, 100vw'}
              width={image.width || undefined}
              height={image.height || undefined}
              alt={image.alt || ''}
              className="aspect-[16/9] w-full rounded-lg border border-hairline object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <Placeholder label={copy.singlePost.cover} />
          )}
          {post.content ? (
            <div className="prose-copy mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <div className="prose-copy mt-8">
              <p>{copy.singlePost.intro}</p>
              <h2>{copy.singlePost.headingOne}</h2>
              <p>{copy.singlePost.textOne}</p>
              <h2>{copy.singlePost.headingTwo}</h2>
              <p>{copy.singlePost.textTwo}</p>
            </div>
          )}
          <LinkButton href="/blog" locale={locale} navigate={navigate} className="mt-8 border border-hairlineStrong bg-canvas text-ink hover:border-ink">{copy.ui.backToBlog}</LinkButton>
        </article>

        <aside className="h-fit rounded-xl border border-hairline bg-surface p-5 lg:sticky lg:top-24">
          {categories.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-ink">{copy.singlePost.categories || categoryLabel}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => navigate(localizeHref(`/blog?category=${encodeURIComponent(category.slug)}`, locale))}
                    className="rounded-full border border-hairline bg-canvasSoft px-3 py-1.5 text-xs font-medium text-body hover:border-hairlineStrong hover:text-ink"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {recentPosts.length > 0 && (
            <div className={categories.length > 0 ? 'mt-6 border-t border-hairline pt-6' : ''}>
              <h2 className="text-base font-semibold text-ink">{copy.footer.lastPosts}</h2>
              <div className="mt-3 grid gap-3">
                {recentPosts.map((item) => (
                  <button key={item.slug} type="button" onClick={() => navigate(localizeHref(`/blog/${item.slug}`, locale))} className="text-start text-sm leading-6 text-body hover:text-primary">
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </PageShell>
  )
}
