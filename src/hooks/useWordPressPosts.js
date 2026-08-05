import { useEffect, useState } from 'react'

function normalizePost(post) {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    content: post.content || '',
    cover: post.cover || ''
  }
}

export function useWordPressPosts(fallbackPosts, locale) {
  const [posts, setPosts] = useState(fallbackPosts)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const restUrl = window.HGL_WP?.restUrl
    if (!restUrl) {
      setPosts(fallbackPosts)
      return
    }

    const controller = new AbortController()
    const params = new URLSearchParams({ lang: locale })

    setLoading(true)
    fetch(`${restUrl}posts?${params.toString()}`, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load posts')
        return response.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setPosts(data.map(normalizePost))
        } else {
          setPosts(fallbackPosts)
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setPosts(fallbackPosts)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [fallbackPosts, locale])

  return { posts, loading }
}
