export function assetUrl(path) {
  const base = window.HGL_WP?.assetBase || ''
  return `${base}${path}`
}
