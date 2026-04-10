/** Base URL: Vite dev proxy sends `/api` → Express; in production set `VITE_API_URL` if the API is on another origin. */
const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

async function parseJson(res) {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : {}
  } catch {
    return { error: text || 'Invalid response' }
  }
}

async function safeFetch(url, options = {}) {
  try {
    return await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error(
      'Cannot reach the API. Start it with npm run server (or npm run dev:full).',
    )
  }
}

export async function apiMe() {
  const res = await safeFetch(`${base}/api/auth/me`, { method: 'GET' })
  if (!res.ok) return { user: null }
  return parseJson(res)
}

export async function apiUserProfile() {
  const res = await safeFetch(`${base}/api/user/profile`, { method: 'GET' })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Could not load profile.')
  return data
}

export async function apiLogout() {
  const res = await safeFetch(`${base}/api/auth/logout`, { method: 'POST' })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Logout failed')
  return data
}

export async function apiLogin({ email, password }) {
  const res = await safeFetch(`${base}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Sign in failed')
  return data
}

export async function apiRegister({ email, password, firstName, lastName }) {
  const res = await safeFetch(`${base}/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ email, password, firstName, lastName }),
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Registration failed')
  return data
}

async function adminFetch(method, path, body) {
  const res = await safeFetch(`${base}${path}`, {
    method,
    body: body != null ? JSON.stringify(body) : undefined,
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Not authorized')
  return data
}

/** Stats + server time (super admin JWT). */
export async function apiAdminDashboard() {
  return adminFetch('GET', '/api/admin/dashboard')
}

export async function apiAdminProducts() {
  return adminFetch('GET', '/api/admin/products')
}

export async function apiAdminProductCreate(payload) {
  return adminFetch('POST', '/api/admin/products', payload)
}

export async function apiAdminProductUpdate(id, payload) {
  return adminFetch('PATCH', `/api/admin/products/${id}`, payload)
}

export async function apiAdminProductDelete(id) {
  return adminFetch('DELETE', `/api/admin/products/${id}`)
}

export async function apiAdminOrders() {
  return adminFetch('GET', '/api/admin/orders')
}

export async function apiAdminOrderDetail(id) {
  return adminFetch('GET', `/api/admin/orders/${id}`)
}

export async function apiAdminCustomers() {
  return adminFetch('GET', '/api/admin/customers')
}

export async function apiHealth() {
  const res = await fetch(`${base}/api/health`)
  return parseJson(res)
}

/** iPhone comparison specs (from CSV / `iphone_specs` table). */
export async function apiIphoneSpecs() {
  const res = await safeFetch(`${base}/api/iphone-specs`, { method: 'GET' })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Could not load iPhone specs.')
  return data
}

/** Public catalog (no auth). */
export async function apiProducts() {
  const res = await safeFetch(`${base}/api/products`, { method: 'GET' })
  const data = await parseJson(res)
  if (!res.ok) {
    const hint =
      res.status === 404
        ? ' Restart the API (npm run server) so it loads the latest routes.'
        : ''
    throw new Error((data.error || 'Unable to connect to server.') + hint)
  }
  return data
}

/** Customer checkout (requires signed-in user account, not super admin). */
export async function apiCreateOrder(payload) {
  const res = await safeFetch(`${base}/api/orders`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Could not place order.')
  return data
}

export async function apiMyOrders() {
  const res = await safeFetch(`${base}/api/orders/mine`, { method: 'GET' })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Could not load orders.')
  return data
}

export async function apiMyOrder(id) {
  const res = await safeFetch(`${base}/api/orders/mine/${id}`, { method: 'GET' })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Could not load order.')
  return data
}

export async function apiSimulatePayment(orderId) {
  const res = await safeFetch(`${base}/api/orders/${orderId}/simulate-payment`, {
    method: 'POST',
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Payment could not be completed.')
  return data
}

/** Public: whether `STRIPE_SECRET_KEY` is set on the server. */
export async function apiStripeConfig() {
  const res = await safeFetch(`${base}/api/stripe/config`, { method: 'GET' })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Could not load payment config.')
  return data
}

/**
 * Start Stripe Checkout (test mode). Opens `data.url` in the same window.
 * @param {number} orderId
 * @param {{ returnPath?: 'payment' | 'purchase' | 'orders' }} [opts]
 */
export async function apiStripeCreateCheckout(orderId, opts = {}) {
  const res = await safeFetch(`${base}/api/orders/${orderId}/stripe-checkout`, {
    method: 'POST',
    body: JSON.stringify({
      returnPath: opts.returnPath ?? 'payment',
    }),
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Could not start Stripe checkout.')
  return data
}

/** After Stripe redirect, confirm session and mark order paid. */
export async function apiStripeVerifySession(sessionId) {
  const q = encodeURIComponent(sessionId)
  const res = await safeFetch(`${base}/api/stripe/verify-session?session_id=${q}`, {
    method: 'GET',
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(data.error || 'Could not verify payment.')
  return data
}

export async function apiAdminOrderUpdateStatus(id, status) {
  return adminFetch('PATCH', `/api/admin/orders/${id}`, { status })
}
