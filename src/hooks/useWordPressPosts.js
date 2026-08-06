import { useEffect, useRef, useState } from 'react'

function normalizePost(post) {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    content: post.content || '',
    cover: post.cover || '',
    coverImage: post.coverImage || null,
    heroImage: post.heroImage || null,
    categories: post.categories || []
  }
}

export function useWordPressPosts(fallbackPosts, locale, options = {}) {
  const [posts, setPosts] = useState(fallbackPosts)
  const [meta, setMeta] = useState({ total: fallbackPosts.length, totalPages: 1, page: 1, perPage: fallbackPosts.length })
  const [loading, setLoading] = useState(false)
  const requestKeyRef = useRef('')
  const optionKey = JSON.stringify(options)

  useEffect(() => {
    if (options.enabled === false) {
      requestKeyRef.current = ''
      setPosts(fallbackPosts)
      setMeta({ total: fallbackPosts.length, totalPages: 1, page: 1, perPage: fallbackPosts.length })
      setLoading(false)
      return
    }

    const restUrl = window.HGL_WP?.restUrl
    if (!restUrl) {
      requestKeyRef.current = ''
      setPosts(fallbackPosts)
      setMeta({ total: fallbackPosts.length, totalPages: 1, page: 1, perPage: fallbackPosts.length })
      return
    }

    const controller = new AbortController()
    const params = new URLSearchParams({
      lang: locale,
      per_page: String(options.perPage || 8),
      page: String(options.page || 1)
    })

    if (options.search) params.set('search', options.search)
    if (options.category) params.set('category', options.category)

    const requestKey = `${restUrl}posts?${params.toString()}`

    if (requestKeyRef.current === requestKey) {
      return () => controller.abort()
    }

    requestKeyRef.current = requestKey
    setLoading(true)
    fetch(requestKey, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load posts')
        return response.json()
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : data.items

        if (Array.isArray(items) && items.length) {
          setPosts(items.map(normalizePost))
          setMeta({
            total: data.total || items.length,
            totalPages: data.totalPages || 1,
            page: data.page || options.page || 1,
            perPage: data.perPage || options.perPage || items.length
          })
        } else {
          setPosts([])
          setMeta({ total: data.total || 0, totalPages: data.totalPages || 1, page: data.page || options.page || 1, perPage: data.perPage || options.perPage || 8 })
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          requestKeyRef.current = ''
          setPosts(fallbackPosts)
          setMeta({ total: fallbackPosts.length, totalPages: 1, page: 1, perPage: fallbackPosts.length })
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [fallbackPosts, locale, optionKey])

  return { posts, loading, meta }
}

export function useWordPressCategories(locale) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const restUrl = window.HGL_WP?.restUrl
    if (!restUrl) return

    const controller = new AbortController()
    const params = new URLSearchParams({ lang: locale || 'fa' })

    fetch(`${restUrl}categories?${params.toString()}`, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load categories')
        return response.json()
      })
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))

    return () => controller.abort()
  }, [locale])

  return categories
}
