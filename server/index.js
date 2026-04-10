import './env.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import bcrypt from 'bcryptjs'
import {
  COOKIE_NAME,
  attachUser,
  clearCookieOptions,
  cookieOptions,
  requireAuth,
  requireCustomer,
  requireSuperAdmin,
  signAdminToken,
  signUserToken,
} from './auth.js'
import {
  DB_UNAVAILABLE_MESSAGE,
  isDbConnectionError,
  pool,
  sendIfDbUnavailable,
  testConnection,
} from './db.js'
import adminRoutes from './routes/admin.js'
import { insertId } from './utils/mysql.js'
import { passwordPolicyError } from './utils/passwordPolicy.js'
import { mapIphoneSpecRow } from './utils/iphoneSpecsJson.js'
import { sanitizeOrderItemRow, sanitizeProductRowImage } from './utils/sanitizeImageUrl.js'
import { clientAppOrigin, stripe } from './stripeCheckout.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = Number(process.env.PORT) || 3001

/** Clearer API errors in development when registration fails. */
function registerErrorHint(err) {
  if (err.code === 'ECONNREFUSED') {
    return 'Cannot connect to MySQL. Start MySQL and check DB_HOST / DB_PORT in .env.'
  }
  if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ER_ACCESS_DENIED') {
    return 'MySQL access denied. Check DB_USER and DB_PASSWORD in .env.'
  }
  if (err.code === 'ER_BAD_DB_ERROR') {
    return 'Database does not exist. Create it (see server/sql/schema.sql) or set DB_NAME in .env.'
  }
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return 'Table missing. Run: mysql -u root -p < server/sql/schema.sql'
  }
  return `${err.message}${err.code ? ` [${err.code}]` : ''}`
}

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? 'superiphone@gmail.com').trim()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'iPhone2026'

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))
app.use(attachUser)

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, cookieOptions())
}

app.get('/api/health', async (_req, res) => {
  try {
    await testConnection()
    const [rows] = await pool.query('SELECT VERSION() AS version')
    res.json({
      ok: true,
      database: 'connected',
      version: rows[0]?.version ?? null,
    })
  } catch (err) {
    console.error('[health]', err.message)
    res.status(503).json({
      ok: false,
      database: 'error',
      message: isDbConnectionError(err) ? DB_UNAVAILABLE_MESSAGE : err.message,
      code: isDbConnectionError(err) ? 'DATABASE_UNAVAILABLE' : undefined,
    })
  }
})

