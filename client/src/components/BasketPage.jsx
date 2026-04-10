import { useCallback, useEffect, useMemo, useState } from 'react'
<<<<<<< HEAD
import { motion as Motion, AnimatePresence } from 'framer-motion'
=======
import { motion as Motion } from 'framer-motion'
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
import { apiProducts } from '../api/client.js'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'
import { money, priceOf } from '../utils/money.js'
import { sanitizeProductImageUrl } from '../utils/sanitizeImageUrl.js'

<<<<<<< HEAD
const ease = [0.22, 1, 0.36, 1]

=======
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
export default function BasketPage() {
  const { user, loading: authLoading } = useAuth()
  const { quantities, addDelta, setLineQty } = useCart()
  const [products, setProducts] = useState([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

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

  const isCustomer = user?.role === 'user'
  const isAdmin = user?.role === 'super_admin'

  return (
<<<<<<< HEAD
    <main className="mx-auto max-w-[1024px] px-4 pb-24 pt-14 md:px-6 md:pt-16">
      <div className="text-center md:text-left border-b border-black/[0.08] pb-6 mb-8">
        <Motion.h1
          className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          Check out your bag.
        </Motion.h1>
      </div>

      {!authLoading && isAdmin ? (
        <p className="mx-auto mt-4 mb-8 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-center text-[14px] text-amber-950">
=======
    <main className="mx-auto max-w-[720px] px-4 pb-24 pt-14 md:px-6 md:pt-16">
      <div className="text-center">
        <Motion.h1
          className="text-[32px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[40px]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Basket
        </Motion.h1>
        <Motion.p
          className="mx-auto mt-2 max-w-lg text-[15px] leading-snug text-[#6e6e73]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          Review your items, then continue to purchase.
        </Motion.p>
      </div>

      {!authLoading && isAdmin ? (
        <p className="mx-auto mt-8 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-center text-[14px] text-amber-950">
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
          Administrator accounts cannot check out. Use a customer account to purchase.
        </p>
      ) : null}

      {loading ? (
<<<<<<< HEAD
        <div className="flex py-20 justify-center">
          <p className="text-[17px] text-[#6e6e73]">Loading your bag…</p>
        </div>
      ) : loadError ? (
        <div className="flex py-20 justify-center">
          <p className="text-[17px] text-[#bf4800]" role="alert">
            {loadError}
          </p>
        </div>
      ) : cartLines.length === 0 ? (
        <Motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 rounded-[24px] border border-black/[0.04] bg-[#f5f5f7] px-6 py-20 text-center shadow-inner"
        >
          <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-2">Your bag is empty.</h2>
          <p className="text-[17px] text-[#6e6e73] mb-8">Start shopping to add items to your bag.</p>
          <a
            href="#/"
            className="inline-block rounded-full bg-[#0071e3] px-8 py-3.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
          >
            Browse products
          </a>
        </Motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mt-4">
          <div className="flex-1 w-full">
            <Motion.ul layout className="space-y-6" aria-label="Basket items">
              <AnimatePresence initial={false}>
                {cartLines.map(({ product: p, quantity: q }) => {
                  const stock = Number(p.stock) || 0
                  return (
                    <Motion.li
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.35, ease }}
                      className="group flex flex-col sm:flex-row gap-6 border border-black/[0.04] rounded-[24px] bg-white p-6 shadow-sm transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-black/[0.1] overflow-hidden"
                    >
                      <div className="relative h-40 w-full sm:w-40 shrink-0 overflow-hidden rounded-2xl bg-[#f5f5f7] flex items-center justify-center p-4">
                        {sanitizeProductImageUrl(p.image_url) ? (
                          <img
                            src={(sanitizeProductImageUrl(p.image_url) || '/iphone-models/fallback.png').replace('iphone-17-pro.avif', 'iphone-17-pro-orange-front-back.png').replace('.avif', '.png')}
                            alt=""
                            className="h-full w-full object-contain mix-blend-multiply"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/iphone-models/fallback.png'
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[24px] text-[#86868b]">
                            
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-0">
                          <div>
                            <h2 className="text-[20px] font-semibold text-[#1d1d1f] leading-tight">{p.name}</h2>
                            <p className="mt-1 text-[15px] text-[#6e6e73]">
                              {p.sku || 'Standard Configuration'}
                            </p>
                          </div>
                          <p className="text-[20px] font-semibold tracking-tight text-[#1d1d1f]">
                            {money.format(priceOf(p) * q)}
                          </p>
                        </div>

                        <div className="flex items-end sm:items-center justify-between mt-auto pt-4 border-t border-black/[0.04]">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[17px] text-[#1d1d1f] bg-[#f5f5f7] transition hover:bg-[#e8e8ed]"
                                aria-label={`Decrease ${p.name}`}
                                onClick={() => addDelta(p.id, -1, stock)}
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min={0}
                                max={stock}
                                value={q}
                                onChange={(e) => setLineQty(p.id, e.target.value, stock)}
                                className="w-10 border-0 bg-transparent text-center text-[15px] font-medium text-[#1d1d1f] outline-none"
                                aria-label={`Quantity for ${p.name}`}
                              />
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[17px] text-[#1d1d1f] bg-[#f5f5f7] transition hover:bg-[#e8e8ed] disabled:opacity-40"
                                aria-label={`Increase ${p.name}`}
                                disabled={q >= stock}
                                onClick={() => addDelta(p.id, 1, stock)}
                              >
                                +
                              </button>
                            </div>
                            {stock <= 5 && stock > 0 ? (
                              <span className="text-[12px] font-medium text-[#bf4800]">Only {stock} in stock</span>
                            ) : null}
                          </div>

                          <button
                            onClick={() => setLineQty(p.id, 0, stock)}
                            className="text-[14px] font-medium text-[#0071e3] transition hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </Motion.li>
                  )
                })}
              </AnimatePresence>
            </Motion.ul>
          </div>

          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="w-full lg:w-[360px] shrink-0"
          >
            <div className="rounded-[24px] bg-[#f5f5f7] p-8 lg:sticky lg:top-24">
              <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-6">Summary</h3>

              <div className="space-y-3 border-b border-black/[0.08] pb-6 mb-6">
                <div className="flex justify-between text-[15px] text-[#1d1d1f]">
                  <span>Subtotal</span>
                  <span className="font-medium">{money.format(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[15px] text-[#1d1d1f]">
                  <span>Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-[20px] font-semibold text-[#1d1d1f]">Total</span>
                <span className="text-[24px] font-semibold tracking-tight text-[#1d1d1f]">{money.format(cartTotal)}</span>
              </div>

              {!authLoading && !user ? (
                <div className="mb-4 text-center text-[13px] text-[#6e6e73] bg-white rounded-xl p-3 shadow-sm border border-black/[0.04]">
                  <a href="#/login" className="font-medium text-[#0071e3] hover:underline">
                    Sign in
                  </a>{' '}
                  or{' '}
                  <a href="#/register" className="font-medium text-[#0071e3] hover:underline">
                    register
                  </a>{' '}
                  to checkout.
                </div>
              ) : null}

              <a
                href="#/order"
                className={`block w-full rounded-full py-3.5 text-center text-[16px] font-medium text-white transition ${!isCustomer || authLoading
                    ? 'pointer-events-none bg-[#cfcfcf]'
                    : 'bg-[#0071e3] hover:bg-[#0077ed]'
                  }`}
                aria-disabled={!isCustomer || authLoading}
              >
                Checkout
              </a>

              <a
                href="#/"
                className="mt-4 block w-full rounded-full border border-black/[0.12] bg-transparent py-3 text-center text-[16px] font-medium text-[#1d1d1f] transition hover:bg-black/[0.04]"
              >
                Continue shopping
              </a>
            </div>
          </Motion.div>
=======
        <p className="mt-16 text-center text-[15px] text-[#6e6e73]">Loading…</p>
      ) : loadError ? (
        <p className="mt-16 text-center text-[15px] text-[#bf4800]" role="alert">
          {loadError}
        </p>
      ) : cartLines.length === 0 ? (
        <div className="mt-16 rounded-[20px] border border-black/[0.06] bg-white px-6 py-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <p className="text-[17px] font-medium text-[#1d1d1f]">Your basket is empty.</p>
          <p className="mt-2 text-[15px] text-[#6e6e73]">
            Items you add will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          <ul className="space-y-4" aria-label="Basket items">
            {cartLines.map(({ product: p, quantity: q }) => {
              const stock = Number(p.stock) || 0
              return (
                <li
                  key={p.id}
                  className="flex flex-col gap-4 rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center"
                >
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-neutral-100 to-neutral-200/80 sm:h-24 sm:w-28">
                    {sanitizeProductImageUrl(p.image_url) ? (
                      <img
                        src={sanitizeProductImageUrl(p.image_url)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[12px] text-[#6e6e73]">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[17px] font-semibold text-[#1d1d1f]">{p.name}</h2>
                    <p className="mt-0.5 text-[14px] text-[#6e6e73]">
                      {money.format(priceOf(p))} each
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 rounded-full border border-black/[0.1] bg-[#f5f5f7] px-1 py-1">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[17px] transition hover:bg-black/[0.06]"
                          aria-label={`Decrease ${p.name}`}
                          onClick={() => addDelta(p.id, -1, stock)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={stock}
                          value={q}
                          onChange={(e) => setLineQty(p.id, e.target.value, stock)}
                          className="w-12 border-0 bg-transparent text-center text-[15px] text-[#1d1d1f] outline-none"
                          aria-label={`Quantity for ${p.name}`}
                        />
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[17px] transition hover:bg-black/[0.06] disabled:opacity-40"
                          aria-label={`Increase ${p.name}`}
                          disabled={q >= stock}
                          onClick={() => addDelta(p.id, 1, stock)}
                        >
                          +
                        </button>
                      </div>
                      {stock <= 5 && stock > 0 ? (
                        <span className="text-[12px] text-[#bf4800]">Only {stock} in stock</span>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-right text-[17px] font-semibold text-[#1d1d1f] sm:shrink-0">
                    {money.format(priceOf(p) * q)}
                  </p>
                </li>
              )
            })}
          </ul>

          <div className="rounded-[20px] border border-black/[0.06] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex justify-between text-[17px] font-semibold text-[#1d1d1f]">
              <span>Subtotal</span>
              <span>{money.format(cartTotal)}</span>
            </div>
            {!authLoading && !user ? (
              <p className="mt-4 text-center text-[14px] text-[#6e6e73]">
                <a href="#/login" className="font-medium text-[#0066cc] hover:underline">
                  Sign in
                </a>{' '}
                or{' '}
                <a href="#/register" className="font-medium text-[#0066cc] hover:underline">
                  register
                </a>{' '}
                to purchase.
              </p>
            ) : null}
            <a
              href="#/order"
              className={`mt-4 block w-full rounded-full py-3.5 text-center text-[16px] font-medium text-white transition ${
                !isCustomer || authLoading
                  ? 'pointer-events-none bg-neutral-300'
                  : 'bg-[#1d1d1f] hover:bg-neutral-800'
              }`}
              aria-disabled={!isCustomer || authLoading}
            >
              Continue to order processing
            </a>
            <a
              href="#/"
              className="mt-3 block w-full rounded-full border border-black/[0.12] py-3 text-center text-[15px] font-medium text-[#1d1d1f] transition hover:bg-black/[0.04]"
            >
              Back to home
            </a>
          </div>
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
        </div>
      )}
    </main>
  )
}
