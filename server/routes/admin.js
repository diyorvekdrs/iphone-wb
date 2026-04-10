import { Router } from 'express'
import { pool, sendIfDbUnavailable } from '../db.js'
import { isValidOrderStatus, ORDER_STATUSES } from '../orderStatuses.js'
import { insertId } from '../utils/mysql.js'
import {
  sanitizeProductRowImage,
  stripDisallowedProductImageUrl,
} from '../utils/sanitizeImageUrl.js'

const router = Router()

router.get('/dashboard', async (_req, res) => {
  try {
    const [[{ c: productCount }]] = await pool.query(
      'SELECT COUNT(*) AS c FROM products',
    )
    const [[{ c: orderCount }]] = await pool.query(
      'SELECT COUNT(*) AS c FROM orders',
    )
    const [[{ c: userCount }]] = await pool.query(
      'SELECT COUNT(*) AS c FROM users',
    )
    res.json({
      ok: true,
      stats: {
        productCount: Number(productCount),
        orderCount: Number(orderCount),
        userCount: Number(userCount),
      },
      serverTime: new Date().toISOString(),
    })
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'admin dashboard')) return
    console.error('[admin dashboard]', err)
    res.status(500).json({ error: 'Could not load dashboard.' })
  }
})

router.get('/products', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, sku, name, description, image_url, storage_gb, color, price, stock, created_at, updated_at FROM products ORDER BY id DESC',
    )
    res.json({ products: rows.map(sanitizeProductRowImage) })
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'admin products list')) return
    console.error('[admin products list]', err)
    res.status(500).json({ error: 'Could not load products.' })
  }
})

router.post('/products', async (req, res) => {
  try {
    const { sku, name, description, image_url, storage_gb, color, price, stock } = req.body ?? {}
    if (!sku || !name || price == null) {
      return res.status(400).json({ error: 'sku, name, and price are required.' })
    }
    const storage =
      storage_gb === undefined || storage_gb === null || storage_gb === ''
        ? null
        : Number(storage_gb)
    if (storage != null && (!Number.isInteger(storage) || storage < 1)) {
      return res.status(400).json({ error: 'storage_gb must be a positive integer.' })
    }
    const colorStr =
      color === undefined || color === null || String(color).trim() === ''
        ? null
        : String(color).trim().slice(0, 64)
    const [result] = await pool.execute(
      `INSERT INTO products (sku, name, description, image_url, storage_gb, color, price, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(sku).trim(),
        String(name).trim(),
        description ? String(description) : null,
        stripDisallowedProductImageUrl(image_url ? String(image_url).trim() : null),
        storage,
        colorStr,
        Number(price),
        stock != null ? Number(stock) : 0,
      ],
    )
    const newId = insertId(result)
    if (newId == null) {
      return res.status(500).json({ error: 'Could not create product.' })
    }
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [newId])
    res.status(201).json({ product: rows[0] })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'SKU already exists.' })
    }
    if (sendIfDbUnavailable(res, err, 'admin product create')) return
    console.error('[admin product create]', err)
    res.status(500).json({ error: 'Could not create product.' })
  }
})

router.patch('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid product id.' })
    }
    const body = req.body ?? {}
    const [existing] = await pool.execute('SELECT id FROM products WHERE id = ?', [
      id,
    ])
    if (!existing.length) return res.status(404).json({ error: 'Not found.' })

    const fields = []
    const vals = []
    if (body.sku !== undefined) {
      fields.push('sku = ?')
      vals.push(String(body.sku).trim())
    }
    if (body.name !== undefined) {
      fields.push('name = ?')
      vals.push(String(body.name).trim())
    }
    if (body.description !== undefined) {
      fields.push('description = ?')
      vals.push(body.description ? String(body.description) : null)
    }
    if (body.image_url !== undefined) {
      fields.push('image_url = ?')
      vals.push(
        stripDisallowedProductImageUrl(body.image_url ? String(body.image_url).trim() : null),
      )
    }
    if (body.storage_gb !== undefined) {
      if (body.storage_gb === null || body.storage_gb === '') {
        fields.push('storage_gb = ?')
        vals.push(null)
      } else {
        const n = Number(body.storage_gb)
        if (!Number.isInteger(n) || n < 1) {
          return res.status(400).json({ error: 'storage_gb must be a positive integer.' })
        }
        fields.push('storage_gb = ?')
        vals.push(n)
      }
    }
    if (body.color !== undefined) {
      fields.push('color = ?')
      vals.push(body.color ? String(body.color).trim().slice(0, 64) : null)
    }
    if (body.price !== undefined) {
      fields.push('price = ?')
      vals.push(Number(body.price))
    }
    if (body.stock !== undefined) {
      fields.push('stock = ?')
      vals.push(Number(body.stock))
    }
    if (!fields.length) {
      const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id])
      return res.json({ product: rows[0] })
    }
    vals.push(id)
    await pool.execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, vals)
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id])
    res.json({ product: rows[0] })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'SKU already exists.' })
    }
    if (sendIfDbUnavailable(res, err, 'admin product update')) return
    console.error('[admin product update]', err)
    res.status(500).json({ error: 'Could not update product.' })
  }
})

router.delete('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid product id.' })
    }
    const [r] = await pool.execute('DELETE FROM products WHERE id = ?', [id])
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Not found.' })
    res.json({ ok: true })
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
      return res.status(409).json({
        error: 'Product is referenced by orders. Remove or archive orders first.',
      })
    }
    if (sendIfDbUnavailable(res, err, 'admin product delete')) return
    console.error('[admin product delete]', err)
    res.status(500).json({ error: 'Could not delete product.' })
  }
})

router.get('/orders', async (_req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.id, o.user_id, o.status, o.total_amount, o.shipping_address, o.notes, o.created_at,
              u.email AS customer_email, u.first_name AS customer_first_name, u.last_name AS customer_last_name
       FROM orders o
       INNER JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`,
    )
    res.json({ orders })
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'admin orders')) return
    console.error('[admin orders]', err)
    res.status(500).json({ error: 'Could not load orders.' })
  }
})

