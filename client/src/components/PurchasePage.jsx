import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import {
  apiCreateOrder,
  apiProducts,
  apiSimulatePayment,
  apiStripeConfig,
  apiStripeCreateCheckout,
  apiStripeVerifySession,
} from '../api/client.js'
import { useAuth } from '../hooks/useAuth.js'
import { useHashRoute } from '../hooks/useHashRoute.js'
import { useCart } from '../hooks/useCart.js'
import { findProductByIphoneModelId } from '../utils/iphoneRoutes.js'
import { formatOrderRef } from '../utils/orderFlow.js'
import { money, priceOf } from '../utils/money.js'
import { sanitizeProductImageUrl } from '../utils/sanitizeImageUrl.js'
import OrderTimeline from './OrderTimeline.jsx'

function parseColorOptions(color) {
  const raw = String(color ?? '').trim()
  if (!raw) return []
  // Allow admin to enter: "Deep Blue, Natural Titanium, #0a2a6a"
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8)
}

function defaultColorsForModelId(modelId) {
  const id = String(modelId ?? '').toLowerCase().trim()
  if (!id) return []
  // Retail-style color names when the catalog omits a color list.
  if (id.includes('pro')) {
    return ['Natural Titanium', 'Black Titanium', 'White Titanium', 'Deep Blue']
  }
  if (id === 'air') {
    return ['Starlight', 'Midnight', 'Sky Blue', 'Pink']
  }
  // Base models
  return ['Midnight', 'Starlight', 'Blue', 'Pink']
}

function prettifyColorToCss(c) {
  const s = String(c ?? '').trim()
  if (!s) return '#d1d1d6'
  const lower = s.toLowerCase()
  const named = {
    midnight: '#111827',
    starlight: '#f5f5f4',
    pink: '#f472b6',
    blue: '#1d4ed8',
    'deep blue': '#0b1f48',
    'black titanium': '#111827',
    'white titanium': '#e5e7eb',
    'natural titanium': '#b9b1a7',
    'blue titanium': '#274c77',
    'sky blue': '#60a5fa',
  }
  if (named[lower]) return named[lower]
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s
  return '#d1d1d6'
}

function storageOptionsFor(baseGb) {
  const b = Number(baseGb)
  if (!Number.isFinite(b) || b <= 0) return [128, 256, 512, 1024]
  // Apple-ish: offer current + up to 2 upgrades.
  if (b >= 1024) return [1024]
  if (b >= 512) return [512, 1024]
  if (b >= 256) return [256, 512, 1024]
  return [128, 256, 512]
}

function storageDeltaUsd(selectedGb, baseGb) {
  const s = Number(selectedGb)
  const b = Number(baseGb)
  if (!Number.isFinite(s) || !Number.isFinite(b)) return 0
  if (s <= b) return 0
  // Storage upgrade deltas vs. catalog base `storage_gb` (matches buy flow).
  const ratio = s / b
  if (ratio >= 8) return 400
  if (ratio >= 4) return 200
  if (ratio >= 2) return 100
  return 0
}

/** Session map orderId → line items to remove from basket after payment (Stripe redirect-safe). */
const PENDING_CART_KEY = 'itball2-pending-cart-reductions'

function readPendingCartMap() {
  try {
    const raw = sessionStorage.getItem(PENDING_CART_KEY)
    const o = raw ? JSON.parse(raw) : {}
    return o && typeof o === 'object' && !Array.isArray(o) ? o : {}
  } catch {
    return {}
  }
}

function storePendingCartReduction(orderId, items) {
  const id = Number(orderId)
  if (!Number.isInteger(id) || id < 1 || !Array.isArray(items)) return
  const m = readPendingCartMap()
  m[String(id)] = items.map((row) => ({
    productId: Number(row.productId),
    quantity: Number(row.quantity),
  }))
  sessionStorage.setItem(PENDING_CART_KEY, JSON.stringify(m))
}

function takePendingCartReduction(orderId) {
  const m = readPendingCartMap()
  const key = String(orderId)
  const rows = m[key]
  if (!rows) return null
  delete m[key]
  sessionStorage.setItem(PENDING_CART_KEY, JSON.stringify(m))
  return rows
}

