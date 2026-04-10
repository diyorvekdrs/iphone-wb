import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import {
  apiAdminCustomers,
  apiAdminDashboard,
  apiAdminOrderDetail,
  apiAdminOrderUpdateStatus,
  apiAdminOrders,
  apiAdminProductCreate,
  apiAdminProductDelete,
  apiAdminProductUpdate,
  apiAdminProducts,
  apiIphoneSpecs,
} from '../../api/client.js'
import {
  sanitizeProductImageUrl,
  sanitizeProductImageUrlForSave,
} from '../../utils/sanitizeImageUrl.js'
import { useAuth } from '../../hooks/useAuth.js'
import { isAdminNewPurchaseStatus, ORDER_FLOW_STEPS } from '../../utils/orderFlow.js'


const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'products', label: 'Products' },
  { id: 'purchases', label: 'Purchases' },
  { id: 'customers', label: 'Customers' },
]

const inputCls =
  'mt-1 w-full rounded-lg border border-black/[0.12] px-3 py-2 text-[14px] outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]'

const money = (n) =>
  typeof n === 'number' || typeof n === 'string'
    ? Number(n).toLocaleString(undefined, { style: 'currency', currency: 'USD' })
    : '—'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')

  const [stats, setStats] = useState(null)
  const [statsErr, setStatsErr] = useState('')

  const [products, setProducts] = useState([])
  const [productsErr, setProductsErr] = useState('')
  const [productForm, setProductForm] = useState({
    sku: '',
    name: '',
    description: '',
    image_url: '',
    storage_gb: '',
    color: '',
    price: '',
    stock: '0',
  })
  const [editingProductId, setEditingProductId] = useState(null)

  const [iphoneSpecRows, setIphoneSpecRows] = useState([])
  const [iphoneSpecsErr, setIphoneSpecsErr] = useState('')
  const [expandedSpecSlug, setExpandedSpecSlug] = useState(null)

  const [orders, setOrders] = useState([])
  const [ordersErr, setOrdersErr] = useState('')
  const [orderDetail, setOrderDetail] = useState(null)
  const [orderDetailErr, setOrderDetailErr] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [orderStatusDraft, setOrderStatusDraft] = useState('placed')

  const [customers, setCustomers] = useState([])
  const [customersErr, setCustomersErr] = useState('')

  const newPurchaseOrders = useMemo(
    () => orders.filter((o) => isAdminNewPurchaseStatus(o.status)),
    [orders],
  )
  const allPurchaseOrders = useMemo(
    () => orders.filter((o) => !isAdminNewPurchaseStatus(o.status)),
    [orders],
  )

  const loadOverview = useCallback(async () => {
    setStatsErr('')
    try {
      const d = await apiAdminDashboard()
      setStats(d.stats)
    } catch (e) {
      setStatsErr(e.message || 'Failed to load')
    }
  }, [])

  const loadProducts = useCallback(async () => {
    setProductsErr('')
    try {
      const d = await apiAdminProducts()
      setProducts(d.products ?? [])
    } catch (e) {
      setProductsErr(e.message || 'Failed to load')
    }
  }, [])

  const loadIphoneSpecs = useCallback(async () => {
    setIphoneSpecsErr('')
    try {
      const d = await apiIphoneSpecs()
      setIphoneSpecRows(d.models ?? [])
    } catch (e) {
      setIphoneSpecsErr(e.message || 'Failed to load iPhone models')
      setIphoneSpecRows([])
    }
  }, [])

  const loadOrders = useCallback(async () => {
    setOrdersErr('')
    try {
      const d = await apiAdminOrders()
      setOrders(d.orders ?? [])
    } catch (e) {
      setOrdersErr(e.message || 'Failed to load')
    }
  }, [])

  const loadCustomers = useCallback(async () => {
    setCustomersErr('')
    try {
      const d = await apiAdminCustomers()
      setCustomers(d.customers ?? [])
    } catch (e) {
      setCustomersErr(e.message || 'Failed to load')
    }
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (tab === 'overview') void loadOverview()
      if (tab === 'products') {
        void loadProducts()
        void loadIphoneSpecs()
      }
      if (tab === 'purchases') void loadOrders()
      if (tab === 'customers') void loadCustomers()
    }, 0)
    return () => window.clearTimeout(t)
  }, [tab, loadOverview, loadProducts, loadIphoneSpecs, loadOrders, loadCustomers])

  useEffect(() => {
    void loadOrders()
  }, [loadOrders])

  const resetProductForm = () => {
    setProductForm({
      sku: '',
      name: '',
      description: '',
      image_url: '',
      storage_gb: '',
      color: '',
      price: '',
      stock: '0',
    })
    setEditingProductId(null)
  }

  const startEdit = (p) => {
    setEditingProductId(p.id)
    setProductForm({
      sku: p.sku ?? '',
      name: p.name ?? '',
      description: p.description ?? '',
      image_url: sanitizeProductImageUrlForSave(p.image_url) ?? '',
      storage_gb: p.storage_gb != null ? String(p.storage_gb) : '',
      color: p.color ?? '',
      price: String(p.price ?? ''),
      stock: String(p.stock ?? '0'),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitProduct = async (e) => {
    e.preventDefault()
    const payload = {
      sku: productForm.sku.trim(),
      name: productForm.name.trim(),
      description: productForm.description.trim() || null,
      image_url: sanitizeProductImageUrlForSave(productForm.image_url),
      storage_gb: productForm.storage_gb.trim() ? Number(productForm.storage_gb) : null,
      color: productForm.color.trim() || null,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
    }
    if (editingProductId) {
      await apiAdminProductUpdate(editingProductId, payload)
    } else {
      await apiAdminProductCreate(payload)
    }
    resetProductForm()
    await loadProducts()
  }

  const removeProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await apiAdminProductDelete(id)
      if (editingProductId === id) resetProductForm()
      await loadProducts()
    } catch (err) {
      window.alert(err.message || 'Could not delete')
    }
  }

  const toggleOrder = async (id) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null)
      setOrderDetail(null)
      return
    }
    setExpandedOrderId(id)
    setOrderDetailErr('')
    setOrderDetail(null)
    try {
      const d = await apiAdminOrderDetail(id)
      setOrderDetail(d)
      const s = d.order?.status
      if (s) {
        setOrderStatusDraft(s === 'completed' ? 'delivered' : s)
      }
    } catch (e) {
      setOrderDetailErr(e.message || 'Failed')
    }
  }

  const purchaseOrderRowGroup = (o) => (
    <Fragment key={o.id}>
      <tr
        className="cursor-pointer border-t border-black/[0.06] hover:bg-[#fafafa]"
        onClick={() => void toggleOrder(o.id)}
      >
        <td className="px-4 py-3 font-medium">
          <span className="inline-flex items-center gap-2">
            {isAdminNewPurchaseStatus(o.status) ? (
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#0071e3]"
                title="New — update status to move to All purchases"
                aria-hidden
              />
            ) : null}
            #{o.id}
          </span>
        </td>
        <td className="px-4 py-3 text-[#6e6e73]">
          {o.created_at ? new Date(o.created_at).toLocaleString() : '—'}
        </td>
        <td className="px-4 py-3">
          {o.customer_first_name} {o.customer_last_name}
        </td>
        <td className="max-w-[180px] truncate px-4 py-3 text-[#6e6e73]">{o.customer_email}</td>
        <td className="px-4 py-3 tabular-nums">{money(o.total_amount)}</td>
        <td className="px-4 py-3 capitalize">{o.status}</td>
      </tr>
      {expandedOrderId === o.id && (
        <tr className="bg-[#fafafa]">
          <td colSpan={6} className="px-4 py-4">
            {orderDetailErr ? (
              <p className="text-[13px] text-[#bf4800]">{orderDetailErr}</p>
            ) : !orderDetail || orderDetail.order?.id !== o.id ? (
              <p className="text-[13px] text-[#6e6e73]">Loading…</p>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-baseline gap-3 border-b border-black/[0.06] pb-4">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                    Fulfillment status
                  </span>
                  <select
                    value={orderStatusDraft}
                    onChange={(e) => setOrderStatusDraft(e.target.value)}
                    className="rounded-lg border border-black/[0.12] px-3 py-2 text-[13px] outline-none focus:border-[#0071e3]"
                  >
                    {ORDER_FLOW_STEPS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-neutral-800"
                    onClick={async (e) => {
                      e.stopPropagation()
                      try {
                        await apiAdminOrderUpdateStatus(o.id, orderStatusDraft)
                        await loadOrders()
                        const d = await apiAdminOrderDetail(o.id)
                        setOrderDetail(d)
                      } catch (err) {
                        window.alert(err.message || 'Could not update')
                      }
                    }}
                  >
                    Save
                  </button>
                </div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                  Shipping Details
                </p>
                <div className="text-[14px]">
                  {orderDetail.order.shipping_full_name ? (
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[#1d1d1f]">{orderDetail.order.shipping_full_name}</p>
                      <p>{orderDetail.order.shipping_street}</p>
                      <p>{orderDetail.order.shipping_city}, {orderDetail.order.shipping_region} {orderDetail.order.shipping_zip}</p>
                      <p>{orderDetail.order.shipping_country}</p>
                      <p className="mt-1 text-[12px] text-[#6e6e73]">Phone: {orderDetail.order.shipping_phone}</p>
                    </div>
                  ) : (
                    <p>{orderDetail.order.shipping_address || '—'}</p>
                  )}
                </div>
                {orderDetail.order.notes ? (
                  <p className="text-[14px] text-[#6e6e73]">{orderDetail.order.notes}</p>
                ) : null}
                <p className="pt-2 text-[12px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                  Line items
                </p>
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-left text-[11px] text-[#6e6e73]">
                      <th className="py-1">Product</th>
                      <th className="py-1">SKU</th>
                      <th className="py-1">Qty</th>
                      <th className="py-1">Unit</th>
                      <th className="py-1">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(orderDetail.items ?? []).map((line) => (
                      <tr key={line.id}>
                        <td className="py-1.5 pr-2">{line.product_name}</td>
                        <td className="py-1.5 font-mono text-[12px] text-[#6e6e73]">
                          {line.product_sku}
                        </td>
                        <td className="py-1.5 tabular-nums">{line.quantity}</td>
                        <td className="py-1.5 tabular-nums">{money(line.unit_price)}</td>
                        <td className="py-1.5 tabular-nums">
                          {money(Number(line.quantity) * Number(line.unit_price))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </td>
        </tr>
      )}
    </Fragment>
  )

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-11 text-[#1d1d1f]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="flex flex-col gap-2 border-b border-black/[0.08] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight md:text-[36px]">
              Dashboard
            </h1>
            <p className="mt-1 text-[14px] text-[#6e6e73]">
              Signed in as{' '}
              <span className="font-medium text-[#1d1d1f]">
                {user?.displayName ?? user?.username}
              </span>
              . Manage products, review purchases and customers.
            </p>
          </div>
          <a href="#/" className="text-[14px] text-[#0066cc] hover:underline">
            ← Store
          </a>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-black/[0.06] pb-4">
          {tabs.map((t) => {
            const newCount = t.id === 'purchases' ? newPurchaseOrders.length : 0
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={[
                  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors',
                  tab === t.id
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-white text-[#1d1d1f] shadow-sm ring-1 ring-black/[0.08] hover:bg-neutral-100',
                ].join(' ')}
              >
                <span>{t.label}</span>
                {newCount > 0 ? (
                  <span
                    className={[
                      'inline-flex min-w-[1.25rem] justify-center rounded-full px-1 text-[10px] font-bold tabular-nums',
                      tab === t.id ? 'bg-white/20 text-white' : 'bg-[#0071e3] text-white',
                    ].join(' ')}
                  >
                    {newCount > 99 ? '99+' : newCount}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          {tab === 'overview' && (
            <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
              <h2 className="text-[18px] font-semibold">Overview</h2>
              {statsErr ? (
                <p className="mt-4 text-[14px] text-[#bf4800]">{statsErr}</p>
              ) : !stats ? (
                <p className="mt-4 text-[14px] text-[#6e6e73]">Loading…</p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Products', value: stats.productCount },
                    { label: 'Orders', value: stats.orderCount },
                    { label: 'Customers', value: stats.userCount },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="rounded-xl border border-black/[0.06] bg-[#f5f5f7] px-5 py-4"
                    >
                      <p className="text-[12px] font-medium uppercase tracking-wide text-[#6e6e73]">
                        {c.label}
                      </p>
                      <p className="mt-1 text-[28px] font-semibold tabular-nums">{c.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === 'products' && (
            <section className="space-y-8">
              <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
                <h2 className="text-[18px] font-semibold">
                  {editingProductId ? 'Edit product' : 'Add product'}
                </h2>
                <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={submitProduct}>
                  <label className="block text-[12px] font-medium">
                    SKU *
                    <input
                      className={inputCls}
                      value={productForm.sku}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, sku: e.target.value }))
                      }
                      required
                    />
                  </label>
                  <label className="block text-[12px] font-medium">
                    Name *
                    <input
                      className={inputCls}
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, name: e.target.value }))
                      }
                      required
                    />
                  </label>
                  <label className="block text-[12px] font-medium sm:col-span-2">
                    Description
                    <textarea
                      className={`${inputCls} min-h-[80px]`}
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />
                  </label>
                  <label className="block text-[12px] font-medium sm:col-span-2">
                    Image URL
                    <input
                      className={inputCls}
                      value={productForm.image_url}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, image_url: e.target.value }))
                      }
                      placeholder="/iphone-models/first-card.png"
                    />
                  </label>
                  <label className="block text-[12px] font-medium">
                    Storage (GB)
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className={inputCls}
                      value={productForm.storage_gb}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, storage_gb: e.target.value }))
                      }
                      placeholder="256"
                    />
                  </label>
                  <label className="block text-[12px] font-medium">
                    Color
                    <input
                      className={inputCls}
                      value={productForm.color}
                      onChange={(e) => setProductForm((f) => ({ ...f, color: e.target.value }))}
                      placeholder="Natural Titanium"
                    />
                  </label>
                  <label className="block text-[12px] font-medium">
                    Price (USD) *
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={inputCls}
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, price: e.target.value }))
                      }
                      required
                    />
                  </label>
                  <label className="block text-[12px] font-medium">
                    Stock
                    <input
                      type="number"
                      min="0"
                      className={inputCls}
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, stock: e.target.value }))
                      }
                    />
                  </label>
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <button
                      type="submit"
                      className="rounded-full bg-[#0071e3] px-6 py-2.5 text-[14px] font-medium text-white hover:bg-[#0077ed]"
                    >
                      {editingProductId ? 'Save changes' : 'Create product'}
                    </button>
                    {editingProductId ? (
                      <button
                        type="button"
                        className="rounded-full bg-neutral-200 px-6 py-2.5 text-[14px] font-medium text-[#1d1d1f] hover:bg-neutral-300"
                        onClick={resetProductForm}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </form>
              </div>

              <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
                <div className="border-b border-black/[0.06] px-6 py-4">
                  <h2 className="text-[18px] font-semibold">All products</h2>
                  {productsErr ? (
                    <p className="mt-2 text-[13px] text-[#bf4800]">{productsErr}</p>
                  ) : null}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-[13px]">
                    <thead className="bg-[#f5f5f7] text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                      <tr>
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Storage</th>
                        <th className="px-4 py-3">Color</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-t border-black/[0.06]">
                          <td className="px-4 py-3 font-mono text-[12px]">{p.sku}</td>
                          <td className="max-w-[200px] truncate px-4 py-3">{p.name}</td>
                          <td className="px-4 py-3 tabular-nums text-[#424245]">
                            {p.storage_gb != null ? `${p.storage_gb}GB` : '—'}
                          </td>
                          <td className="max-w-[160px] truncate px-4 py-3 text-[#424245]">
                            {p.color || '—'}
                          </td>
                          <td className="px-4 py-3 tabular-nums">{money(p.price)}</td>
                          <td className="px-4 py-3 tabular-nums">{p.stock}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              className="text-[#0066cc] hover:underline"
                              onClick={() => startEdit(p)}
                            >
                              Edit
                            </button>
                            <span className="mx-2 text-[#d2d2d7]">|</span>
                            <button
                              type="button"
                              className="text-[#bf4800] hover:underline"
                              onClick={() => void removeProduct(p.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && !productsErr ? (
                    <p className="px-6 py-8 text-center text-[14px] text-[#6e6e73]">
                      No products yet. Add one above.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
                <div className="border-b border-black/[0.06] px-6 py-4">
                  <h2 className="text-[18px] font-semibold">Models</h2>
                  <p className="mt-1 max-w-3xl text-[13px] leading-snug text-[#6e6e73]">
                    iPhone comparison specs from the <code className="rounded bg-black/[0.06] px-1.5 py-0.5 text-[12px]">iphone_specs</code> table (used on the site compare flow). Re-import from CSV with{' '}
                    <code className="rounded bg-black/[0.06] px-1.5 py-0.5 text-[12px]">
                      npm run db:import-iphone
                    </code>
                    .
                  </p>
                  {iphoneSpecsErr ? (
                    <p className="mt-2 text-[13px] text-[#bf4800]">{iphoneSpecsErr}</p>
                  ) : null}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-[13px]">
                    <thead className="bg-[#f5f5f7] text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                      <tr>
                        <th className="w-8 px-2 py-3" aria-label="Expand" />
                        <th className="px-4 py-3">Slug</th>
                        <th className="px-4 py-3">Model</th>
                        <th className="px-4 py-3">Screen</th>
                        <th className="px-4 py-3">Chip</th>
                        <th className="px-4 py-3">Battery (video)</th>
                        <th className="px-4 py-3">Water</th>
                        <th className="px-4 py-3">Frame</th>
                      </tr>
                    </thead>
                    <tbody>
                      {iphoneSpecRows.map((m) => (
                        <Fragment key={m.slug}>
                          <tr
                            className="cursor-pointer border-t border-black/[0.06] hover:bg-[#fafafa]"
                            onClick={() =>
                              setExpandedSpecSlug((s) => (s === m.slug ? null : m.slug))
                            }
                          >
                            <td className="px-2 py-3 text-center text-[#6e6e73]">
                              {expandedSpecSlug === m.slug ? '▼' : '▶'}
                            </td>
                            <td className="px-4 py-3 font-mono text-[12px]">{m.slug}</td>
                            <td className="max-w-[220px] px-4 py-3 font-medium">{m.modelName}</td>
                            <td className="px-4 py-3 text-[#424245]">{m.screenSize ?? '—'}</td>
                            <td className="max-w-[180px] truncate px-4 py-3 text-[#424245]">
                              {m.chip ?? '—'}
                            </td>
                            <td className="px-4 py-3 text-[#424245]">
                              {m.batteryVideoHours ?? '—'}
                            </td>
                            <td className="max-w-[160px] truncate px-4 py-3 text-[#424245]">
                              {m.waterResistance ?? '—'}
                            </td>
                            <td className="max-w-[140px] truncate px-4 py-3 text-[#424245]">
                              {m.frameMaterial ?? '—'}
                            </td>
                          </tr>
                          {expandedSpecSlug === m.slug ? (
                            <tr className="bg-[#fafafa]">
                              <td colSpan={8} className="px-4 py-4">
                                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                                  {[
                                    ['ProMotion', m.proMotion],
                                    ['Dynamic Island', m.dynamicIsland],
                                    ['Action Button', m.actionButton],
                                    ['Camera Control', m.cameraControl],
                                    ['Always-on display', m.alwaysOnDisplay],
                                    ['Neural Engine', m.neuralEngine],
                                    ['GPU', m.gpu],
                                    ['Front camera', m.frontCamera],
                                    ['Colors', m.colorsAvailable],
                                  ].map(([label, val]) => (
                                    <div key={label}>
                                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                                        {label}
                                      </dt>
                                      <dd className="mt-0.5 text-[14px] text-[#1d1d1f]">
                                        {val != null && String(val).trim() !== '' ? val : '—'}
                                      </dd>
                                    </div>
                                  ))}
                                </dl>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                  {iphoneSpecRows.length === 0 && !iphoneSpecsErr ? (
                    <p className="px-6 py-10 text-center text-[14px] text-[#6e6e73]">
                      No model rows yet. Import specs with{' '}
                      <code className="rounded bg-black/[0.06] px-1.5 py-0.5 text-[13px]">
                        npm run db:import-iphone
                      </code>
                      .
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          )}

          {tab === 'purchases' && (
            <div className="space-y-8">
              <section className="rounded-2xl border border-black/[0.06] bg-white shadow-sm">
                <div className="border-b border-black/[0.06] px-6 py-4">
                  <h2 className="text-[18px] font-semibold">Purchases</h2>
                  {!ordersErr ? (
                    <p className="mt-3 text-[26px] font-semibold tabular-nums tracking-tight text-[#1d1d1f] md:text-[32px]">
                      {newPurchaseOrders.length}
                      <span className="ml-2 text-[15px] font-normal text-[#6e6e73] md:text-[17px]">
                        new purchase{newPurchaseOrders.length !== 1 ? 's' : ''}
                      </span>
                    </p>
                  ) : null}
                  <p className="mt-2 max-w-3xl text-[13px] leading-snug text-[#6e6e73]">
                    <strong className="font-medium text-[#424245]">New purchases</strong> lists orders
                    that are still <strong className="font-medium text-[#424245]">Placed</strong> or{' '}
                    <strong className="font-medium text-[#424245]">Paid</strong>. When you save a later
                    status (for example <strong className="font-medium text-[#424245]">Processing</strong>
                    ), the order moves to <strong className="font-medium text-[#424245]">All purchases</strong>.
                  </p>
                  {ordersErr ? (
                    <p className="mt-2 text-[13px] text-[#bf4800]">{ordersErr}</p>
                  ) : null}
                </div>

                <div className="px-6 pb-6 pt-5">
                  <h3 className="text-[15px] font-semibold text-[#1d1d1f]">New purchases</h3>
                  <p className="mt-0.5 text-[12px] text-[#6e6e73]">
                    Expand a row for line items and to change fulfillment status.
                  </p>
                  <div className="mt-3 overflow-x-auto rounded-xl border border-black/[0.08]">
                    <table className="w-full min-w-[720px] text-left text-[13px]">
                      <thead className="bg-[#f5f5f7] text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                        <tr>
                          <th className="px-4 py-3">Order</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>{newPurchaseOrders.map(purchaseOrderRowGroup)}</tbody>
                    </table>
                  </div>
                  {!ordersErr && newPurchaseOrders.length === 0 ? (
                    <p className="mt-4 text-center text-[14px] text-[#6e6e73]">
                      {orders.length === 0
                        ? 'No orders yet. They appear when customers complete checkout.'
                        : 'No new purchases — every order is already in fulfillment (see All purchases).'}
                    </p>
                  ) : null}
                </div>

                <div className="border-t border-black/[0.06] px-6 pb-6 pt-5">
                  <h3 className="text-[15px] font-semibold text-[#1d1d1f]">All purchases</h3>
                  <p className="mt-0.5 text-[12px] text-[#6e6e73]">
                    Orders at Processing, Shipped, or Delivered — same actions as above.
                  </p>
                  <div className="mt-3 overflow-x-auto rounded-xl border border-black/[0.08]">
                    <table className="w-full min-w-[720px] text-left text-[13px]">
                      <thead className="bg-[#f5f5f7] text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                        <tr>
                          <th className="px-4 py-3">Order</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>{allPurchaseOrders.map(purchaseOrderRowGroup)}</tbody>
                    </table>
                  </div>
                  {!ordersErr && allPurchaseOrders.length === 0 && orders.length > 0 ? (
                    <p className="mt-4 text-center text-[14px] text-[#6e6e73]">
                      Nothing here yet. Advance a status from the New purchases table (for example to
                      Processing) and the order will appear in this list.
                    </p>
                  ) : null}
                </div>
              </section>
            </div>
          )}

          {tab === 'customers' && (
            <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
              <div className="border-b border-black/[0.06] px-6 py-4">
                <h2 className="text-[18px] font-semibold">Customers</h2>
                <p className="mt-1 text-[13px] text-[#6e6e73]">
                  Registered accounts (from sign up) with order history.
                </p>
                {customersErr ? (
                  <p className="mt-2 text-[13px] text-[#bf4800]">{customersErr}</p>
                ) : null}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <thead className="bg-[#f5f5f7] text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Joined</th>
                      <th className="px-4 py-3">Orders</th>
                      <th className="px-4 py-3">Total spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-t border-black/[0.06]">
                        <td className="px-4 py-3">
                          {c.first_name} {c.last_name}
                        </td>
                        <td className="max-w-[220px] truncate px-4 py-3">{c.email}</td>
                        <td className="px-4 py-3 text-[#6e6e73]">
                          {c.created_at
                            ? new Date(c.created_at).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-4 py-3 tabular-nums">{c.order_count}</td>
                        <td className="px-4 py-3 tabular-nums">{money(c.total_spent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {customers.length === 0 && !customersErr ? (
                  <p className="px-6 py-10 text-center text-[14px] text-[#6e6e73]">
                    No customers yet.
                  </p>
                ) : null}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
