/** Normalize DB-backed `image_url` fields before sending to clients. */
export function stripDisallowedProductImageUrl(url) {
  if (url == null || typeof url !== 'string') return null
  const u = url.toLowerCase()
  if (u.includes('citypng') || u.includes('/citypng/')) return null
  return url
}

export function sanitizeProductRowImage(row) {
  if (!row || typeof row !== 'object') return row
  const next = { ...row }
  if ('image_url' in next) {
    next.image_url = stripDisallowedProductImageUrl(next.image_url)
  }
  return next
}

export function sanitizeOrderItemRow(row) {
  if (!row || typeof row !== 'object') return row
  return {
    ...row,
    product_image_url: stripDisallowedProductImageUrl(row.product_image_url),
  }
}
