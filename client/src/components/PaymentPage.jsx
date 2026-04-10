import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useCart } from '../hooks/useCart.js'
import { money, priceOf } from '../utils/money.js'
import { formatOrderRef } from '../utils/orderFlow.js'
import { sanitizeProductImageUrl } from '../utils/sanitizeImageUrl.js'
import OrderTimeline from './OrderTimeline.jsx'

const ease = [0.22, 1, 0.36, 1]

export default function PaymentPage() {
  const { user, loading: authLoading } = useAuth()
  const { paymentQueue, removePaymentLine, removePaymentLines } = useCart()

  const [products, setProducts] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')

  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [shippingAddress, setShippingAddress] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [stripeConfigured, setStripeConfigured] = useState(false)
  const [stripeVerifyLoading, setStripeVerifyLoading] = useState(false)
  const [stripeRedirectLoading, setStripeRedirectLoading] = useState(false)

  const loadProducts = useCallback(async () => {
    setCatalogError('')
    setCatalogLoading(true)
    try {
      const { products: list } = await apiProducts()
      setProducts(Array.isArray(list) ? list : [])
    } catch (e) {
      setCatalogError(e.message || 'Could not load products.')
      setProducts([])
    } finally {
      setCatalogLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

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
      window.history.replaceState(null, '', '#/payment')
      return
    }
    if (stripeParam !== 'success' || !sessionId) return

    setStripeVerifyLoading(true)
    setCheckoutError('')
    void apiStripeVerifySession(sessionId)
      .then((data) => {
        if (data.ok && data.order) {
          setOrderSuccess({
            id: data.order.id,
            total_amount: Number(data.order.total_amount),
            status: data.order.status ?? 'paid',
          })
        } else {
          setCheckoutError('Payment was not completed. You can try again from your order.')
        }
        window.history.replaceState(null, '', '#/payment')
      })
      .catch((e) => {
        setCheckoutError(e.message || 'Could not confirm Stripe payment.')
        window.history.replaceState(null, '', '#/payment')
      })
      .finally(() => setStripeVerifyLoading(false))
  }, [])

  useEffect(() => {
    setSelectedIds(new Set(paymentQueue.map((l) => l.id)))
  }, [paymentQueue])

  const productById = useMemo(() => {
    const m = new Map()
    for (const p of products) m.set(Number(p.id), p)
    return m
  }, [products])

  const selectedLines = useMemo(
    () => paymentQueue.filter((l) => selectedIds.has(l.id)),
    [paymentQueue, selectedIds],
  )

  const selectedTotal = useMemo(() => {
    let t = 0
    for (const line of selectedLines) {
      const p = productById.get(Number(line.productId))
      const unit = p ? priceOf(p) : Number(line.unitPrice) || 0
      t += unit * Number(line.quantity)
    }
    return t
  }, [selectedLines, productById])

  const toggleLine = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedIds(new Set(paymentQueue.map((l) => l.id)))
  }

  const selectNone = () => {
    setSelectedIds(new Set())
  }

  const isCustomer = user?.role === 'user'
  const isAdmin = user?.role === 'super_admin'

  const placeOrder = async (lines) => {
    setCheckoutError('')
    if (!lines.length) {
      setCheckoutError('Select at least one item to pay for.')
      return
    }
    if (!user || user.role !== 'user') {
      setCheckoutError('Sign in with your customer account to complete payment.')
      return
    }
    setCheckoutLoading(true)
    try {
      const items = lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
        notes: l.notes?.trim() ? l.notes.trim() : undefined,
      }))
      const data = await apiCreateOrder({
        items,
        shipping_address: shippingAddress.trim() || undefined,
        notes: undefined,
      })
      removePaymentLines(lines.map((l) => l.id))
      setOrderSuccess(
        data.order
          ? {
              ...data.order,
              total_amount: Number(data.order.total_amount),
              status: data.order.status ?? 'placed',
            }
          : null,
      )
      setShippingAddress('')
      void loadProducts()
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
        prev ? { ...prev, status: data.order?.status ?? 'paid' } : prev,
      )
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
      const data = await apiStripeCreateCheckout(orderSuccess.id, { returnPath: 'payment' })
      if (data.url) window.location.href = data.url
      else setStripeRedirectLoading(false)
    } catch (e) {
      setCheckoutError(e.message || 'Could not start Stripe.')
      setStripeRedirectLoading(false)
    }
  }

  if (orderSuccess) {
    return (
      <main className="mx-auto max-w-[720px] px-4 pb-24 pt-8 md:px-6 md:pt-10">
        <div className="space-y-6">
          <div
            className="rounded-[20px] border border-emerald-200/80 bg-emerald-50 px-6 py-6 text-center"
            role="status"
          >
            <p className="text-[17px] font-semibold text-[#14532d]">Thank you</p>
            <p className="mt-2 text-[15px] text-[#166534]">
              {formatOrderRef(orderSuccess.id)} · {money.format(Number(orderSuccess.total_amount))}
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
                Use Stripe test mode with card{' '}
                <span className="font-mono text-[#1d1d1f]">4242 4242 4242 4242</span>, any future
                expiry, any CVC.
              </p>
              {stripeConfigured ? (
                <button
                  type="button"
                  disabled={stripeRedirectLoading || paymentLoading}
                  onClick={() => void startStripeCheckout()}
                  className="mt-4 w-full rounded-full bg-[#0071e3] py-3.5 text-[16px] font-medium text-white transition hover:bg-[#0077ed] disabled:bg-neutral-300"
                >
                  {stripeRedirectLoading ? 'Redirecting to Stripe…' : 'Pay with card (Stripe test)'}
                </button>
              ) : (
                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-950">
                  Card checkout isn&apos;t available right now. Use “Mark as paid (demo)” below to continue.
                </p>
              )}
              <button
                type="button"
                disabled={paymentLoading || stripeRedirectLoading}
                onClick={() => void simulatePayment()}
                className="mt-3 w-full rounded-full border border-black/[0.12] bg-white py-3.5 text-[15px] font-medium text-[#1d1d1f] transition hover:bg-black/[0.04] disabled:opacity-50"
              >
                {paymentLoading ? 'Processing…' : 'Mark as paid (demo — no card)'}
              </button>
            </div>
          ) : (
            <p className="text-center text-[15px] text-[#6e6e73]">
              Payment received. You’ll get updates as your order moves along.
            </p>
          )}

          {checkoutError ? (
            <p
              className="rounded-lg bg-[#fff3f0] px-3 py-2 text-center text-[13px] text-[#bf4800]"
              role="alert"
            >
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
              href="#/payment"
              className="inline-flex justify-center rounded-full border border-black/[0.12] px-8 py-3 text-[15px] font-medium text-[#1d1d1f] transition hover:bg-black/[0.04]"
            >
              Back to payment queue
            </a>
            <a
              href="#/"
              className="inline-flex justify-center rounded-full bg-[#1d1d1f] px-8 py-3 text-[15px] font-medium text-white transition hover:bg-neutral-800"
            >
              Back to home
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[900px] px-4 pb-24 pt-8 md:px-6 md:pt-10">
      {stripeVerifyLoading ? (
        <p className="mb-6 rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-center text-[15px] text-[#1d1d1f] shadow-sm">
          Confirming Stripe payment…
        </p>
      ) : null}
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
      >
        <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[40px]">
          Payment
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#6e6e73]">
          Review items waiting for checkout. Pay everything at once, or select specific phones and
          leave the rest in your queue. You can leave this page anytime — your selection stays saved
          until you pay or remove it.
        </p>
      </Motion.div>

      {!authLoading && isAdmin ? (
        <p className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-center text-[14px] text-amber-950">
          Administrator accounts cannot check out. Use a customer account to pay.
        </p>
      ) : null}

      {catalogLoading ? (
        <p className="mt-12 text-center text-[15px] text-[#6e6e73]">Loading catalog…</p>
      ) : catalogError ? (
        <p className="mt-12 text-center text-[15px] text-[#bf4800]" role="alert">
          {catalogError}
        </p>
      ) : paymentQueue.length === 0 ? (
        <div className="mt-12 rounded-[20px] border border-black/[0.06] bg-white px-6 py-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <p className="text-[17px] font-medium text-[#1d1d1f]">Nothing waiting for payment</p>
          <p className="mt-2 text-[15px] text-[#6e6e73]">
            Use <span className="font-medium text-[#1d1d1f]">Buy now</span> on an iPhone to add it
            here.
          </p>
          <a
            href="#/"
            className="mt-6 inline-block text-[15px] font-medium text-[#0066cc] hover:underline"
          >
            Browse iPhone
          </a>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-full border border-black/[0.12] px-4 py-2 text-[13px] font-medium text-[#1d1d1f] hover:bg-black/[0.04]"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={selectNone}
              className="rounded-full border border-black/[0.12] px-4 py-2 text-[13px] font-medium text-[#1d1d1f] hover:bg-black/[0.04]"
            >
              Clear selection
            </button>
          </div>

          <ul className="space-y-4" aria-label="Items ready for payment">
            {paymentQueue.map((line) => {
              const p = productById.get(Number(line.productId))
              const unit = p ? priceOf(p) : Number(line.unitPrice) || 0
              const lineTotal = unit * Number(line.quantity)
              const stock = p ? Number(p.stock) || 0 : 0
              const selected = selectedIds.has(line.id)
              const oos = p && stock < Number(line.quantity)

              return (
                <li
                  key={line.id}
                  className={[
                    'flex flex-col gap-4 rounded-[20px] border bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:flex-row sm:items-start',
                    selected ? 'border-[#0071e3]/50 ring-1 ring-[#0071e3]/25' : 'border-black/[0.06]',
                  ].join(' ')}
                >
                  <label className="flex cursor-pointer items-start gap-3 sm:min-w-0 sm:flex-1">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleLine(line.id)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-black/20 text-[#0071e3]"
                    />
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#f5f5f7] sm:h-24 sm:w-24">
                      {sanitizeProductImageUrl(p?.image_url) ?? line.image ? (
                        <img
                          src={sanitizeProductImageUrl(p?.image_url) ?? line.image ?? undefined}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[11px] text-[#6e6e73]">
                          iPhone
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-semibold text-[#1d1d1f]">{line.modelName}</p>
                      <p className="mt-1 text-[13px] leading-snug text-[#6e6e73]">{line.notes}</p>
                      <p className="mt-2 text-[14px] text-[#1d1d1f]">
                        {money.format(unit)} each · Qty {line.quantity}
                      </p>
                      {oos ? (
                        <p className="mt-1 text-[12px] font-medium text-[#bf4800]">
                          Not enough stock — remove or lower quantity from the product page.
                        </p>
                      ) : null}
                    </div>
                  </label>
                  <div className="flex shrink-0 flex-col items-end gap-2 sm:pt-0">
                    <p className="text-[17px] font-semibold text-[#1d1d1f]">
                      {money.format(lineTotal)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removePaymentLine(line.id)}
                      className="text-[13px] font-medium text-[#0066cc] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="rounded-[20px] border border-black/[0.06] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <label htmlFor="pay-ship" className="text-[13px] font-medium text-[#1d1d1f]">
              Shipping address <span className="font-normal text-[#6e6e73]">(optional)</span>
            </label>
            <textarea
              id="pay-ship"
              rows={2}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="mt-2 w-full resize-none rounded-xl border border-black/[0.12] bg-[#f5f5f7] px-3 py-2.5 text-[15px] text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/25"
              placeholder="Street, city, ZIP"
            />

            <div className="mt-6 flex flex-col justify-between gap-4 border-t border-black/[0.08] pt-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-[13px] text-[#6e6e73]">Selected total</p>
                <p className="text-[24px] font-semibold text-[#1d1d1f]">
                  {money.format(selectedTotal)}
                </p>
                <p className="text-[12px] text-[#86868b]">
                  {selectedLines.length} line{selectedLines.length === 1 ? '' : 's'} selected
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                {!authLoading && !user ? (
                  <p className="text-center text-[14px] text-[#6e6e73] sm:text-right">
                    <a href="#/login" className="font-medium text-[#0066cc] hover:underline">
                      Sign in
                    </a>{' '}
                    to pay.
                  </p>
                ) : null}
                {checkoutError ? (
                  <p className="text-[13px] text-[#bf4800]" role="alert">
                    {checkoutError}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={
                      checkoutLoading ||
                      !isCustomer ||
                      selectedLines.length === 0 ||
                      selectedLines.some((l) => {
                        const p = productById.get(Number(l.productId))
                        const stock = p ? Number(p.stock) || 0 : 0
                        return !p || stock < Number(l.quantity)
                      })
                    }
                    onClick={() => void placeOrder(selectedLines)}
                    className="rounded-full bg-[#0071e3] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#0077ed] disabled:cursor-not-allowed disabled:bg-neutral-300"
                  >
                    {checkoutLoading ? 'Placing order…' : 'Pay selected'}
                  </button>
                  <button
                    type="button"
                    disabled={
                      checkoutLoading ||
                      !isCustomer ||
                      paymentQueue.length === 0 ||
                      paymentQueue.some((l) => {
                        const p = productById.get(Number(l.productId))
                        const stock = p ? Number(p.stock) || 0 : 0
                        return !p || stock < Number(l.quantity)
                      })
                    }
                    onClick={() => void placeOrder(paymentQueue)}
                    className="rounded-full border border-black/[0.12] bg-white px-6 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Pay all
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-[13px] text-[#86868b]">
            <a href="#/" className="text-[#0066cc] hover:underline">
              Continue shopping
            </a>
          </p>
        </div>
      )}
    </main>
  )
}
