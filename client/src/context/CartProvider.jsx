import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { CartContext } from './cart-context.js'

const LEGACY_CART_KEY = 'itball2-cart'
const LEGACY_PAYMENT_KEY = 'itball2-payment-queue'
const GUEST_CART_KEY = 'itball2-cart-guest'
const GUEST_PAYMENT_KEY = 'itball2-payment-queue-guest'

function sanitizeCartObject(o) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return {}
  return o
}

function parseCartLocal(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return {}
    return sanitizeCartObject(JSON.parse(raw))
  } catch {
    return {}
  }
}

function loadCartForKey(key) {
  let data = parseCartLocal(key)
  if (key === GUEST_CART_KEY && Object.keys(data).length === 0) {
    const legacy = parseCartLocal(LEGACY_CART_KEY)
    if (Object.keys(legacy).length > 0) {
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(legacy))
      } catch {
        /* ignore */
      }
      return legacy
    }
  }
  return data
}

function loadPaymentQueueForKey(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return migrateLegacyPaymentQueue(key)
    const a = JSON.parse(raw)
    if (!Array.isArray(a)) return migrateLegacyPaymentQueue(key)
    return a.filter(
      (x) =>
        x &&
        typeof x === 'object' &&
        typeof x.id === 'string' &&
        Number(x.productId) >= 1 &&
        Number(x.quantity) >= 1,
    )
  } catch {
    return migrateLegacyPaymentQueue(key)
  }
}

function migrateLegacyPaymentQueue(key) {
  if (key !== GUEST_PAYMENT_KEY) return []
  try {
    const raw = localStorage.getItem(LEGACY_PAYMENT_KEY)
    if (!raw) return []
    const a = JSON.parse(raw)
    if (!Array.isArray(a)) return []
    const filtered = a.filter(
      (x) =>
        x &&
        typeof x === 'object' &&
        typeof x.id === 'string' &&
        Number(x.productId) >= 1 &&
        Number(x.quantity) >= 1,
    )
    if (filtered.length > 0) {
      try {
        localStorage.setItem(GUEST_PAYMENT_KEY, JSON.stringify(filtered))
      } catch {
        /* ignore */
      }
    }
    return filtered
  } catch {
    return []
  }
}

function cartKeyForUser(user) {
  if (!user) return GUEST_CART_KEY
  if (user.role === 'super_admin') {
    const u = String(user.username || 'sa').replace(/[^a-zA-Z0-9_-]/g, '_')
    return `itball2-cart-sa:${u}`
  }
  const id = user?.id != null ? String(user.id).trim() : ''
  if (!id) return GUEST_CART_KEY
  return `itball2-cart-user:${id}`
}

function paymentKeyForUser(user) {
  if (!user) return GUEST_PAYMENT_KEY
  if (user.role === 'super_admin') {
    const u = String(user.username || 'sa').replace(/[^a-zA-Z0-9_-]/g, '_')
    return `itball2-payment-queue-sa:${u}`
  }
  const id = user?.id != null ? String(user.id).trim() : ''
  if (!id) return GUEST_PAYMENT_KEY
  return `itball2-payment-queue-user:${id}`
}

