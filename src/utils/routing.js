export function normalizePath(path) {
  const [cleanPath, query = ''] = path.split('?')
  const locale = cleanPath === '/en' || cleanPath.startsWith('/en/') ? 'en' : 'fa'
  const rawRoutePath = locale === 'en' ? cleanPath.replace(/^\/en/, '') || '/' : cleanPath
  const routePath = rawRoutePath.length > 1 ? rawRoutePath.replace(/\/+$/, '') : rawRoutePath
  return { locale, routePath, query }
}

export function localizeHref(href, locale) {
  if (locale === 'fa') return href
  return href === '/' ? '/en' : `/en${href}`
}

export function alternateHref(routePath, nextLocale) {
  return nextLocale === 'fa' ? routePath : localizeHref(routePath, 'en')
}