app.get('/api/auth/me', (req, res) => {
  if (!req.user) {
<<<<<<< HEAD
    return res.status(401).json({ user: null, error: 'Not authenticated' })
=======
    return res.json({ user: null })
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
  }
  const p = req.user
  if (p.role === 'super_admin') {
    return res.json({
      user: {
        role: 'super_admin',
<<<<<<< HEAD
        id: 'super_admin',
=======
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
        username: p.username,
        displayName: p.displayName,
      },
    })
  }
  return res.json({
    user: {
<<<<<<< HEAD
      id: p.id,
=======
      id: p.sub,
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
      email: p.email,
      firstName: p.firstName,
      lastName: p.lastName,
      role: 'user',
    },
  })
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, clearCookieOptions())
  res.json({ ok: true })
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body ?? {}
    if (role != null) {
      return res.status(403).json({ error: 'Cannot register with an elevated role.' })
    }
    const fnTrim = String(firstName ?? '').trim()
    const lnTrim = String(lastName ?? '').trim()
    const emailTrim = String(email ?? '').trim()
    const pwTrim = String(password ?? '').trim()
    const missing = []
    if (!fnTrim) missing.push('First name')
    if (!lnTrim) missing.push('Last name')
    if (!emailTrim) missing.push('Email address')
    if (!pwTrim) missing.push('Password')
    if (missing.length) {
      const msg =
        missing.length === 1
          ? `Please fill in ${missing[0]}.`
          : `Please fill in: ${missing.join(', ')}.`
      return res.status(400).json({ error: msg })
    }
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)
    if (!emailLooksValid) {
      return res.status(400).json({
        error: 'Please enter a valid email address (for example, name@example.com).',
      })
    }
    const local = emailTrim.split('@')[0]?.toLowerCase() ?? ''
    const fn = fnTrim.toLowerCase()
    const ln = lnTrim.toLowerCase()
    if (local === 'superiphone' || fn === 'superiphone' || ln === 'superiphone') {
      return res.status(403).json({
        error: 'This name is reserved. Admin accounts are not created here.',
      })
    }
    const pwPolicy = passwordPolicyError(pwTrim)
    if (pwPolicy) {
      return res.status(400).json({ error: pwPolicy })
    }

    const passwordHash = bcrypt.hashSync(pwTrim, 10)
    const emailNorm = emailTrim.toLowerCase()

    const [result] = await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES (?, ?, ?, ?)`,
      [emailNorm, passwordHash, fnTrim, lnTrim],
    )

    const id = insertId(result)
    if (id == null) {
      console.error('[register] invalid insertId', result)
      return res.status(500).json({ error: 'Could not create account.' })
    }
    const token = signUserToken({
      id,
      email: emailNorm,
      firstName: fnTrim,
      lastName: lnTrim,
    })
    setAuthCookie(res, token)

    res.status(201).json({
      ok: true,
      user: {
        id,
        email: emailNorm,
        firstName: fnTrim,
        lastName: lnTrim,
        role: 'user',
      },
    })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }
    if (sendIfDbUnavailable(res, err, 'register')) return
    console.error('[register]', err.code, err.message)
    const dev = process.env.NODE_ENV !== 'production'
    const hint = dev ? registerErrorHint(err) : 'Could not create account.'
    res.status(500).json({ error: hint })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {}
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const ident = String(email).trim()
    if (ident === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser = {
        username: ADMIN_USERNAME,
        displayName: 'Super Admin',
      }
      const token = signAdminToken(adminUser)
      setAuthCookie(res, token)
      return res.json({
        ok: true,
        user: {
          role: 'super_admin',
          username: adminUser.username,
          displayName: adminUser.displayName,
        },
      })
    }

    const [rows] = await pool.execute(
      `SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ? LIMIT 1`,
      [email.trim().toLowerCase()],
    )

    const user = rows[0]
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const payload = {
      id: Number(user.id),
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    }
    const token = signUserToken(payload)
    setAuthCookie(res, token)

    res.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: 'user',
      },
    })
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'login')) return
    console.error('[login]', err)
    res.status(500).json({ error: 'Could not sign in.' })
  }
})

app.post('/api/auth/admin-login', (req, res) => {
  try {
    const { username, password } = req.body ?? {}
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' })
    }
    const okUser =
      username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD
    if (!okUser) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' })
    }

    const adminUser = {
      username: ADMIN_USERNAME,
      displayName: 'Super Admin',
    }
    const token = signAdminToken(adminUser)
    setAuthCookie(res, token)

    res.json({
      ok: true,
      user: {
        role: 'super_admin',
        username: adminUser.username,
        displayName: adminUser.displayName,
      },
    })
  } catch (err) {
    console.error('[admin-login]', err)
    res.status(500).json({ error: 'Could not sign in.' })
  }
})

/** Any signed-in user (customer or super admin). */
<<<<<<< HEAD
app.get('/api/user/profile', requireAuth, async (req, res) => {
  if (req.user.role === 'super_admin') {
    return res.json({ ok: true, user: { ...req.user, created_at: new Date().toISOString() } })
  }
  try {
    const [rows] = await pool.execute(
      `SELECT id, email, first_name, last_name, created_at FROM users WHERE id = ?`,
      [req.user.id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'User not found' })
    res.json({ ok: true, user: { 
      id: rows[0].id, 
      email: rows[0].email, 
      firstName: rows[0].first_name, 
      lastName: rows[0].last_name, 
      username: (rows[0].first_name + ' ' + rows[0].last_name).trim() || rows[0].email.split('@')[0],
      created_at: rows[0].created_at 
    }})
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'profile')) return
    res.status(500).json({ error: 'Could not fetch profile' })
  }
=======
app.get('/api/user/profile', requireAuth, (req, res) => {
  res.json({ ok: true, claims: req.user })
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
})

/** iPhone comparison CSV data (see `npm run db:import-iphone`). */
app.get('/api/iphone-specs', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM iphone_specs ORDER BY model_name ASC',
    )
    res.json({ models: rows.map(mapIphoneSpecRow) })
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.json({ models: [] })
    }
    if (isDbConnectionError(err)) {
      console.warn('[iphone-specs] Database unreachable — returning empty specs.')
      return res.json({ models: [] })
    }
    console.error('[iphone-specs]', err)
    res.status(500).json({ error: 'Could not load iPhone specs.' })
  }
})

/** Public product catalog (for the shop page). */
app.get('/api/products', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, sku, name, description, image_url, price, stock
       FROM products
       ORDER BY id DESC`,
    )
    res.json({ products: rows.map(sanitizeProductRowImage) })
  } catch (err) {
    if (isDbConnectionError(err)) {
      console.warn(
        '[products list] Database unreachable — returning empty catalog. Start MySQL or check DB_* env.',
      )
      return res.json({ products: [] })
    }
    console.error('[products list]', err)
    res.status(500).json({ error: 'Could not load products.' })
  }
})

