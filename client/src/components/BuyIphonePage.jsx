import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { apiProducts } from '../api/client.js'
import { DEFAULT_SIM_OPTION_ID, getBuyPageConfig } from '../data/buyIphonePage.js'
import { iphoneModels } from '../data/iphoneModels.js'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'
import { money, priceOf } from '../utils/money.js'
import { findProductByIphoneModelId, iphoneBuyHref, iphonePageHref } from '../utils/iphoneRoutes.js'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function formatGb(gb) {
  const n = Number(gb)
  if (!Number.isFinite(n)) return '—'
  if (n >= 1024) return `${n / 1024}TB`
  return `${n}GB`
}

/** Matches `PurchasePage` — catalog base storage → upgrade delta. */
function storageDeltaUsd(selectedGb, baseGb) {
  const s = Number(selectedGb)
  const b = Number(baseGb)
  if (!Number.isFinite(s) || !Number.isFinite(b)) return 0
  if (s <= b) return 0
  const ratio = s / b
  if (ratio >= 8) return 400
  if (ratio >= 4) return 200
  if (ratio >= 2) return 100
  return 0
}

const ease = [0.22, 1, 0.36, 1]

const MAX_BUY_QUANTITY = 5

export default function BuyIphonePage({ modelId }) {
  const { user, loading: authLoading } = useAuth()
  const { addPaymentLine } = useCart()
  const config = useMemo(() => getBuyPageConfig(modelId), [modelId])
  const {
    name,
    colors,
    storageTiers,
    carriers,
    simOptions,
    alternateModels,
    carrierPricingNote,
  } = config

  const [storageIdx, setStorageIdx] = useState(0)
  const [colorIdx, setColorIdx] = useState(0)
  const [carrierId, setCarrierId] = useState('later')
  const [simOptionId, setSimOptionId] = useState(DEFAULT_SIM_OPTION_ID)
  const [quantity, setQuantity] = useState(1)

  const [products, setProducts] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')
  const [checkoutError, setCheckoutError] = useState('')

  const safeStorageIdx = clamp(storageIdx, 0, Math.max(0, storageTiers.length - 1))
  const safeColorIdx = clamp(colorIdx, 0, Math.max(0, colors.length - 1))
  const tier = storageTiers[safeStorageIdx] ?? storageTiers[0]
  const activeColor = colors[safeColorIdx] ?? colors[0]
  const carrier = carriers.find((c) => c.id === carrierId) ?? carriers[carriers.length - 1]
  const simOption =
    simOptions.find((s) => s.id === simOptionId) ?? simOptions[simOptions.length - 1]

  const loadProducts = useCallback(async () => {
    setCatalogError('')
    setCatalogLoading(true)
    try {
      const { products: list } = await apiProducts()
      setProducts(Array.isArray(list) ? list : [])
    } catch (e) {
      setCatalogError(e.message || 'Unable to connect to server.')
      setProducts([])
    } finally {
      setCatalogLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  const baseProduct = useMemo(
    () => findProductByIphoneModelId(products, modelId),
    [products, modelId],
  )

  const chargedPrice = useMemo(() => {
    if (!baseProduct) return tier?.priceUsd ?? 0
    return priceOf(baseProduct) + storageDeltaUsd(Number(tier?.gb), Number(baseProduct.storage_gb))
  }, [baseProduct, tier])

  const catalogStock = baseProduct ? Number(baseProduct.stock) || 0 : 0
  const maxBuyQty =
    catalogStock > 0 ? Math.min(MAX_BUY_QUANTITY, catalogStock) : MAX_BUY_QUANTITY
  const safeQuantity = clamp(quantity, 1, maxBuyQty)

  const lineTotal = chargedPrice * safeQuantity
  const canBuy =
    !!baseProduct &&
    catalogStock > 0 &&
    catalogStock >= safeQuantity &&
    user?.role === 'user' &&
    !authLoading

  useEffect(() => {
    setStorageIdx(0)
    setColorIdx(0)
    setCarrierId('later')
    setSimOptionId(DEFAULT_SIM_OPTION_ID)
    setQuantity(1)
    setCheckoutError('')
  }, [modelId])

  useEffect(() => {
    if (!baseProduct || catalogStock <= 0) return
    const cap = Math.min(MAX_BUY_QUANTITY, catalogStock)
    setQuantity((q) => clamp(q, 1, cap))
  }, [baseProduct?.id, catalogStock])

  const showConnectivityDiscount =
    modelId === '17' && carrierId !== 'later' && tier?.gb === 256
  const crossedPrice = showConnectivityDiscount ? chargedPrice + 30 : null
  const crossedLineTotal = crossedPrice != null ? crossedPrice * safeQuantity : null

  const lineup = useMemo(
    () => iphoneModels.filter((m) => !m.isAction && m.id !== modelId).slice(0, 5),
    [modelId],
  )

  const faq = [
    {
      q: 'What is eSIM?',
      a: 'An eSIM is a digital SIM — you can activate cellular service without a physical SIM card. Many carriers support quick activation when you set up your new iPhone.',
    },
    {
      q: 'Will my new iPhone be unlocked?',
      a: 'Phones purchased outright are typically unlocked. If you finance through a carrier, your device may be locked for the term of your agreement — check with your carrier.',
    },
    {
      q: 'Can I return my iPhone?',
      a: 'Yes — if you change your mind, you can return your iPhone in good condition subject to our sales and refund policy.',
    },
    {
      q: 'Does the advertised price include a carrier discount?',
      a: 'Some promotions require activation with a participating carrier at purchase. Choosing “Connect on your own later” shows the full device price without a carrier discount.',
    },
  ]

  const goToPayment = () => {
    setCheckoutError('')
    if (!baseProduct) {
      setCheckoutError('No matching product in the catalog for this iPhone.')
      return
    }
    if (catalogStock <= 0) {
      setCheckoutError('This model is out of stock.')
      return
    }
    if (safeQuantity > catalogStock) {
      setCheckoutError(`Only ${catalogStock} in stock — lower the quantity.`)
      return
    }
    if (!user || user.role !== 'user') {
      setCheckoutError('Sign in with your customer account to complete purchase.')
      return
    }
    const optionNote = [
      safeQuantity > 1 ? `Quantity: ${safeQuantity}` : null,
      activeColor?.label ? `Color: ${activeColor.label}` : null,
      tier?.gb ? `Storage: ${formatGb(tier.gb)}` : null,
      carrier?.name ? `Connection: ${carrier.name}` : null,
      simOption?.label ? `SIM: ${simOption.label}` : null,
    ]
      .filter(Boolean)
      .join(' · ')
    addPaymentLine({
      productId: baseProduct.id,
      quantity: safeQuantity,
      modelId,
      modelName: name,
      unitPrice: chargedPrice,
      image: activeColor?.image ?? null,
      notes: optionNote,
    })
    window.location.hash = '#/payment'
  }

  const isAdmin = user?.role === 'super_admin'

  return (
    <main className="mx-auto max-w-[1068px] px-4 pb-24 pt-8 md:px-6 md:pt-10">
      <nav aria-label="Breadcrumb" className="text-[12px] text-[#6e6e73]">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <li>
            <a href="#/" className="hover:underline">
              Store
            </a>
          </li>
          <li aria-hidden className="text-[#86868b]">
            /
          </li>
          <li>
            <a href="#iphone-category" className="hover:underline">
              iPhone
            </a>
          </li>
          <li aria-hidden className="text-[#86868b]">
            /
          </li>
          <li className="text-[#1d1d1f]">{name}</li>
        </ol>
      </nav>

      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
      >
        <h1 className="mt-6 text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-[#1d1d1f] md:text-[48px]">
          Buy {name}
        </h1>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-[#6e6e73]">
          Choose your options and check out here. Carrier deals shown below are illustrative — see
          your carrier for current offers.
        </p>
      </Motion.div>

      {!authLoading && isAdmin ? (
        <p className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-center text-[14px] text-amber-950">
          Administrator accounts cannot place orders. Open this page signed in as a customer to
          purchase.
        </p>
      ) : null}

      {/* Carrier deals strip */}
      <section className="mt-10" aria-labelledby="carrier-deals-heading">
        <h2 id="carrier-deals-heading" className="text-[21px] font-semibold text-[#1d1d1f]">
          Carrier deals
        </h2>
        <p className="mt-1 text-[14px] text-[#6e6e73]">Select how you would like to connect.</p>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {carriers.map((c) => {
            const on = carrierId === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCarrierId(c.id)}
                className={[
                  'min-w-[200px] shrink-0 rounded-2xl border px-4 py-3 text-left transition-colors md:min-w-0',
                  on
                    ? 'border-[#0071e3] bg-white shadow-[0_0_0_1px_rgba(0,113,227,0.35)]'
                    : 'border-black/[0.12] bg-white hover:border-black/25',
                ].join(' ')}
              >
                <span className="block text-[15px] font-semibold text-[#1d1d1f]">
                  {c.name}
                  {c.footnote ? (
                    <span className="ml-0.5 align-super text-[11px] text-[#6e6e73]">{c.footnote}</span>
                  ) : null}
                </span>
                <span className="mt-1 block text-[13px] leading-snug text-[#6e6e73]">{c.shortDeal}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="sim-config-heading">
        <h2 id="sim-config-heading" className="text-[21px] font-semibold text-[#1d1d1f]">
          SIM
        </h2>
        <p className="mt-1 text-[14px] text-[#6e6e73]">
          Choose physical SIM, eSIM, or a combination. Availability can vary by region and carrier.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {simOptions.map((opt) => {
            const on = simOptionId === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSimOptionId(opt.id)}
                className={[
                  'flex flex-col rounded-2xl border px-4 py-3.5 text-left transition-colors',
                  on
                    ? 'border-[#0071e3] bg-white shadow-[0_0_0_1px_rgba(0,113,227,0.35)]'
                    : 'border-black/[0.12] bg-white hover:border-black/25',
                ].join(' ')}
              >
                <span className="text-[15px] font-semibold text-[#1d1d1f]">{opt.label}</span>
                <span className="mt-1 text-[13px] leading-snug text-[#6e6e73]">{opt.description}</span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
        <div className="space-y-12">
          {alternateModels.length > 0 ? (
            <section aria-labelledby="model-switch">
              <h2 id="model-switch" className="text-[21px] font-semibold text-[#1d1d1f]">
                Model
              </h2>
              <p className="mt-1 text-[14px] text-[#6e6e73]">Switch to another size in the same family.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full border border-[#0071e3] bg-white px-4 py-2 text-[14px] font-medium text-[#0071e3]">
                  {name}
                </span>
                {alternateModels.map((m) => (
                  <a
                    key={m.id}
                    href={iphoneBuyHref(m.id)}
                    className="inline-flex rounded-full border border-black/[0.12] bg-white px-4 py-2 text-[14px] font-medium text-[#1d1d1f] transition-colors hover:border-black/25"
                  >
                    {m.name}
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          <section aria-labelledby="storage-heading">
            <h2 id="storage-heading" className="text-[21px] font-semibold text-[#1d1d1f]">
              Storage
            </h2>
            <p className="mt-1 text-[14px] text-[#6e6e73]">How much space do you need?</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {storageTiers.map((t, i) => {
                const on = safeStorageIdx === i
                return (
                  <button
                    key={t.gb}
                    type="button"
                    onClick={() => setStorageIdx(i)}
                    className={[
                      'flex flex-col rounded-2xl border px-4 py-4 text-left transition-colors',
                      on
                        ? 'border-[#0071e3] bg-white shadow-[0_0_0_1px_rgba(0,113,227,0.35)]'
                        : 'border-black/[0.12] bg-white hover:border-black/25',
                    ].join(' ')}
                  >
                    <span className="text-[15px] font-semibold text-[#1d1d1f]">{formatGb(t.gb)}</span>
                    <span className="mt-1 text-[14px] text-[#6e6e73]">
                      {baseProduct
                        ? money.format(
                            priceOf(baseProduct) + storageDeltaUsd(t.gb, Number(baseProduct.storage_gb)),
                          )
                        : money.format(t.priceUsd)}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="color-heading">
            <h2 id="color-heading" className="text-[21px] font-semibold text-[#1d1d1f]">
              Finish
            </h2>
            <p className="mt-1 text-[14px] text-[#6e6e73]">{name} in your favorite color.</p>
            <div className="mt-4 flex flex-wrap gap-3" role="group" aria-label="Finishes">
              {colors.map((c, i) => {
                const on = safeColorIdx === i
                return (
                  <button
                    key={`${c.label}-${i}`}
                    type="button"
                    title={c.label}
                    onClick={() => setColorIdx(i)}
                    className={[
                      'flex items-center gap-2 rounded-full border px-3 py-2 text-[14px] transition-colors',
                      on
                        ? 'border-[#0071e3] bg-white shadow-[0_0_0_1px_rgba(0,113,227,0.25)]'
                        : 'border-black/[0.12] bg-white hover:border-black/25',
                    ].join(' ')}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-black/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
                      style={{ backgroundColor: c.swatch }}
                    />
                    <span className="font-medium text-[#1d1d1f]">{c.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="border-t border-black/[0.08] pt-10" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
              Frequently asked questions
            </h2>
            <ul className="mt-6 divide-y divide-black/[0.08] border-t border-black/[0.08]">
              {faq.map((item) => (
                <li key={item.q} className="py-5">
                  <p className="text-[17px] font-semibold text-[#1d1d1f]">{item.q}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{item.a}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-black/[0.08] pt-10" aria-labelledby="lineup-heading">
            <h2 id="lineup-heading" className="text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
              Which iPhone is right for you?
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lineup.map((m) => (
                <a
                  key={m.id}
                  href={iphoneBuyHref(m.id)}
                  className="group rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
                >
                  <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#6e6e73]">
                    iPhone
                  </p>
                  <p className="mt-1 text-[19px] font-semibold text-[#1d1d1f]">{m.name}</p>
                  <p className="mt-3 text-[14px] font-medium text-[#0071e3] group-hover:underline">
                    Shop {m.name}
                  </p>
                </a>
              ))}
            </div>
            <p className="mt-6 text-center">
              <a href="#/compare" className="text-[15px] font-medium text-[#0071e3] hover:underline">
                Compare all iPhone models
              </a>
            </p>
          </section>
        </div>

        <aside className="lg:pt-0">
          <div className="sticky top-24 rounded-3xl border border-black/[0.08] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-[#f5f5f7]">
              {activeColor?.image ? (
                <img
                  src={activeColor.image}
                  alt=""
                  className="h-full w-full object-contain p-4"
                  loading="eager"
                  decoding="async"
                />
              ) : null}
            </div>
            <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#6e6e73]">
              Your selection
            </p>
            <p className="mt-1 text-[21px] font-semibold text-[#1d1d1f]">{name}</p>
            <ul className="mt-4 space-y-2 text-[14px] text-[#6e6e73]">
              <li>
                <span className="text-[#1d1d1f]">Storage:</span> {formatGb(tier?.gb)}
              </li>
              <li>
                <span className="text-[#1d1d1f]">Finish:</span> {activeColor?.label ?? '—'}
              </li>
              <li>
                <span className="text-[#1d1d1f]">Connection:</span> {carrier.name}
              </li>
              <li>
                <span className="text-[#1d1d1f]">SIM:</span> {simOption?.label ?? '—'}
              </li>
            </ul>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[14px] font-medium text-[#1d1d1f]">Quantity</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={
                    safeQuantity <= 1 || !baseProduct || catalogStock <= 0 || catalogLoading
                  }
                  onClick={() => setQuantity((q) => clamp(q - 1, 1, maxBuyQty))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.12] bg-white text-[18px] font-medium leading-none text-[#1d1d1f] transition-colors hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>
                <span className="min-w-[2.25rem] text-center text-[16px] font-semibold tabular-nums text-[#1d1d1f]">
                  {safeQuantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={
                    safeQuantity >= maxBuyQty || !baseProduct || catalogStock <= 0 || catalogLoading
                  }
                  onClick={() => setQuantity((q) => clamp(q + 1, 1, maxBuyQty))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.12] bg-white text-[18px] font-medium leading-none text-[#1d1d1f] transition-colors hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
            {baseProduct && catalogStock > 0 && catalogStock < MAX_BUY_QUANTITY ? (
              <p className="mt-2 text-[12px] leading-snug text-[#86868b]">
                {catalogStock} in stock — you can buy up to {maxBuyQty}.
              </p>
            ) : null}

            {catalogLoading ? (
              <p className="mt-6 text-[14px] text-[#6e6e73]">Loading catalog…</p>
            ) : catalogError ? (
              <p className="mt-6 text-[14px] text-[#bf4800]" role="alert">
                {catalogError}
              </p>
            ) : !baseProduct ? (
              <p className="mt-6 text-[14px] leading-relaxed text-[#6e6e73]">
                No catalog product matches this model. Add a product in admin with SKU{' '}
                <code className="rounded bg-black/[0.06] px-1">{modelId}</code>.
              </p>
            ) : catalogStock <= 0 ? (
              <p className="mt-6 text-[14px] text-[#bf4800]" role="alert">
                Out of stock — check back later.
              </p>
            ) : null}

            <div className="mt-6 border-t border-black/[0.08] pt-6">
              {crossedLineTotal != null ? (
                <>
                  <p className="text-[14px] text-[#6e6e73]">
                    <span className="line-through">{money.format(crossedLineTotal)}</span>
                    <span className="ml-2 text-[#1d1d1f]">{money.format(lineTotal)}</span>
                    <span className="ml-1 text-[12px]">with carrier offer</span>
                  </p>
                  {safeQuantity > 1 ? (
                    <p className="mt-1 text-[12px] text-[#86868b]">
                      {money.format(chargedPrice)} each × {safeQuantity}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <p className="text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
                    {money.format(lineTotal)}
                  </p>
                  {safeQuantity > 1 ? (
                    <p className="mt-1 text-[13px] text-[#6e6e73]">
                      {money.format(chargedPrice)} each × {safeQuantity}
                    </p>
                  ) : null}
                </>
              )}
              <p className="mt-2 text-[12px] leading-snug text-[#86868b]">{carrierPricingNote}</p>
            </div>

            <p className="mt-6 text-[12px] leading-snug text-[#86868b]">
              You’ll confirm shipping and pay on the next page. You can add more iPhones to the same
              queue before checking out.
            </p>

            {!authLoading && !user ? (
              <p className="mt-4 text-center text-[14px] text-[#6e6e73]">
                <a href="#/login" className="font-medium text-[#0066cc] hover:underline">
                  Sign in
                </a>{' '}
                or{' '}
                <a href="#/register" className="font-medium text-[#0066cc] hover:underline">
                  register
                </a>{' '}
                to buy.
              </p>
            ) : null}

            {checkoutError ? (
              <p className="mt-4 rounded-lg bg-[#fff3f0] px-3 py-2 text-[13px] text-[#bf4800]" role="alert">
                {checkoutError}
              </p>
            ) : null}

            <button
              type="button"
              disabled={
                catalogLoading ||
                !canBuy ||
                !baseProduct ||
                catalogStock <= 0 ||
                safeQuantity > catalogStock
              }
              onClick={() => goToPayment()}
              className="mt-4 w-full rounded-full bg-[#0071e3] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#0077ed] disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              Buy now
            </button>

            <a
              href={iphonePageHref(modelId)}
              className="mt-3 flex w-full items-center justify-center rounded-full border border-black/[0.12] py-3 text-[15px] font-medium text-[#0071e3] hover:bg-black/[0.03]"
            >
              View product page
            </a>
          </div>
        </aside>
      </div>
    </main>
  )
}
