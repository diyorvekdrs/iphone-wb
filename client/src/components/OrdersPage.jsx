import { useCallback, useEffect, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
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

function StatusBadge({ status }) {
  const s = status?.toLowerCase()
  let bg = 'bg-neutral-100 text-neutral-800'
  let label = 'Pending Payment'
  
  if (s === 'placed') { bg = 'bg-amber-50 text-amber-700'; label = 'Pending Payment' }
  else if (s === 'paid') { bg = 'bg-blue-50 text-blue-700'; label = 'Paid' }
  else if (s === 'processing') { bg = 'bg-indigo-50 text-indigo-700'; label = 'Processing' }
  else if (s === 'shipped') { bg = 'bg-orange-50 text-orange-700'; label = 'Shipped' }
  else if (s === 'delivered') { bg = 'bg-green-50 text-green-700'; label = 'Delivered' }
  else if (s === 'cancelled') { bg = 'bg-red-50 text-red-700'; label = 'Cancelled' }
  else { label = status }

  return (
    <span className={`inline-flex items-center px-3 py-[6px] rounded-full text-[13px] font-medium tracking-wide ${bg}`}>
      {label}
    </span>
  )
}

function OrderDetailModal({ 
  orderId, 
  onClose, 
  detail, 
  items, 
  loading, 
  detailErr, 
  payLoading, 
  stripeRedirectLoading, 
  stripeConfigured,
  payFromDetail,
  payStripeFromDetail
}) {
  if (!orderId) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-6">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease }}
          className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/[0.04] px-6 py-5">
            <h2 className="text-[20px] font-semibold text-[#1d1d1f]">Order Details</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f] transition duration-200 hover:bg-[#e8e8ed]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading ? (
               <div className="flex py-12 justify-center"><p className="text-[15px] text-[#6e6e73]">Loading details…</p></div>
            ) : detailErr ? (
               <div className="flex py-12 justify-center"><p className="text-[15px] text-[#bf4800]">{detailErr}</p></div>
            ) : detail ? (
              <div className="space-y-8">
                {/* Intro */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-medium uppercase tracking-wider text-[#6e6e73]">
                      Order No.
                    </p>
                    <p className="mt-1 text-[24px] font-semibold tracking-tight text-[#1d1d1f]">
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
                    <StatusBadge status={detail.status} />
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-4">Status</h3>
                  <div className="rounded-[16px] bg-[#f5f5f7] p-5">
                    <OrderTimeline status={detail.status} />
                  </div>
                </div>

                {/* Shipping */}
                {detail.shipping_full_name || detail.shipping_address ? (
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">Shipping Details</h3>
                    <div className="text-[15px] leading-relaxed text-[#424245] bg-[#f5f5f7] p-4 rounded-[16px]">
                      {detail.shipping_full_name ? (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-[#1d1d1f]">{detail.shipping_full_name}</p>
                          <p>{detail.shipping_street}</p>
                          <p>{detail.shipping_city}, {detail.shipping_region} {detail.shipping_zip}</p>
                          <p>{detail.shipping_country}</p>
                          <div className="mt-2 pt-2 border-t border-black/[0.04]">
                             <p className="text-[13px] text-[#6e6e73]">Phone: {detail.shipping_phone}</p>
                          </div>
                        </div>
                      ) : (
                        <p>{detail.shipping_address}</p>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Items */}
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">Items</h3>
                  <div className="rounded-[16px] border border-black/[0.04] overflow-hidden">
                    <ul className="divide-y divide-black/[0.04]">
                      {items.map((line) => (
                        <li key={line.id} className="flex gap-4 p-4 items-center bg-white">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f7] flex justify-center items-center p-1.5">
                            {sanitizeProductImageUrl(line.product_image_url) ? (
                              <img
                                src={(sanitizeProductImageUrl(line.product_image_url) || '/iphone-models/fallback.png').replace('iphone-17-pro.avif', 'iphone-17-pro-orange-front-back.png').replace('.avif', '.png')}
                                alt={line.product_name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <div className="text-[12px] text-[#86868b]"></div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-medium text-[#1d1d1f]">
                              {line.product_name}
                            </p>
                            <p className="mt-0.5 text-[13px] text-[#6e6e73]">
                              {line.product_sku}
                            </p>
                          </div>
                          <div className="text-right">
                             <p className="text-[15px] font-medium text-[#1d1d1f]">
                              {money.format(Number(line.unit_price) * Number(line.quantity))}
                            </p>
                             <p className="text-[13px] text-[#6e6e73] mt-0.5">
                              Qty: {line.quantity}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-[#fcfcfc] px-4 py-4 flex justify-between items-center border-t border-black/[0.04]">
                      <span className="text-[15px] font-medium text-[#1d1d1f]">Total</span>
                      <span className="text-[20px] font-semibold text-[#1d1d1f] tracking-tight">{money.format(Number(detail.total_amount))}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Actions */}
                {detail.status === 'placed' ? (
                  <div className="rounded-[16px] bg-[#f5f5f7] p-5 space-y-3">
                    <p className="text-[13px] leading-snug text-[#6e6e73]">
                      Awaiting payment. Test card: <span className="font-mono bg-black/[0.04] px-1 py-0.5 rounded">4242 4242 4242 4242</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {stripeConfigured ? (
                        <button
                          type="button"
                          disabled={payLoading || stripeRedirectLoading}
                          onClick={payStripeFromDetail}
                          className="flex-1 cursor-pointer rounded-full bg-[#0071e3] py-2.5 text-[15px] font-medium text-white transition-all duration-200 hover:bg-[#0077ed] disabled:cursor-not-allowed disabled:bg-neutral-300"
                        >
                          {stripeRedirectLoading ? 'Redirecting…' : 'Pay with Stripe'}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        disabled={payLoading || stripeRedirectLoading}
                        onClick={payFromDetail}
                        className="flex-1 cursor-pointer rounded-full border border-black/[0.12] bg-white py-2.5 text-[15px] font-medium text-[#1d1d1f] transition-all duration-200 hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {payLoading ? 'Processing…' : 'Complete Payment (Demo)'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  )
}

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

  // Filtering / Sorting State
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState('Newest') 

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

  const loadDetail = useCallback(async (id) => {
    if (!id) return
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

  useEffect(() => {
    if (ordersDetailId) {
      void loadDetail(ordersDetailId)
    } else {
      setDetail(null)
      setItems([])
      setDetailErr('')
    }
  }, [ordersDetailId, loadDetail])

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

  const closeModal = () => {
    window.location.hash = '#/orders'
  }

  // Derived state for filtering and sorting
  const filteredList = list.filter(o => {
    if (statusFilter === 'All') return true
    if (statusFilter === 'Pending' && o.status === 'placed') return true
    if (statusFilter === 'Processing' && (o.status === 'paid' || o.status === 'processing')) return true
    if (statusFilter === 'Shipped' && o.status === 'shipped') return true
    if (statusFilter === 'Delivered' && o.status === 'delivered') return true
    if (statusFilter === 'Cancelled' && o.status === 'cancelled') return true
    return false
  }).sort((a, b) => {
    const timeA = new Date(a.created_at).getTime()
    const timeB = new Date(b.created_at).getTime()
    return sortOrder === 'Newest' ? timeB - timeA : timeA - timeB
  })

  return (
    <main className="mx-auto max-w-[980px] px-4 pb-24 pt-14 md:px-6 md:pt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/[0.08] pb-6 mb-8 gap-4">
        <div>
          <Motion.h1
            className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            My Orders
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
        
        {/* Filters and Sorting */}
        {list.length > 0 && (
           <Motion.div 
             className="flex gap-3"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.4, delay: 0.2 }}
           >
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)}
                className="rounded-full border border-black/[0.12] bg-transparent px-4 py-2 text-[14px] font-medium text-[#1d1d1f] focus:border-[#0071e3] focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select 
                value={sortOrder} 
                onChange={e => setSortOrder(e.target.value)}
                className="rounded-full border border-black/[0.12] bg-transparent px-4 py-2 text-[14px] font-medium text-[#1d1d1f] focus:border-[#0071e3] focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
           </Motion.div>
        )}
      </div>

      {stripeVerifyLoading ? (
        <p className="mb-8 rounded-2xl border border-black/[0.08] bg-white px-5 py-4 text-center text-[15px] font-medium text-[#1d1d1f] shadow-sm">
          Confirming Stripe payment… please wait.
        </p>
      ) : null}

      <section aria-label="Order list" className="w-full">
        {listErr ? (
          <p className="text-[15px] text-[#bf4800]" role="alert">
            {listErr}
          </p>
        ) : loadingList ? (
          <div className="flex py-12 justify-center">
             <p className="text-[15px] text-[#6e6e73]">Loading orders…</p>
          </div>
        ) : list.length === 0 ? (
          <Motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-[24px] border border-black/[0.06] bg-white px-6 py-20 text-center shadow-sm"
          >
            <div className="h-16 w-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h3 className="text-[20px] font-semibold text-[#1d1d1f]">You haven’t placed any orders yet</h3>
            <p className="mt-2 text-[15px] text-[#6e6e73] max-w-sm mx-auto">
              Start exploring our products and your orders will appear here.
            </p>
            <a
              href="#/"
              className="mt-8 inline-block rounded-full bg-[#0071e3] px-8 py-3 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
            >
              Browse Products
            </a>
          </Motion.div>
        ) : filteredList.length === 0 ? (
           <div className="flex py-12 justify-center text-center flex-col items-center">
             <p className="text-[17px] font-medium text-[#1d1d1f]">No orders found</p>
             <p className="text-[15px] text-[#6e6e73] mt-2">Try adjusting your filters.</p>
           </div>
        ) : (
          <ul className="space-y-5">
            {filteredList.map((o, idx) => {
              // Extract main item to display on the card
              let mainItem = null
              let extraCount = 0
              if (o.items && o.items.length > 0) {
                 mainItem = o.items[0]
                 extraCount = o.items.length - 1
              }

              return (
                <Motion.li 
                  key={o.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <a
                    href={`#/orders/${o.id}`}
                    className="group block overflow-hidden rounded-[20px] border border-black/[0.06] bg-white transition-all hover:border-black/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex flex-col md:flex-row p-5 md:p-6 gap-6 md:items-center">
                      
                      {/* Product Image */}
                      <div className="h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-[16px] bg-[#f5f5f7] flex items-center justify-center p-3">
                        {mainItem && sanitizeProductImageUrl(mainItem.product_image_url) ? (
                            <img
                              src={(sanitizeProductImageUrl(mainItem.product_image_url) || '/iphone-models/fallback.png').replace('iphone-17-pro.avif', 'iphone-17-pro-orange-front-back.png').replace('.avif', '.png')}
                              alt={mainItem.product_name}
                              className="h-full w-full object-contain mix-blend-multiply"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = '/iphone-models/fallback.png'
                              }}
                            />
                        ) : (
                            <div className="text-[20px] text-[#86868b]"></div>
                        )}
                      </div>

                      {/* Details Main */}
                      <div className="flex-1 min-w-0">
                         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                           <div>
                              <h3 className="text-[19px] font-semibold tracking-tight text-[#1d1d1f]">
                                {mainItem ? mainItem.product_name : `Order ${formatOrderRef(o.id)}`}
                              </h3>
                              {mainItem && (
                                <p className="text-[14px] text-[#6e6e73] mt-1">
                                  {mainItem.product_sku} <span className="mx-1.5">•</span> Qty: {mainItem.quantity} {extraCount > 0 ? <span className="ml-1.5">+ {extraCount} more item{extraCount > 1 ? 's' : ''}</span> : ''}
                                </p>
                              )}
                           </div>
                           <div className="flex flex-col items-start sm:items-end gap-1">
                              <StatusBadge status={o.status} />
                           </div>
                         </div>

                         <div className="grid grid-cols-2 sm:flex gap-x-6 gap-y-3 sm:gap-10 mt-6 pt-5 border-t border-black/[0.04]">
                           <div>
                             <p className="text-[12px] uppercase tracking-wider font-semibold text-[#86868b] mb-1">Order Date</p>
                             <p className="text-[15px] font-medium text-[#1d1d1f]">
                                {new Date(o.created_at).toLocaleDateString(undefined, {
                                   month: 'short', day: 'numeric', year: 'numeric'
                                })}
                             </p>
                           </div>
                           <div>
                             <p className="text-[12px] uppercase tracking-wider font-semibold text-[#86868b] mb-1">Order Total</p>
                             <p className="text-[15px] font-medium text-[#1d1d1f]">
                                {money.format(Number(o.total_amount))}
                             </p>
                           </div>
                           <div>
                              <p className="text-[12px] uppercase tracking-wider font-semibold text-[#86868b] mb-1">Order #</p>
                              <p className="text-[15px] font-medium text-[#1d1d1f] whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                                 {formatOrderRef(o.id)}
                              </p>
                           </div>
                         </div>
                      </div>

                      {/* Chevron icon visible on hover (desktop) or always visible context */}
                      <div className="hidden md:flex shrink-0 items-center justify-center p-3 text-neutral-400 group-hover:text-[#0071e3] transition-colors">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>

                    </div>
                  </a>
                </Motion.li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Modal for detail view */}
      {ordersDetailId && (
         <OrderDetailModal 
            orderId={ordersDetailId}
            onClose={closeModal}
            detail={detail}
            items={items}
            loading={loadingDetail}
            detailErr={detailErr}
            payLoading={payLoading}
            stripeRedirectLoading={stripeRedirectLoading}
            stripeConfigured={stripeConfigured}
            payFromDetail={payFromDetail}
            payStripeFromDetail={payStripeFromDetail}
         />
      )}
    </main>
  )
}
