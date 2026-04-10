/** Canonical lifecycle (matches server `orderStatuses.js`). */
export const ORDER_FLOW_STEPS = [
  { key: 'placed', label: 'Order placed', description: 'We received your order.' },
  { key: 'paid', label: 'Paid', description: 'Payment confirmed.' },
  { key: 'processing', label: 'Processing', description: 'Preparing your shipment.' },
  { key: 'shipped', label: 'Shipped', description: 'On the way to you.' },
  { key: 'delivered', label: 'Delivered', description: 'Enjoy your iPhone.' },
]

export function formatOrderRef(id) {
  const n = Number(id)
  if (!Number.isFinite(n) || n < 1) return '—'
  return `ITB-${String(Math.floor(n)).padStart(6, '0')}`
}

export function statusIndex(status) {
  if (status === 'completed') return 4
  const i = ORDER_FLOW_STEPS.findIndex((s) => s.key === status)
  return i >= 0 ? i : 0
}

/** Placed / paid — shown under New purchases until status advances. */
export function isAdminNewPurchaseStatus(status) {
  return status === 'placed' || status === 'paid'
}
