import Stripe from 'stripe'

/** Normalize `.env` values (quotes, whitespace). */
function readStripeSecret() {
  const raw = process.env.STRIPE_SECRET_KEY
  if (raw == null || raw === '') return ''
  return String(raw)
    .trim()
    .replace(/^['"]|['"]$/g, '')
}

/**
 * Stripe test-mode Checkout Sessions. Set `STRIPE_SECRET_KEY` (sk_test_…) in repo-root `.env`.
 * @type {Stripe | null}
 */
function createStripe() {
  const key = readStripeSecret()
  if (!key) return null
  try {
    return new Stripe(key)
  } catch (e) {
    console.warn('[stripe] Could not initialize Stripe:', e.message)
    return null
  }
}

export const stripe = createStripe()

/** Browser origin for Checkout redirects (Vite default: http://localhost:5173). */
export function clientAppOrigin() {
  const u = (process.env.CLIENT_URL ?? 'http://localhost:5173').trim().replace(/\/$/, '')
  return u
}
