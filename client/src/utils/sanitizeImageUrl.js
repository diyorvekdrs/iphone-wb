/**
 * Block legacy third-party watermarked asset URLs in UI and when saving products.
 */
function isDisallowedProductImageUrl(url) {
  if (url == null || typeof url !== 'string') return false
  const u = url.toLowerCase()
  return u.includes('citypng') || u.includes('/citypng/')
}

/** For display: return null if URL is disallowed or missing. */
export function sanitizeProductImageUrl(url) {
  if (url == null || url === '') return null
  if (isDisallowedProductImageUrl(url)) return null
  return url
}

/** For admin create/update: strip disallowed URLs so they are not stored. */
export function sanitizeProductImageUrlForSave(url) {
  const t = String(url ?? '').trim()
  if (!t) return null
  if (isDisallowedProductImageUrl(t)) return null
  return t
}
