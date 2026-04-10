import mysql from 'mysql2/promise'

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'itball2',
} = process.env

/** Shared pool — use `pool.query` / `pool.execute` from route handlers. */
export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
})

export async function testConnection() {
  const conn = await pool.getConnection()
  try {
    await conn.ping()
    return true
  } finally {
    conn.release()
  }
}

/** True when MySQL is not reachable (server down, wrong host/port, etc.). */
export function isDbConnectionError(err) {
  const c = err?.code
  return (
    c === 'ECONNREFUSED' ||
    c === 'ETIMEDOUT' ||
    c === 'ENOTFOUND' ||
    c === 'ECONNRESET' ||
    c === 'EPIPE'
  )
}

/** Shown to clients when `isDbConnectionError` — safe in production. */
export const DB_UNAVAILABLE_MESSAGE =
  'Database is unavailable. Start MySQL, run server/sql/schema.sql if needed, and check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME in .env.'

/**
 * If err is a DB connection failure, sends 503 JSON and returns true (handler should return).
 * @param {import('express').Response} res
 * @param {unknown} err
 * @param {string} [logLabel]
 */
export function sendIfDbUnavailable(res, err, logLabel = 'db') {
  if (!isDbConnectionError(err)) return false
  console.warn(`[${logLabel}]`, err?.code, err?.message)
  res.status(503).json({
    error: DB_UNAVAILABLE_MESSAGE,
    code: 'DATABASE_UNAVAILABLE',
  })
  return true
}
