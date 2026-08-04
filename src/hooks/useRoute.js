import { useCallback, useEffect, useState } from 'react'

export function useRoute() {
  const getPath = useCallback(() => window.location.pathname || '/', [])
  const [path, setPath] = useState(getPath)

  useEffect(() => {
    const onPop = () => setPath(getPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [getPath])

  const navigate = useCallback((href) => {
    if (href === window.location.pathname) return
    window.history.pushState({}, '', href)
    setPath(href)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return { path, navigate }
}
