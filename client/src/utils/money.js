export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function priceOf(p) {
  return Number(p.price)
}
