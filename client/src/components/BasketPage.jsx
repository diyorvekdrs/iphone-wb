import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { apiProducts } from '../api/client.js'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'
import { money, priceOf } from '../utils/money.js'
import { sanitizeProductImageUrl } from '../utils/sanitizeImageUrl.js'

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
      setLoadError(e.message || 'Could not load products.')
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
          Administrator accounts cannot check out. Use a customer account to purchase.
        </p>
      ) : null}

      {loading ? (
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
        </div>
      )}
    </main>
  )
}
