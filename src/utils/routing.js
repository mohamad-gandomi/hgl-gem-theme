export function normalizePath(path) {
  const locale = path === '/en' || path.startsWith('/en/') ? 'en' : 'fa'
  const routePath = locale === 'en' ? path.replace(/^\/en/, '') || '/' : path
  return { locale, routePath }
}

export function localizeHref(href, locale) {
  if (locale === 'fa') return href
  return href === '/' ? '/en' : `/en${href}`
}

export function alternateHref(routePath, nextLocale) {
  return nextLocale === 'fa' ? routePath : localizeHref(routePath, 'en')
}