function newLineId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function CartProvider({ children }) {
  const { user, loading } = useAuth()
  const [quantities, setQuantities] = useState({})
  const [paymentQueue, setPaymentQueue] = useState([])

  const quantitiesRef = useRef(quantities)
  const paymentRef = useRef(paymentQueue)
  quantitiesRef.current = quantities
  paymentRef.current = paymentQueue

  const prevCartKeyRef = useRef(undefined)
  const prevPayKeyRef = useRef(undefined)
  const bucketJustChangedRef = useRef(false)

  useEffect(() => {
    if (loading) return

    const cartKey = cartKeyForUser(user)
    const payKey = paymentKeyForUser(user)
    const prevCart = prevCartKeyRef.current

    if (prevCart === undefined) {
      prevCartKeyRef.current = cartKey
      prevPayKeyRef.current = payKey
      bucketJustChangedRef.current = true
      setQuantities(loadCartForKey(cartKey))
      setPaymentQueue(loadPaymentQueueForKey(payKey))
      return
    }

    if (prevCart === cartKey) return

    try {
      localStorage.setItem(prevCart, JSON.stringify(quantitiesRef.current))
      localStorage.setItem(prevPayKeyRef.current, JSON.stringify(paymentRef.current))
    } catch {
      /* ignore */
    }

    prevCartKeyRef.current = cartKey
    prevPayKeyRef.current = payKey
    bucketJustChangedRef.current = true

    const wasLoggedIn = prevCart !== GUEST_CART_KEY

    if (!user && wasLoggedIn) {
      try {
        localStorage.setItem(cartKey, '{}')
        localStorage.setItem(payKey, '[]')
      } catch {
        /* ignore */
      }
      setQuantities({})
      setPaymentQueue([])
      return
    }

    setQuantities(loadCartForKey(cartKey))
    setPaymentQueue(loadPaymentQueueForKey(payKey))
  }, [loading, user])

  useEffect(() => {
    if (loading) return
    if (prevCartKeyRef.current === undefined || prevPayKeyRef.current === undefined) return
    if (bucketJustChangedRef.current) {
      bucketJustChangedRef.current = false
      return
    }
    try {
      localStorage.setItem(prevCartKeyRef.current, JSON.stringify(quantities))
      localStorage.setItem(prevPayKeyRef.current, JSON.stringify(paymentQueue))
    } catch {
      /* ignore */
    }
  }, [loading, quantities, paymentQueue])

  const addDelta = useCallback((productId, delta, maxStock) => {
    const key = String(productId)
    const max = Math.max(0, Number(maxStock) || 0)
    setQuantities((prev) => {
      const cur = prev[key] ?? 0
      const n = Math.max(0, Math.min(max, cur + delta))
      const next = { ...prev }
      if (n === 0) delete next[key]
      else next[key] = n
      return next
    })
  }, [])

  const setLineQty = useCallback((productId, q, maxStock) => {
    const key = String(productId)
    const max = Math.max(0, Number(maxStock) || 0)
    const n = Math.max(0, Math.min(max, Math.floor(Number(q) || 0)))
    setQuantities((prev) => {
      const next = { ...prev }
      if (n === 0) delete next[key]
      else next[key] = n
      return next
    })
  }, [])

  const clearCart = useCallback(() => setQuantities({}), [])

  const totalItems = useMemo(
    () => Object.values(quantities).reduce((a, b) => a + Number(b || 0), 0),
    [quantities],
  )

  const addPaymentLine = useCallback((line) => {
    const id = line.id ?? newLineId()
    const productId = Number(line.productId)
    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1))
    const unitPrice = Number(line.unitPrice) || 0
    const entry = {
      id,
      productId,
      quantity,
      modelId: String(line.modelId ?? ''),
      modelName: String(line.modelName ?? 'iPhone'),
      unitPrice,
      image: line.image != null ? String(line.image) : null,
      notes: line.notes != null ? String(line.notes) : '',
    }
    setPaymentQueue((prev) => [...prev, entry])
  }, [])

  const removePaymentLine = useCallback((lineId) => {
    setPaymentQueue((prev) => prev.filter((l) => l.id !== lineId))
  }, [])

  const removePaymentLines = useCallback((lineIds) => {
    const drop = new Set(lineIds)
    setPaymentQueue((prev) => prev.filter((l) => !drop.has(l.id)))
  }, [])

  const clearPaymentQueue = useCallback(() => setPaymentQueue([]), [])

  const paymentQueueCount = useMemo(
    () => paymentQueue.reduce((a, l) => a + (Number(l.quantity) || 0), 0),
    [paymentQueue],
  )

  const value = useMemo(
    () => ({
      quantities,
      addDelta,
      setLineQty,
      clearCart,
      totalItems,
      paymentQueue,
      addPaymentLine,
      removePaymentLine,
      removePaymentLines,
      clearPaymentQueue,
      paymentQueueCount,
    }),
    [
      quantities,
      addDelta,
      setLineQty,
      clearCart,
      totalItems,
      paymentQueue,
      addPaymentLine,
      removePaymentLine,
      removePaymentLines,
      clearPaymentQueue,
      paymentQueueCount,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