router.get('/orders/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid order id.' })
    }
    const [ord] = await pool.query(
      `SELECT o.*, u.email AS customer_email, u.first_name AS customer_first_name, u.last_name AS customer_last_name
       FROM orders o
       INNER JOIN users u ON u.id = o.user_id
       WHERE o.id = ?`,
      [id],
    )
    if (!ord.length) return res.status(404).json({ error: 'Not found.' })
    const [items] = await pool.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price,
              p.name AS product_name, p.sku AS product_sku
       FROM order_items oi
       INNER JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [id],
    )
    res.json({ order: ord[0], items })
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'admin order detail')) return
    console.error('[admin order detail]', err)
    res.status(500).json({ error: 'Could not load order.' })
  }
})

router.patch('/orders/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid order id.' })
    }
    const { status } = req.body ?? {}
    if (!isValidOrderStatus(status)) {
      return res.status(400).json({
        error: `Invalid status. Use one of: ${ORDER_STATUSES.join(', ')}.`,
      })
    }
    const [r] = await pool.execute(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, id],
    )
    if (r.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found.' })
    }
    const [rows] = await pool.execute(
      `SELECT o.id, o.user_id, o.status, o.total_amount, o.shipping_address, o.notes, o.created_at
       FROM orders o WHERE o.id = ?`,
      [id],
    )
    res.json({ ok: true, order: rows[0] })
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'admin order patch')) return
    console.error('[admin order patch]', err)
    res.status(500).json({ error: 'Could not update order.' })
  }
})

router.get('/customers', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.created_at,
              COUNT(o.id) AS order_count,
              COALESCE(SUM(o.total_amount), 0) AS total_spent
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
       GROUP BY u.id, u.email, u.first_name, u.last_name, u.created_at
       ORDER BY u.id DESC`,
    )
    res.json({ customers: rows })
  } catch (err) {
    if (sendIfDbUnavailable(res, err, 'admin customers')) return
    console.error('[admin customers]', err)
    res.status(500).json({ error: 'Could not load customers.' })
  }
})

export default router