/** Place an order (customer JWT only). */
app.post('/api/orders', requireAuth, requireCustomer, async (req, res) => {
<<<<<<< HEAD
  const userId = Number(req.user.id)
  const { items, shipping, notes } = req.body ?? {}
=======
  const userId = Number(req.user.sub)
  const { items, shipping_address: shippingAddress, notes } = req.body ?? {}
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item.' })
  }

<<<<<<< HEAD
  // Mandatory structured shipping validation
  const {
    fullName,
    phone,
    street,
    city,
    region,
    zip,
    country,
  } = shipping || {}

  const missing = []
  if (!fullName?.trim()) missing.push('Full Name')
  if (!phone?.trim()) missing.push('Phone Number')
  if (!street?.trim()) missing.push('Street Address')
  if (!city?.trim()) missing.push('City')
  if (!region?.trim()) missing.push('Region/State')
  if (!zip?.trim()) missing.push('ZIP/Postal Code')
  if (!country?.trim()) missing.push('Country')

  if (missing.length > 0) {
    return res.status(400).json({
      error: `Please provide all required shipping details: ${missing.join(', ')}.`,
    })
  }

=======
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
  const rawItems = items
  const need = new Map()
  for (const raw of rawItems) {
    const productId = Number(raw.productId ?? raw.product_id)
    const quantity = Number(raw.quantity)
    if (!Number.isInteger(productId) || productId < 1) {
      return res.status(400).json({ error: 'Invalid product id.' })
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Each quantity must be a positive integer.' })
    }
    need.set(productId, (need.get(productId) ?? 0) + quantity)
  }

  let conn
  try {
    conn = await pool.getConnection()
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'order create')) return
    console.error('[order create] getConnection', err)
    return res.status(500).json({ error: 'Could not place order.' })
  }

  try {
    await conn.beginTransaction()

    const productCache = new Map()
    const distinctIds = [...need.keys()].sort((a, b) => a - b)
    for (const productId of distinctIds) {
      const [rows] = await conn.execute(
        `SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE`,
        [productId],
      )
      const p = rows[0]
      if (!p) {
        await conn.rollback()
        return res.status(400).json({ error: `Product #${productId} was not found.` })
      }
      const qty = need.get(productId)
      if (p.stock < qty) {
        await conn.rollback()
        return res.status(409).json({
          error: `Not enough stock for “${p.name}”. Available: ${p.stock}.`,
        })
      }
      productCache.set(productId, p)
    }

    let totalAmount = 0
    const lines = []
    for (const raw of rawItems) {
      const productId = Number(raw.productId ?? raw.product_id)
      const quantity = Number(raw.quantity)
      const p = productCache.get(productId)
      const unit = Number(p.price)
      totalAmount += unit * quantity
      const itemNote =
        raw.notes != null ? String(raw.notes).trim().slice(0, 256) : ''
      lines.push({ productId, quantity, unitPrice: unit, itemNote })
    }

<<<<<<< HEAD
=======
    const ship =
      shippingAddress != null ? String(shippingAddress).trim().slice(0, 512) : ''
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
    const globalNote = notes != null ? String(notes).trim() : ''
    const lineNoteBlocks = lines
      .map((l, idx) =>
        l.itemNote
          ? `Line ${idx + 1} (${l.quantity}×): ${l.itemNote}`
          : null,
      )
      .filter(Boolean)
    const noteStr = [globalNote, lineNoteBlocks.join('\n')]
      .filter(Boolean)
      .join('\n\n')
      .slice(0, 512)

    const [orderResult] = await conn.execute(
<<<<<<< HEAD
      `INSERT INTO orders (
        user_id, status, total_amount, 
        shipping_full_name, shipping_phone, shipping_street, 
        shipping_city, shipping_region, shipping_zip, shipping_country, 
        notes
      ) VALUES (?, 'placed', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        totalAmount.toFixed(2),
        fullName.trim(),
        phone.trim(),
        street.trim(),
        city.trim(),
        region.trim(),
        zip.trim(),
        country.trim(),
=======
      `INSERT INTO orders (user_id, status, total_amount, shipping_address, notes)
       VALUES (?, 'placed', ?, ?, ?)`,
      [
        userId,
        totalAmount.toFixed(2),
        ship || null,
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
        noteStr || null,
      ],
    )
    const orderId = insertId(orderResult)
    if (orderId == null) {
      await conn.rollback()
      return res.status(500).json({ error: 'Could not create order.' })
    }

    for (const line of lines) {
      await conn.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [
          orderId,
          line.productId,
          line.quantity,
          line.unitPrice.toFixed(2),
        ],
      )
      await conn.execute(`UPDATE products SET stock = stock - ? WHERE id = ?`, [
        line.quantity,
        line.productId,
      ])
    }

    await conn.commit()
    res.status(201).json({
      ok: true,
      order: {
        id: orderId,
        total_amount: totalAmount,
        status: 'placed',
      },
    })
  } catch (err) {
    try {
      await conn.rollback()
    } catch {
      /* ignore */
    }
    if (sendIfDbUnavailable(res, err, 'order create')) return
    console.error('[order create]', err)
    res.status(500).json({ error: 'Could not place order.' })
  } finally {
    conn.release()
  }
})

/** List current customer's orders (newest first). */
app.get('/api/orders/mine', requireAuth, requireCustomer, async (req, res) => {
<<<<<<< HEAD
  const userId = Number(req.user.id)
  try {
    const [orders] = await pool.query(
      `SELECT o.id, o.status, o.total_amount, o.notes, o.created_at,
              o.shipping_full_name, o.shipping_phone, o.shipping_street,
              o.shipping_city, o.shipping_region, o.shipping_zip, o.shipping_country,
              o.shipping_address,
=======
  const userId = Number(req.user.sub)
  try {
    const [orders] = await pool.query(
      `SELECT o.id, o.status, o.total_amount, o.shipping_address, o.notes, o.created_at,
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId],
    )
<<<<<<< HEAD
    if (orders.length > 0) {
      const orderIds = orders.map(o => o.id)
      const [items] = await pool.query(
        `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price,
                p.name AS product_name, p.sku AS product_sku, p.image_url AS product_image_url
         FROM order_items oi
         INNER JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id IN (${orderIds.join(',')})
         ORDER BY oi.id ASC`
      )
      
      for (const o of orders) {
        o.items = items
          .filter(i => i.order_id === o.id)
          .map(sanitizeOrderItemRow)
      }
    }
=======
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
    res.json({ orders })
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'orders mine')) return
    console.error('[orders mine]', err)
    res.status(500).json({ error: 'Could not load orders.' })
  }
})

/** Single order for current customer (with line items). */
app.get('/api/orders/mine/:id', requireAuth, requireCustomer, async (req, res) => {
<<<<<<< HEAD
  const userId = Number(req.user.id)
=======
  const userId = Number(req.user.sub)
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid order id.' })
  }
  try {
    const [ord] = await pool.query(
<<<<<<< HEAD
      `SELECT o.id, o.user_id, o.status, o.total_amount, o.notes, o.created_at,
              o.shipping_full_name, o.shipping_phone, o.shipping_street,
              o.shipping_city, o.shipping_region, o.shipping_zip, o.shipping_country,
              o.shipping_address
=======
      `SELECT o.id, o.user_id, o.status, o.total_amount, o.shipping_address, o.notes, o.created_at
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
       FROM orders o
       WHERE o.id = ? AND o.user_id = ?`,
      [id, userId],
    )
    if (!ord.length) {
      return res.status(404).json({ error: 'Order not found.' })
    }
    const [items] = await pool.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price,
              p.name AS product_name, p.sku AS product_sku, p.image_url AS product_image_url
       FROM order_items oi
       INNER JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?
       ORDER BY oi.id ASC`,
      [id],
    )
    res.json({ order: ord[0], items: items.map(sanitizeOrderItemRow) })
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'orders mine detail')) return
    console.error('[orders mine detail]', err)
    res.status(500).json({ error: 'Could not load order.' })
  }
})

/** Whether Stripe Checkout is available (sk_test_… in env). */
app.get('/api/stripe/config', (_req, res) => {
  res.json({ stripeConfigured: Boolean(stripe) })
})

/**
 * Stripe Checkout (test mode). Redirect user to returned `url`.
 * Body: `{ returnPath?: 'payment' | 'purchase' | 'orders' }` — hash after payment (default `payment`).
 */
app.post(
  '/api/orders/:id/stripe-checkout',
  requireAuth,
  requireCustomer,
  async (req, res) => {
    if (!stripe) {
      return res.status(503).json({
        error:
          'Stripe is not configured. Add STRIPE_SECRET_KEY (sk_test_…) to your server .env and restart.',
      })
    }
<<<<<<< HEAD
    const userId = Number(req.user.id)
=======
    const userId = Number(req.user.sub)
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid order id.' })
    }
    const returnPath = String(req.body?.returnPath ?? 'payment').trim()
    const hashBase =
      returnPath === 'purchase'
        ? 'purchase'
        : returnPath === 'orders'
          ? 'orders'
          : 'payment'
    const base = clientAppOrigin()
    const successUrl = `${base}/#/${hashBase}?stripe=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${base}/#/${hashBase}?stripe=cancel`

    let conn
    try {
      conn = await pool.getConnection()
    } catch (err) {
      if (sendIfDbUnavailable(res, err, 'stripe checkout')) return
      console.error('[stripe checkout] getConnection', err)
      return res.status(500).json({ error: 'Could not start checkout.' })
    }
    try {
      await conn.beginTransaction()
      const [rows] = await conn.execute(
        `SELECT id, user_id, status, total_amount FROM orders WHERE id = ? FOR UPDATE`,
        [id],
      )
      const row = rows[0]
      if (!row) {
        await conn.rollback()
        return res.status(404).json({ error: 'Order not found.' })
      }
      if (Number(row.user_id) !== userId) {
        await conn.rollback()
        return res.status(403).json({ error: 'Forbidden.' })
      }
      if (row.status !== 'placed') {
        await conn.rollback()
        return res.status(409).json({
          error:
            row.status === 'paid'
              ? 'This order is already paid.'
              : 'Checkout is only available for orders awaiting payment.',
        })
      }
      const amountCents = Math.round(Number(row.total_amount) * 100)
      if (!Number.isFinite(amountCents) || amountCents < 50) {
        await conn.rollback()
        return res.status(400).json({
          error:
            'Order total must be at least $0.50 USD for Stripe test checkout (minimum charge).',
        })
      }
      await conn.commit()

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        client_reference_id: String(id),
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Order ${id}`,
                description: 'Test mode — use card 4242 4242 4242 4242, any future expiry, any CVC.',
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          orderId: String(id),
          userId: String(userId),
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      })

      if (!session.url) {
        return res.status(500).json({ error: 'Stripe did not return a checkout URL.' })
      }
      res.json({ url: session.url, sessionId: session.id })
    } catch (err) {
      try {
        await conn.rollback()
      } catch {
        /* ignore */
      }
      if (sendIfDbUnavailable(res, err, 'stripe checkout')) return
      console.error('[stripe checkout]', err)
      res.status(500).json({ error: err.message || 'Could not start Stripe checkout.' })
    } finally {
      if (conn) conn.release()
    }
  },
)

/**
 * After redirect from Stripe Checkout, confirm payment and mark order paid (test mode, no webhooks).
 */
app.get('/api/stripe/verify-session', requireAuth, requireCustomer, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured.' })
  }
  const sessionId = req.query.session_id != null ? String(req.query.session_id).trim() : ''
  if (!sessionId || !sessionId.startsWith('cs_')) {
    return res.status(400).json({ error: 'Missing or invalid session_id.' })
  }
<<<<<<< HEAD
  const userId = Number(req.user.id)
=======
  const userId = Number(req.user.sub)
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
  let conn
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const metaOrder = session.metadata?.orderId
    const metaUser = session.metadata?.userId
    if (!metaOrder || String(metaUser) !== String(userId)) {
      return res.status(403).json({ error: 'This checkout session does not belong to your account.' })
    }
    const orderId = Number(metaOrder)
    if (!Number.isInteger(orderId) || orderId < 1) {
      return res.status(400).json({ error: 'Invalid order in session.' })
    }
    if (session.payment_status !== 'paid') {
      return res.json({
        ok: false,
        payment_status: session.payment_status ?? 'unknown',
      })
    }

    try {
      conn = await pool.getConnection()
    } catch (err) {
      if (sendIfDbUnavailable(res, err, 'stripe verify')) return
      console.error('[stripe verify] getConnection', err)
      return res.status(500).json({ error: 'Could not verify payment.' })
    }
    try {
      await conn.beginTransaction()
      const [rows] = await conn.execute(
        `SELECT id, user_id, status, total_amount FROM orders WHERE id = ? FOR UPDATE`,
        [orderId],
      )
      const row = rows[0]
      if (!row) {
        await conn.rollback()
        return res.status(404).json({ error: 'Order not found.' })
      }
      if (Number(row.user_id) !== userId) {
        await conn.rollback()
        return res.status(403).json({ error: 'Forbidden.' })
      }
      if (row.status === 'paid') {
        await conn.commit()
        return res.json({
          ok: true,
          order: {
            id: orderId,
            status: 'paid',
            total_amount: Number(row.total_amount),
          },
        })
      }
      if (row.status !== 'placed') {
        await conn.rollback()
        return res.status(409).json({ error: 'Order cannot be marked paid from this state.' })
      }
      await conn.execute(`UPDATE orders SET status = 'paid' WHERE id = ?`, [orderId])
      await conn.commit()
      res.json({
        ok: true,
        order: {
          id: orderId,
          status: 'paid',
          total_amount: Number(row.total_amount),
        },
      })
    } catch (err) {
      try {
        await conn.rollback()
      } catch {
        /* ignore */
      }
      if (sendIfDbUnavailable(res, err, 'stripe verify')) return
      console.error('[stripe verify]', err)
      res.status(500).json({ error: 'Could not verify payment.' })
    } finally {
      if (conn) conn.release()
    }
  } catch (err) {
    console.error('[stripe verify] stripe.retrieve', err)
    res.status(500).json({ error: err.message || 'Could not load Stripe session.' })
  }
})

/** Marks order paid without a PSP — no card processing. Only when status is `placed`. */
app.post(
  '/api/orders/:id/simulate-payment',
  requireAuth,
  requireCustomer,
  async (req, res) => {
<<<<<<< HEAD
    const userId = Number(req.user.id)
=======
    const userId = Number(req.user.sub)
>>>>>>> 49ddc41528d7468f4a00b71b2a8f486afec365c7
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid order id.' })
    }
    let conn
    try {
      conn = await pool.getConnection()
    } catch (err) {
      if (sendIfDbUnavailable(res, err, 'simulate payment')) return
      console.error('[simulate payment] getConnection', err)
      return res.status(500).json({ error: 'Could not process payment.' })
    }
    try {
      await conn.beginTransaction()
      const [rows] = await conn.execute(
        `SELECT id, user_id, status FROM orders WHERE id = ? FOR UPDATE`,
        [id],
      )
      const row = rows[0]
      if (!row) {
        await conn.rollback()
        return res.status(404).json({ error: 'Order not found.' })
      }
      if (Number(row.user_id) !== userId) {
        await conn.rollback()
        return res.status(403).json({ error: 'Forbidden.' })
      }
      if (row.status !== 'placed') {
        await conn.rollback()
        return res.status(409).json({
          error:
            row.status === 'paid'
              ? 'This order is already paid.'
              : 'Payment is only available for orders awaiting payment.',
        })
      }
      await conn.execute(`UPDATE orders SET status = 'paid' WHERE id = ?`, [id])
      await conn.commit()
      res.json({ ok: true, order: { id, status: 'paid' } })
    } catch (err) {
      try {
        await conn.rollback()
      } catch {
        /* ignore */
      }
      if (sendIfDbUnavailable(res, err, 'simulate payment')) return
      console.error('[simulate payment]', err)
      res.status(500).json({ error: 'Could not process payment.' })
    } finally {
      conn.release()
    }
  },
)

app.use('/api/admin', requireAuth, requireSuperAdmin, adminRoutes)

/** Unmatched `/api/*` (e.g. typo). Real routes are registered above — restart the server after code changes. */
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

const distDir = path.join(__dirname, '../client/dist')
const distIndex = path.join(distDir, 'index.html')
if (fs.existsSync(distIndex)) {
  app.use(express.static(distDir))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(distIndex)
  })
}

app.listen(PORT, () => {
  console.log(`API listening on http://127.0.0.1:${PORT}`)
  if (fs.existsSync(distIndex)) {
    console.log(`Web app: http://127.0.0.1:${PORT}/ (run npm run build if assets are missing)`)
  }
})
