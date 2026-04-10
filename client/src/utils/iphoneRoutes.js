import { iphoneModels } from '../data/iphoneModels.js'

/** Apple-style product page route. */
export function iphonePageHref(modelId) {
  return `#/iphone/${encodeURIComponent(modelId)}`
}

/** Store-style buy flow (storage, finish, carrier) before checkout. */
export function iphoneBuyHref(modelId) {
  return `#/buy-iphone/${encodeURIComponent(modelId)}`
}

/** Order processing with optional lineup id — cart adds matching catalog SKU / name. */
export function iphoneOrderHref(modelId) {
  return `#/order/${encodeURIComponent(modelId)}`
}

/**
 * Resolve a DB product for an iPhone lineup id (e.g. `17-pro`).
 * Prefers SKU (case-insensitive, underscores → dashes). Falls back to product name words.
 */
export function findProductByIphoneModelId(products, modelId) {
  if (!Array.isArray(products) || products.length === 0 || !modelId) return null
  const id = String(modelId).toLowerCase().trim()
  const normSku = (sku) => String(sku).toLowerCase().replace(/_/g, '-')

  const bySku = products.find((p) => {
    const sku = normSku(p.sku)
    return sku === id || sku === `iphone-${id}` || sku.endsWith(`-${id}`)
  })
  if (bySku) return bySku

  const model = iphoneModels.find((m) => m.id === id)
  const rawName = model?.name ?? id.replace(/-/g, ' ')
  const words = rawName
    .toLowerCase()
    .replace(/^iphone\s+/, '')
    .split(/\s+/)
    .filter(Boolean)

  return (
    products.find((p) => {
      const n = String(p.name).toLowerCase()
      return words.length > 0 && words.every((w) => n.includes(w))
    }) ?? null
  )
}

const productIds = new Set(
  iphoneModels.filter((m) => !m.isAction).map((m) => m.id),
)

export function isValidIphoneModelId(id) {
  return typeof id === 'string' && productIds.has(id)
}