/** Remove only the ordered lines; full clear if placement snapshot missing (e.g. paid in another session). */
function applyPaidOrderToCart(orderId, addDelta, clearCart) {
  const rows = takePendingCartReduction(orderId)
  if (rows?.length) {
    for (const row of rows) {
      const pid = Number(row.productId)
      const q = Number(row.quantity)
      if (!Number.isFinite(pid) || pid < 1 || !Number.isFinite(q) || q < 1) continue
      addDelta(pid, -q, 10_000_000)
    }
    return
  }
  clearCart()
}

export default function PurchasePage() {
  const { orderModelId } = useHashRoute()
  const { user, loading: authLoading } = useAuth()
  const { quantities, clearCart, addDelta } = useCart()
  const orderIntentHandledRef = useRef(false)
  const [orderIntentError, setOrderIntentError] = useState(null)
  const [products, setProducts] = useState([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)
  const [shippingAddress, setShippingAddress] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [stripeConfigured, setStripeConfigured] = useState(false)
  const [stripeVerifyLoading, setStripeVerifyLoading] = useState(false)
  const [stripeRedirectLoading, setStripeRedirectLoading] = useState(false)

  const load = useCallback(async () => {
    setLoadError('')
    setLoading(true)
    try {
      const { products: list } = await apiProducts()
      setProducts(Array.isArray(list) ? list : [])
    } catch (e) {
<<<<<<< HEAD
      setLoadError(e.message || 'Unable to connect to server.')
=======
      setLoadError(e.message || 'Could not load products.')
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    void apiStripeConfig()
      .then((d) => setStripeConfigured(Boolean(d.stripeConfigured)))
      .catch(() => setStripeConfigured(false))
  }, [])

  useEffect(() => {
    const hash = window.location.hash || ''
    const q = hash.indexOf('?')
    if (q === -1) return
    const params = new URLSearchParams(hash.slice(q + 1))
    const stripeParam = params.get('stripe')
    const sessionId = params.get('session_id')
    if (stripeParam === 'cancel') {
      setCheckoutError('Stripe checkout was cancelled.')
      window.history.replaceState(null, '', '#/purchase')
      return
    }
    if (stripeParam !== 'success' || !sessionId) return

    setStripeVerifyLoading(true)
    setCheckoutError('')
    void apiStripeVerifySession(sessionId)
      .then((data) => {
        if (data.ok && data.order) {
          const oid = data.order.id
          setOrderSuccess({
            id: oid,
            total_amount: Number(data.order.total_amount),
            status: data.order.status ?? 'paid',
          })
          applyPaidOrderToCart(oid, addDelta, clearCart)
        } else {
          setCheckoutError('Payment was not completed. Try again from your orders.')
        }
        window.history.replaceState(null, '', '#/purchase')
      })
      .catch((e) => {
        setCheckoutError(e.message || 'Could not confirm Stripe payment.')
        window.history.replaceState(null, '', '#/purchase')
      })
      .finally(() => setStripeVerifyLoading(false))
  }, [])

  useEffect(() => {
    orderIntentHandledRef.current = false
    setOrderIntentError(null)
  }, [orderModelId])

  useEffect(() => {
    if (!orderModelId || loading || !products.length) return
    if (orderIntentHandledRef.current) return

    const guardKey = `itball2-order-intent-done:${orderModelId}`
    if (sessionStorage.getItem(guardKey) === '1') {
      orderIntentHandledRef.current = true
      return
    }

    const p = findProductByIphoneModelId(products, orderModelId)
    if (!p) {
      setOrderIntentError('no-product')
      orderIntentHandledRef.current = true
      return
    }
    const stock = Number(p.stock) || 0
    if (stock <= 0) {
      setOrderIntentError('out-of-stock')
      orderIntentHandledRef.current = true
      return
    }

    orderIntentHandledRef.current = true
    sessionStorage.setItem(guardKey, '1')
    addDelta(p.id, 1, stock)
  }, [orderModelId, loading, products, addDelta])

  const productById = useMemo(() => {
    const m = new Map()
    for (const p of products) m.set(String(p.id), p)
    return m
  }, [products])

  const cartLines = useMemo(() => {
    const lines = []
    for (const [id, qty] of Object.entries(quantities)) {
      const p = productById.get(id)
      if (!p) continue
      lines.push({ product: p, quantity: qty })
    }
    return lines
  }, [quantities, productById])

  const cartTotal = useMemo(() => {
    let t = 0
    for (const { product: p, quantity: q } of cartLines) {
      t += priceOf(p) * q
    }
    return t
  }, [cartLines])

  const singleLine = cartLines.length === 1 ? cartLines[0] : null
  const baseProduct = singleLine?.product ?? null
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedStorageGb, setSelectedStorageGb] = useState('')

  const effectiveModelId =
    orderModelId ?? baseProduct?.sku ?? ''

  const colorOptions = useMemo(() => {
    if (!baseProduct) return []
    const fromAdmin = parseColorOptions(baseProduct.color)
    if (fromAdmin.length) return fromAdmin
    const fromModel = defaultColorsForModelId(effectiveModelId)
    if (fromModel.length) return fromModel
    return ['Midnight', 'Starlight', 'Blue', 'Pink']
  }, [baseProduct, effectiveModelId])
  const storageOptions = useMemo(
    () => (baseProduct ? storageOptionsFor(baseProduct.storage_gb) : []),
    [baseProduct],
  )

  useEffect(() => {
    if (!baseProduct) return
    setSelectedColor(colorOptions[0] ?? baseProduct.color ?? '')
    setSelectedStorageGb(
      baseProduct.storage_gb != null ? String(baseProduct.storage_gb) : String(storageOptions[0] ?? ''),
    )
  }, [baseProduct, colorOptions, storageOptions])

  const singlePrice = useMemo(() => {
    if (!baseProduct) return null
    const base = Number(baseProduct.price)
    const delta = storageDeltaUsd(Number(selectedStorageGb), Number(baseProduct.storage_gb))
    return base + delta
  }, [baseProduct, selectedStorageGb])

  const placeOrder = async () => {
    setCheckoutError('')
    setOrderSuccess(null)
    if (cartLines.length === 0) {
      setCheckoutError('Your basket is empty.')
      return
    }
    if (!user || user.role !== 'user') {
      setCheckoutError('Sign in with your customer account to complete purchase.')
      return
    }
    setCheckoutLoading(true)
    try {
      const optionNote =
        baseProduct && cartLines.length === 1
          ? [
              selectedColor ? `Color: ${selectedColor}` : null,
              selectedStorageGb ? `Storage: ${selectedStorageGb}GB` : null,
            ]
              .filter(Boolean)
              .join(' · ')
          : ''
      const mergedNotes = [orderNotes.trim(), optionNote].filter(Boolean).join(' — ')
      const items = cartLines.map(({ product: p, quantity: q }) => ({
        productId: p.id,
        quantity: q,
      }))
      const data = await apiCreateOrder({
        items,
        shipping_address: shippingAddress.trim() || undefined,
        notes: mergedNotes || undefined,
      })
      const newId = data.order?.id
      if (newId != null) storePendingCartReduction(newId, items)
      setOrderSuccess(
        data.order
          ? {
              ...data.order,
              total_amount: Number(data.order.total_amount),
              status: data.order.status ?? 'placed',
            }
          : null,
      )
      if (orderModelId) {
        sessionStorage.removeItem(`itball2-order-intent-done:${orderModelId}`)
      }
      setShippingAddress('')
      setOrderNotes('')
      void load()
    } catch (e) {
      setCheckoutError(e.message || 'Could not place order.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const simulatePayment = async () => {
    if (!orderSuccess?.id) return
    setCheckoutError('')
    setPaymentLoading(true)
    try {
      const data = await apiSimulatePayment(orderSuccess.id)
      setOrderSuccess((prev) =>
        prev
          ? { ...prev, status: data.order?.status ?? 'paid' }
          : prev,
      )
      applyPaidOrderToCart(orderSuccess.id, addDelta, clearCart)
    } catch (e) {
      setCheckoutError(e.message || 'Payment could not be completed.')
    } finally {
      setPaymentLoading(false)
    }
  }

  const startStripeCheckout = async () => {
    if (!orderSuccess?.id) return
    setCheckoutError('')
    setStripeRedirectLoading(true)
    try {
      const data = await apiStripeCreateCheckout(orderSuccess.id, { returnPath: 'purchase' })
      if (data.url) window.location.href = data.url
      else setStripeRedirectLoading(false)
    } catch (e) {
      setCheckoutError(e.message || 'Could not start Stripe.')
      setStripeRedirectLoading(false)
    }
  }

  const isCustomer = user?.role === 'user'
  const isAdmin = user?.role === 'super_admin'

  return (
    <main className="mx-auto max-w-[980px] px-4 pb-24 pt-14 md:px-6 md:pt-16">
      {stripeVerifyLoading ? (
        <p className="mb-6 rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-center text-[15px] text-[#1d1d1f] shadow-sm">
          Confirming Stripe payment…
        </p>
      ) : null}
      <div className="text-center">
        <Motion.h1
          className="text-[32px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[40px]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Order processing
        </Motion.h1>
        <Motion.p
          className="mx-auto mt-2 max-w-lg text-[15px] leading-snug text-[#6e6e73]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          Review your order, add shipping details, and complete checkout.
        </Motion.p>
      </div>

      {!authLoading && isAdmin ? (
        <p className="mx-auto mt-8 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-center text-[14px] text-amber-950">
          Administrator accounts cannot place orders.
        </p>
      ) : null}

      {loading ? (
        <p className="mt-16 text-center text-[15px] text-[#6e6e73]">Loading…</p>
      ) : loadError ? (
        <p className="mt-16 text-center text-[15px] text-[#bf4800]" role="alert">
          {loadError}
        </p>
      ) : cartLines.length === 0 && !orderSuccess ? (
        <div className="mt-16 rounded-[20px] border border-black/[0.06] bg-white px-6 py-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          {orderIntentError === 'out-of-stock' ? (
            <>
              <p className="text-[17px] font-medium text-[#1d1d1f]">Out of stock</p>
              <p className="mt-2 text-[15px] text-[#6e6e73]">
                This model has no inventory in the catalog right now. Try another iPhone or check back
                later.
              </p>
              <a
                href="#/"
                className="mt-6 inline-block text-[15px] font-medium text-[#0066cc] hover:underline"
              >
                Return home
              </a>
            </>
          ) : orderIntentError === 'no-product' ? (
            <>
              <p className="text-[17px] font-medium text-[#1d1d1f]">No matching product in the catalog</p>
              <p className="mt-2 text-[15px] leading-snug text-[#6e6e73]">
                The shop catalog must include an item linked to this iPhone. In the admin dashboard,
                add a product whose{' '}
                <span className="font-medium text-[#1d1d1f]">SKU</span> matches the model id (for
                example <code className="rounded bg-black/[0.06] px-1.5 py-0.5 text-[13px]">17-pro</code>
                ), or use a <span className="font-medium text-[#1d1d1f]">product name</span> that
                includes the same words as the iPhone name.
              </p>
              <a
                href="#/"
                className="mt-6 inline-block text-[15px] font-medium text-[#0066cc] hover:underline"
              >
                Return home
              </a>
            </>
          ) : (
            <>
              <p className="text-[17px] font-medium text-[#1d1d1f]">Your basket is empty</p>
              <p className="mt-2 text-[15px] leading-snug text-[#6e6e73]">
                Open order processing from a model page using{' '}
                <span className="font-medium text-[#1d1d1f]">Buy</span> (it adds the matching
                catalog item), add items from your basket, or browse home to choose an iPhone.
              </p>
              <p className="mt-4 text-[15px] text-[#6e6e73]">
                <a href="#/basket" className="font-medium text-[#0066cc] hover:underline">
                  Open basket
                </a>
                {' · '}
                <a href="#/" className="font-medium text-[#0066cc] hover:underline">
                  Home
                </a>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {orderSuccess ? (
            <div className="space-y-6">
              <div
<<<<<<< HEAD
                className={`rounded-[20px] border px-6 py-6 text-center ${
                  orderSuccess.status === 'placed'
                    ? 'border-amber-200/80 bg-amber-50'
                    : 'border-emerald-200/80 bg-emerald-50'
                }`}
                role="status"
              >
                <p className={`text-[17px] font-semibold ${
                  orderSuccess.status === 'placed' ? 'text-amber-900' : 'text-[#14532d]'
                }`}>
                  {orderSuccess.status === 'placed' ? 'Order received' : 'Thank you'}
                </p>
                <p className={`mt-2 text-[15px] ${
                  orderSuccess.status === 'placed' ? 'text-amber-800' : 'text-[#166534]'
                }`}>
                  {formatOrderRef(orderSuccess.id)} ·{' '}
                  {money.format(Number(orderSuccess.total_amount))}
                  {orderSuccess.status === 'placed' ? ' — payment pending' : ''}
=======
                className="rounded-[20px] border border-emerald-200/80 bg-emerald-50 px-6 py-6 text-center"
                role="status"
              >
                <p className="text-[17px] font-semibold text-[#14532d]">Thank you</p>
                <p className="mt-2 text-[15px] text-[#166534]">
                  {formatOrderRef(orderSuccess.id)} ·{' '}
                  {money.format(Number(orderSuccess.total_amount))}
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
                </p>
              </div>

              <div className="rounded-[20px] border border-black/[0.06] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <h2 className="text-[19px] font-semibold text-[#1d1d1f]">Status</h2>
                <div className="mt-4">
                  <OrderTimeline status={orderSuccess.status} compact />
                </div>
              </div>

              {orderSuccess.status === 'placed' ? (
                <div className="rounded-[20px] border border-black/[0.06] bg-white p-6 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                  <p className="text-[15px] font-medium text-[#1d1d1f]">Complete payment</p>
                  <p className="mt-2 text-[13px] leading-snug text-[#6e6e73]">
                    Stripe test: <span className="font-mono">4242 4242 4242 4242</span>, any future
                    expiry, any CVC. Server needs <span className="font-mono">sk_test_…</span> in{' '}
                    <code className="rounded bg-black/[0.06] px-1">.env</code>.
                  </p>
                  {stripeConfigured ? (
                    <button
                      type="button"
                      disabled={stripeRedirectLoading || paymentLoading}
                      onClick={() => void startStripeCheckout()}
<<<<<<< HEAD
                      className="mt-4 w-full cursor-pointer rounded-full bg-[#0071e3] py-3.5 text-[16px] font-medium text-white transition-all duration-200 hover:bg-[#0077ed] disabled:cursor-not-allowed disabled:bg-neutral-300"
=======
                      className="mt-4 w-full rounded-full bg-[#0071e3] py-3.5 text-[16px] font-medium text-white transition hover:bg-[#0077ed] disabled:bg-neutral-300"
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
                    >
                      {stripeRedirectLoading ? 'Redirecting…' : 'Pay with card (Stripe test)'}
                    </button>
                  ) : (
                    <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-950">
<<<<<<< HEAD
                      Stripe not configured — use "Mark as paid (demo)" or add{' '}
=======
                      Stripe not configured — use “Mark as paid (demo)” or add{' '}
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
                      <code className="rounded bg-black/[0.08] px-1">STRIPE_SECRET_KEY</code>.
                    </p>
                  )}
                  <button
                    type="button"
                    disabled={paymentLoading || stripeRedirectLoading}
                    onClick={() => void simulatePayment()}
<<<<<<< HEAD
                    className="mt-3 w-full cursor-pointer rounded-full border border-black/[0.12] bg-white py-3.5 text-[15px] font-medium text-[#1d1d1f] transition-all duration-200 hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
=======
                    className="mt-3 w-full rounded-full border border-black/[0.12] bg-white py-3.5 text-[15px] font-medium text-[#1d1d1f] transition hover:bg-black/[0.04] disabled:opacity-50"
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
                  >
                    {paymentLoading ? 'Processing…' : 'Mark as paid (demo — no card)'}
                  </button>
                </div>
              ) : (
<<<<<<< HEAD
                <div className="rounded-[20px] border border-emerald-100 bg-emerald-50/50 px-6 py-4 text-center">
                  <p className="text-[15px] font-medium text-emerald-800">
                    ✓ Payment received. You'll get updates as your order moves along.
                  </p>
                </div>
=======
                <p className="text-center text-[15px] text-[#6e6e73]">
                  Payment received. You’ll get updates as your order moves along.
                </p>
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
              )}

              {checkoutError ? (
                <p className="rounded-lg bg-[#fff3f0] px-3 py-2 text-center text-[13px] text-[#bf4800]" role="alert">
                  {checkoutError}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href="#/orders"
                  className="inline-flex justify-center rounded-full border border-black/[0.12] px-8 py-3 text-[15px] font-medium text-[#1d1d1f] transition hover:bg-black/[0.04]"
                >
                  View your orders
                </a>
                <a
                  href="#/"
                  className="inline-flex justify-center rounded-full bg-[#1d1d1f] px-8 py-3 text-[15px] font-medium text-white transition hover:bg-neutral-800"
                >
                  Back to home
                </a>
              </div>
            </div>
          ) : (
            <>
              {singleLine && baseProduct ? (
                <section
                  className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start"
                  aria-label="Configuration"
                >
                  <div className="rounded-[28px] border border-black/[0.06] bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f]">
                        {baseProduct.name}
                      </h2>
                      <p className="text-[17px] font-semibold tabular-nums text-[#1d1d1f]">
                        {money.format(Number(singlePrice ?? priceOf(baseProduct)))}
                      </p>
                    </div>
                    <div className="mt-6 rounded-[24px] bg-[#f5f5f7] p-8">
                      <div className="mx-auto max-w-[520px]">
                        {sanitizeProductImageUrl(baseProduct.image_url) ? (
                          <img
                            src={sanitizeProductImageUrl(baseProduct.image_url)}
                            alt=""
                            className="mx-auto h-auto max-h-[420px] w-full object-contain"
                            loading="eager"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex h-[360px] items-center justify-center text-[13px] text-[#6e6e73]">
                            No image
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                      <p className="text-[19px] font-semibold text-[#1d1d1f]">
                        Finish. <span className="font-normal text-[#6e6e73]">Pick your favorite.</span>
                      </p>
                      <p className="mt-4 text-[13px] font-medium text-[#1d1d1f]">
                        Color {selectedColor ? `— ${selectedColor}` : ''}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {(colorOptions.length ? colorOptions : [baseProduct.color].filter(Boolean)).map(
                          (c) => {
                            const active = selectedColor === c
                            const sw = prettifyColorToCss(c)
                            return (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setSelectedColor(c)}
                                className={[
                                  'relative h-9 w-9 rounded-full transition',
                                  active
                                    ? 'ring-2 ring-[#0071e3] ring-offset-2 ring-offset-white'
                                    : 'ring-1 ring-black/[0.08] hover:ring-black/[0.18]',
                                ].join(' ')}
                                aria-label={c}
                              >
                                <span
                                  className="absolute inset-[3px] rounded-full"
                                  style={{ background: sw }}
                                  aria-hidden
                                />
                              </button>
                            )
                          },
                        )}
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                      <p className="text-[19px] font-semibold text-[#1d1d1f]">
                        Storage. <span className="font-normal text-[#6e6e73]">How much space do you need?</span>
                      </p>
                      <div className="mt-4 space-y-3">
                        {storageOptions.map((gb) => {
                          const active = String(gb) === String(selectedStorageGb)
                          const delta = storageDeltaUsd(gb, Number(baseProduct.storage_gb))
                          const from = Number(baseProduct.price) + delta
                          return (
                            <button
                              key={gb}
                              type="button"
                              onClick={() => setSelectedStorageGb(String(gb))}
                              className={[
                                'flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition',
                                active
                                  ? 'border-[#0071e3] shadow-[0_0_0_4px_rgba(0,113,227,0.14)]'
                                  : 'border-black/[0.12] hover:border-black/[0.22]',
                              ].join(' ')}
                            >
                              <div>
                                <p className="text-[15px] font-semibold text-[#1d1d1f]">
                                  {gb >= 1024 ? '1TB' : `${gb}GB`}
                                </p>
                                <p className="mt-1 text-[12px] text-[#6e6e73]">
                                  From {money.format(from)}
                                </p>
                              </div>
                              <span className="text-[12px] font-medium text-[#6e6e73]">
                                {active ? 'Selected' : ''}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}

              <section
                className="rounded-[20px] border border-black/[0.06] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                aria-label="Order summary"
              >
                <h2 className="text-[19px] font-semibold text-[#1d1d1f]">Order summary</h2>
                <ul className="mt-4 space-y-3 border-t border-black/[0.06] pt-4">
                  {cartLines.map(({ product: p, quantity: q }) => (
                    <li key={p.id} className="flex justify-between gap-3 text-[14px]">
                      <span className="min-w-0 text-[#1d1d1f]">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-[#6e6e73]"> × {q}</span>
                      </span>
                      <span className="shrink-0 font-medium text-[#1d1d1f]">
                        {money.format(priceOf(p) * q)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-black/[0.08] pt-4 text-[17px] font-semibold text-[#1d1d1f]">
                  <span>Total</span>
                  <span>
                    {money.format(
                      singleLine && baseProduct && singlePrice != null
                        ? Number(singlePrice) * Number(singleLine.quantity)
                        : cartTotal,
                    )}
                  </span>
                </div>
              </section>

              <section className="rounded-[20px] border border-black/[0.06] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <h2 className="text-[19px] font-semibold text-[#1d1d1f]">Details</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="purchase-ship" className="text-[13px] font-medium text-[#1d1d1f]">
                      Shipping address{' '}
                      <span className="font-normal text-[#6e6e73]">(optional)</span>
                    </label>
                    <textarea
                      id="purchase-ship"
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="mt-1.5 w-full resize-none rounded-xl border border-black/[0.12] bg-[#f5f5f7] px-3 py-2.5 text-[15px] text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/25"
                      placeholder="Street, city, ZIP"
                    />
                  </div>
                  <div>
                    <label htmlFor="purchase-notes" className="text-[13px] font-medium text-[#1d1d1f]">
                      Notes <span className="font-normal text-[#6e6e73]">(optional)</span>
                    </label>
                    <input
                      id="purchase-notes"
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-black/[0.12] bg-[#f5f5f7] px-3 py-2.5 text-[15px] text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/25"
                      placeholder="Delivery instructions"
                    />
                  </div>
                </div>

                {checkoutError ? (
                  <p className="mt-4 rounded-lg bg-[#fff3f0] px-3 py-2 text-[13px] text-[#bf4800]" role="alert">
                    {checkoutError}
                  </p>
                ) : null}

                {!authLoading && !user ? (
                  <p className="mt-6 text-center text-[14px] text-[#6e6e73]">
                    <a href="#/login" className="font-medium text-[#0066cc] hover:underline">
                      Sign in
                    </a>{' '}
                    or{' '}
                    <a href="#/register" className="font-medium text-[#0066cc] hover:underline">
                      register
                    </a>{' '}
                    to complete purchase.
                  </p>
                ) : null}

                <button
                  type="button"
                  disabled={
                    checkoutLoading || cartLines.length === 0 || !isCustomer || authLoading
                  }
                  onClick={() => void placeOrder()}
                  className="mt-6 w-full rounded-full bg-[#1d1d1f] py-3.5 text-[16px] font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  {checkoutLoading ? 'Placing order…' : 'Place order'}
                </button>
                <a
                  href="#/basket"
                  className="mt-3 block w-full rounded-full border border-black/[0.12] py-3 text-center text-[15px] font-medium text-[#1d1d1f] transition hover:bg-black/[0.04]"
                >
                  Back to basket
                </a>
              </section>
            </>
          )}
        </div>
      )}
    </main>
  )
}
