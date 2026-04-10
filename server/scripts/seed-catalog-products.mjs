/**
 * Upsert `products` for every iPhone in the storefront (matches `client/src/data/iphoneModels.js`, excluding Compare).
 * Source of truth: `server/data/catalog_products.json` (US-style MSRP for the entry storage tier).
 *
 * Usage: npm run db:seed-products
 * Requires: MySQL running, database `itball2` created (see server/sql/schema.sql).
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'itball2',
} = process.env

const CATALOG_PATH = path.join(__dirname, '../data/catalog_products.json')

async function main() {
  const raw = fs.readFileSync(CATALOG_PATH, 'utf8')
  const catalog = JSON.parse(raw)
  if (!Array.isArray(catalog) || catalog.length === 0) {
    throw new Error(`Invalid or empty catalog: ${CATALOG_PATH}`)
  }

  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  })

  let n = 0
  for (const p of catalog) {
    const {
      sku,
      name,
      description,
      image_url,
      storage_gb,
      color,
      price,
      stock,
    } = p
    if (!sku || !name) {
      console.warn('Skipping row missing sku or name:', p)
      continue
    }
    await conn.execute(
      `INSERT INTO products (sku, name, description, image_url, storage_gb, color, price, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         description = VALUES(description),
         image_url = VALUES(image_url),
         storage_gb = VALUES(storage_gb),
         color = VALUES(color),
         price = VALUES(price),
         stock = VALUES(stock)`,
      [
        sku,
        name,
        description ?? null,
        image_url ?? null,
        storage_gb ?? null,
        color ?? null,
        Number(price),
        Number(stock) || 0,
      ],
    )
    n += 1
    console.log('Upserted:', sku, name, `($${Number(price).toFixed(2)})`)
  }

  await conn.end()
  console.log(`Done. ${n} products upserted from catalog_products.json.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
