import { useEffect, useState } from 'react'

function normalizePost(post) {
  return {
    id: post.id || null,
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    content: post.content || '',
    cover: post.cover || '',
    coverImage: post.coverImage || null,
    heroImage: post.heroImage || null,
    categories: post.categories || [],
    language: post.language || '',
    translationId: post.translationId || 0,
    translation: post.translation || null
  }
}

export function useWordPressPosts(fallbackPosts, locale, options = {}) {
  const [posts, setPosts] = useState(fallbackPosts)
  const [meta, setMeta] = useState({ total: fallbackPosts.length, totalPages: 1, page: 1, perPage: fallbackPosts.length })
  const [loading, setLoading] = useState(false)
  const optionKey = JSON.stringify(options)

  useEffect(() => {
    if (options.enabled === false) {
      setPosts(fallbackPosts)
      setMeta({ total: fallbackPosts.length, totalPages: 1, page: 1, perPage: fallbackPosts.length })
      setLoading(false)
      return
    }

    const restUrl = window.HGL_WP?.restUrl
    if (!restUrl) {
      setPosts(fallbackPosts)
      setMeta({ total: fallbackPosts.length, totalPages: 1, page: 1, perPage: fallbackPosts.length })
      return
    }

    const controller = new AbortController()
    let timer = null
    let active = true
    const load = () => {
      const params = new URLSearchParams({
        lang: locale,
        per_page: String(options.perPage || 8),
        page: String(options.page || 1)
      })

      if (options.search) params.set('search', options.search)
      if (options.category) params.set('category', options.category)

      setLoading(true)
      fetch(`${restUrl}posts?${params.toString()}`, {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
        signal: controller.signal
      })
        .then((response) => {
          if (!response.ok) throw new Error('Unable to load posts')
          return response.json()
        })
        .then((data) => {
          if (!active) return
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
            setMeta({ total: data.total || 0, totalPages: data.totalPages || 1, page: data.page || options.page || 1, perPage: options.perPage || 8 })
          }
        })
        .catch((error) => {
          if (active && error.name !== 'AbortError') {
            setPosts(fallbackPosts)
            setMeta({ total: fallbackPosts.length, totalPages: 1, page: 1, perPage: fallbackPosts.length })
          }
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }

    if (options.deferMs > 0) {
      timer = window.setTimeout(load, options.deferMs)
    } else {
      load()
    }

    return () => {
      active = false
      if (timer) window.clearTimeout(timer)
      controller.abort()
    }
  }, [fallbackPosts, locale, optionKey])

  return { posts, loading, meta }
}

export function useWordPressPost(slug, locale) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const restUrl = window.HGL_WP?.restUrl
    const cleanSlug = String(slug || '').trim()

    if (!restUrl || !cleanSlug) {
      setPost(null)
      setLoading(false)
      setNotFound(false)
      return
    }

    const controller = new AbortController()
    let active = true
    const params = new URLSearchParams({ lang: locale || 'fa' })

    setPost(null)
    setLoading(true)
    setNotFound(false)
    fetch(`${restUrl}posts/${encodeURIComponent(cleanSlug)}?${params.toString()}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then((response) => {
        if (response.status === 404) {
          if (active) setNotFound(true)
          return null
        }
        if (!response.ok) throw new Error('Unable to load post')
        return response.json()
      })
      .then((data) => {
        if (active) setPost(data ? normalizePost(data) : null)
      })
      .catch((error) => {
        if (active && error.name !== 'AbortError') {
          setPost(null)
          setNotFound(true)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [slug, locale])

  return { post, loading, notFound }
}

export function useWordPressCategories(locale) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const restUrl = window.HGL_WP?.restUrl
    if (!restUrl) return

    const controller = new AbortController()
    let active = true
    const params = new URLSearchParams({ lang: locale || 'fa' })

    setCategories([])
    fetch(`${restUrl}categories?${params.toString()}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load categories')
        return response.json()
      })
      .then((data) => {
        if (active) setCategories(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (active) setCategories([])
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [locale])

  return categories
}
