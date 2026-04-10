import { useEffect, useState } from 'react'
import { isValidIphoneModelId } from '../utils/iphoneRoutes.js'

/**
 * @typedef {{ view: 'home' }} HomeRoute
 * @typedef {{ view: 'compare' }} CompareRoute
 * @typedef {{ view: 'basket' }} BasketRoute
 * @typedef {{ view: 'payment' }} PaymentRoute
 * @typedef {{ view: 'purchase' }} PurchaseRoute
 * @typedef {{ view: 'order', orderModelId?: string }} OrderRoute
 * @typedef {{ view: 'orders', ordersDetailId?: number }} OrdersRoute
 * @typedef {{ view: 'login' }} LoginRoute
 * @typedef {{ view: 'register' }} RegisterRoute
 * @typedef {{ view: 'admin' }} AdminRoute
 * @typedef {{ view: 'iphone', modelId: string }} IphoneRoute
 * @typedef {{ view: 'buy-iphone', modelId: string }} BuyIphoneRoute
 */

/** @returns {HomeRoute | CompareRoute | BasketRoute | PaymentRoute | PurchaseRoute | OrderRoute | OrdersRoute | LoginRoute | RegisterRoute | AdminRoute | IphoneRoute | BuyIphoneRoute} */
export function parseHash(hash) {
  const raw = (hash ?? '').replace(/^#/, '').replace(/^\//, '').trim()
  if (!raw) return { view: 'home' }

  const segments = raw
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean)
  const head = segments[0]?.split('?')[0]

  if (head === 'iphone' && segments[1]) {
    const rawId = segments[1]
    let modelId = rawId
    try {
      modelId = decodeURIComponent(rawId)
    } catch {
      modelId = rawId
    }
    if (isValidIphoneModelId(modelId)) {
      return { view: 'iphone', modelId }
    }
    return { view: 'home' }
  }
  if (head === 'buy-iphone' && segments[1]) {
    let modelId = segments[1]
    try {
      modelId = decodeURIComponent(modelId)
    } catch {
      modelId = segments[1]
    }
    if (isValidIphoneModelId(modelId)) {
      return { view: 'buy-iphone', modelId }
    }
    return { view: 'home' }
  }
  if (head === 'compare') return { view: 'compare' }
  if (head === 'basket') return { view: 'basket' }
  if (head === 'payment') return { view: 'payment' }
  if (head === 'order') {
    const slug = segments[1]
    if (slug) {
      let decodedSlug = slug
      try {
        decodedSlug = decodeURIComponent(slug)
      } catch {
        decodedSlug = slug
      }
      // Safety: any model-shaped `/order/:modelId` should open model page.
      if (isValidIphoneModelId(decodedSlug)) {
        return { view: 'iphone', modelId: decodedSlug }
      }
    }
    try {
      return {
        view: 'order',
        orderModelId: slug ? decodeURIComponent(slug) : undefined,
      }
    } catch {
      return { view: 'order', orderModelId: slug }
    }
  }
  if (head === 'purchase') {
    const slug = segments[1]
    try {
      return {
        view: 'purchase',
        orderModelId: slug ? decodeURIComponent(slug) : undefined,
      }
    } catch {
      return { view: 'purchase', orderModelId: slug }
    }
  }
  if (head === 'orders') {
    const oid = segments[1]
    if (oid) {
      const n = Number(oid)
      if (Number.isInteger(n) && n > 0) {
        return { view: 'orders', ordersDetailId: n }
      }
    }
    return { view: 'orders' }
  }
  if (head === 'login') return { view: 'login' }
  if (head === 'register') return { view: 'register' }
  if (head === 'admin') return { view: 'admin' }
  if (head === 'privacy') return { view: 'privacy' }
  if (head === 'terms') return { view: 'terms' }

  return { view: 'home' }
}

export function useHashRoute() {
  const [parsed, setParsed] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const apply = () => {
      const next = parseHash(window.location.hash)
      setParsed(next)
      if (
        next.view === 'iphone' ||
        next.view === 'buy-iphone' ||
        next.view === 'compare' ||
        next.view === 'basket' ||
        next.view === 'payment' ||
        next.view === 'order' ||
        next.view === 'purchase' ||
        next.view === 'orders' ||
        next.view === 'login' ||
        next.view === 'register' ||
        next.view === 'admin' ||
        next.view === 'privacy' ||
        next.view === 'terms'
      ) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }
    }

    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [])

  return parsed
}
