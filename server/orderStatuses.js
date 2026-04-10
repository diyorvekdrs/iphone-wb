/** Canonical order lifecycle (stored in `orders.status`). */
export const ORDER_STATUSES = [
  'placed',
  'paid',
  'processing',
  'shipped',
  'delivered',
]

export function isValidOrderStatus(s) {
  return typeof s === 'string' && ORDER_STATUSES.includes(s)
}
