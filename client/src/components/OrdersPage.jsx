import { useCallback, useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import {
  apiMyOrder,
  apiMyOrders,
  apiSimulatePayment,
  apiStripeConfig,
  apiStripeCreateCheckout,
  apiStripeVerifySession,
} from '../api/client.js'
import { useHashRoute } from '../hooks/useHashRoute.js'
import OrderTimeline from './OrderTimeline.jsx'
import { sanitizeProductImageUrl } from '../utils/sanitizeImageUrl.js'
import { formatOrderRef } from '../utils/orderFlow.js'
import { money } from '../utils/money.js'

const ease = [0.22, 1, 0.36, 1]

export default function OrdersPage() {
  const { ordersDetailId } = useHashRoute()
  const [list, setList] = useState([])
  const [listErr, setListErr] = useState('')
  const [loadingList, setLoadingList] = useState(true)

  const [detail, setDetail] = useState(null)
  const [items, setItems] = useState([])
  const [detailErr, setDetailErr] = useState('')
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const [stripeConfigured, setStripeConfigured] = useState(false)
  const [stripeRedirectLoading, setStripeRedirectLoading] = useState(false)
  const [stripeVerifyLoading, setStripeVerifyLoading] = useState(false)

  const loadList = useCallback(async () => {
    setListErr('')
    setLoadingList(true)
    try {
      const d = await apiMyOrders()
      setList(d.orders ?? [])
    } catch (e) {
      setListErr(e.message || 'Could not load orders.')
      setList([])
    } finally {
      setLoadingList(false)
    }
  }, [])

  useEffect(() => {
    void loadList()
  }, [loadList])

  useEffect(() => {
    void apiStripeConfig()
      .then((d) => setStripeConfigured(Boolean(d.stripeConfigured)))
      .catch(() => setStripeConfigured(false))
  }, [])

  useEffect(() => {
    const fullHash = window.location.hash || ''
    const q = fullHash.indexOf('?')
    if (q === -1) return
    const params = new URLSearchParams(fullHash.slice(q + 1))
    const stripeParam = params.get('stripe')
    const sessionId = params.get('session_id')
    if (stripeParam === 'cancel') {
      window.history.replaceState(null, '', '#/orders')
      return
    }
    if (stripeParam !== 'success' || !sessionId) return

    setStripeVerifyLoading(true)
    void apiStripeVerifySession(sessionId)
      .then((data) => {
        window.history.replaceState(null, '', '#/orders')
        void loadList()
        if (data.ok && data.order?.id) {
          window.location.hash = `#/orders/${data.order.id}`
        }
      })
      .catch(() => {
        window.history.replaceState(null, '', '#/orders')
      })
      .finally(() => setStripeVerifyLoading(false))
  }, [loadList, loadDetail])

  const loadDetail = useCallback(async (id) => {
    setDetailErr('')
    setLoadingDetail(true)
    setDetail(null)
    setItems([])
    try {
      const d = await apiMyOrder(id)
      setDetail(d.order ?? null)
      setItems(d.items ?? [])
    } catch (e) {
      setDetailErr(e.message || 'Could not load order.')
    } finally {
      setLoadingDetail(false)
    }
  }, [])

  useEffect(() => {
    if (ordersDetailId) {
      void loadDetail(ordersDetailId)
    } else {
      setDetail(null)
      setItems([])
      setDetailErr('')
    }
  }, [ordersDetailId, loadDetail])

  const selectedId = ordersDetailId ?? null

  const payFromDetail = async () => {
    if (!detail?.id) return
    setPayLoading(true)
    try {
      await apiSimulatePayment(detail.id)
      await loadDetail(detail.id)
      await loadList()
    } catch (e) {
      window.alert(e.message || 'Payment failed.')
    } finally {
      setPayLoading(false)
    }
  }

  const payStripeFromDetail = async () => {
    if (!detail?.id) return
    setStripeRedirectLoading(true)
    try {
      const data = await apiStripeCreateCheckout(detail.id, { returnPath: 'orders' })
      if (data.url) window.location.href = data.url
      else setStripeRedirectLoading(false)
    } catch (e) {
      window.alert(e.message || 'Could not start Stripe.')
      setStripeRedirectLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-[980px] px-4 pb-24 pt-14 md:px-6 md:pt-16">
      <div className="text-center md:text-left">
        <Motion.h1
          className="text-[32px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[40px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          Your orders
        </Motion.h1>
        <Motion.p
          className="mt-2 text-[15px] text-[#6e6e73]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease }}
        >
          Track shipments and review past purchases.
        </Motion.p>
      </div>

      {stripeVerifyLoading ? (
        <p className="mb-6 rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-center text-[15px] text-[#1d1d1f] shadow-sm">
          Confirming Stripe payment…
        </p>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <section aria-label="Order list">
          {listErr ? (
            <p className="text-[15px] text-[#bf4800]" role="alert">
              {listErr}
            </p>
          ) : loadingList ? (
            <p className="text-[15px] text-[#6e6e73]">Loading orders…</p>
          ) : list.length === 0 ? (
            <div className="rounded-[20px] border border-black/[0.06] bg-white px-6 py-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <p className="text-[17px] font-medium text-[#1d1d1f]">No orders yet</p>
              <p className="mt-2 text-[15px] text-[#6e6e73]">
                When you place an order, it will appear here.
              </p>
              <a
                href="#/order"
                className="mt-6 inline-block rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
              >
                Shop
              </a>
            </div>
          ) : (
            <ul className="space-y-3">
              {list.map((o) => {
                const active = selectedId === o.id
                return (
                  <li key={o.id}>
                    <a
                      href={`#/orders/${o.id}`}
                      className={[
                        'block rounded-[18px] border px-5 py-4 transition-shadow',
                        active
                          ? 'border-[#0071e3] bg-white shadow-[0_4px_24px_rgba(0,113,227,0.12)]'
                          : 'border-black/[0.06] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-black/[0.12]',
                      ].join(' ')}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="text-[13px] font-medium text-[#6e6e73]">
                            {formatOrderRef(o.id)}
                          </p>
                          <p className="mt-1 text-[17px] font-semibold text-[#1d1d1f]">
                            {money.format(Number(o.total_amount))}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[12px] font-medium capitalize text-[#1d1d1f]">
                          {o.status}
                        </span>
                      </div>
                      <p className="mt-2 text-[13px] text-[#6e6e73]">
                        {o.created_at
                          ? new Date(o.created_at).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : ''}
                        {o.item_count != null ? ` · ${o.item_count} item(s)` : null}
                      </p>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <aside
          className="rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] lg:sticky lg:top-24"
          aria-label="Order detail"
        >
          {!selectedId ? (
            <p className="text-[15px] text-[#6e6e73]">
              Select an order to see the full status timeline and line items.
            </p>
          ) : loadingDetail ? (
            <p className="text-[15px] text-[#6e6e73]">Loading…</p>
          ) : detailErr ? (
            <p className="text-[15px] text-[#bf4800]">{detailErr}</p>
          ) : detail ? (
            <div className="space-y-6">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wide text-[#6e6e73]">
                  Order
                </p>
                <p className="mt-1 text-[22px] font-semibold tracking-tight text-[#1d1d1f]">
                  {formatOrderRef(detail.id)}
                </p>
                <p className="mt-1 text-[15px] text-[#6e6e73]">
                  {detail.created_at
                    ? new Date(detail.created_at).toLocaleString(undefined, {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })
                    : null}
                </p>
              </div>

              <div>
                <h2 className="text-[19px] font-semibold text-[#1d1d1f]">Status</h2>
                <div className="mt-4">
                  <OrderTimeline status={detail.status} />
                </div>
              </div>

              {detail.shipping_address ? (
                <div>
                  <h2 className="text-[15px] font-semibold text-[#1d1d1f]">Shipping</h2>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#424245]">
                    {detail.shipping_address}
                  </p>
                </div>
              ) : null}

              <div>
                <h2 className="text-[15px] font-semibold text-[#1d1d1f]">Items</h2>
                <ul className="mt-3 space-y-3">
                  {items.map((line) => (
                    <li
                      key={line.id}
                      className="flex gap-3 border-b border-black/[0.06] pb-3 last:border-0"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f7]">
                        {sanitizeProductImageUrl(line.product_image_url) ? (
                          <img
                            src={sanitizeProductImageUrl(line.product_image_url)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-[#86868b]">
                            
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-medium text-[#1d1d1f]">
                          {line.product_name}
                        </p>
                        <p className="text-[12px] text-[#6e6e73]">
                          {line.product_sku} × {line.quantity}
                        </p>
                        <p className="mt-1 text-[14px] font-medium text-[#1d1d1f]">
                          {money.format(Number(line.unit_price) * Number(line.quantity))}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-black/[0.08] pt-4 text-[17px] font-semibold text-[#1d1d1f]">
                  <span>Total</span>
                  <span>{money.format(Number(detail.total_amount))}</span>
                </div>
              </div>

              {detail.status === 'placed' ? (
                <div className="space-y-2">
                  <p className="text-[12px] leading-snug text-[#6e6e73]">
                    Test card: <span className="font-mono">4242 4242 4242 4242</span>
                  </p>
                  {stripeConfigured ? (
                    <button
                      type="button"
                      disabled={payLoading || stripeRedirectLoading}
                      onClick={() => void payStripeFromDetail()}
                      className="w-full rounded-full bg-[#0071e3] py-3 text-[15px] font-medium text-white transition hover:bg-[#0077ed] disabled:bg-neutral-300"
                    >
                      {stripeRedirectLoading ? 'Redirecting…' : 'Pay with Stripe (test)'}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={payLoading || stripeRedirectLoading}
                    onClick={() => void payFromDetail()}
                    className="w-full rounded-full border border-black/[0.12] bg-white py-3 text-[15px] font-medium text-[#1d1d1f] transition hover:bg-black/[0.04] disabled:opacity-50"
                  >
                    {payLoading ? 'Processing…' : 'Mark as paid (demo)'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  )
}
