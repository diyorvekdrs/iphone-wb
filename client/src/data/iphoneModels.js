/**
 * Images live in /public/iphone-models/ (copied from project `Iphone models/`).
 * Use `image` for a photo path under `/public`; Compare tile uses a dedicated asset.
 */
const I = {
  i17: '/iphone-models/iphone-17-pro.avif',
  i17nav: '/iphone-models/nav-iphone-17pro.png',
  /** Base iPhone 17 strip icon. */
  i17Phone: '/iphone-models/nav-iphone-17.png',
  /** Base iPhone 16 (non‑Pro) hero asset */
  i16Phone: '/iphone-models/iphone-16.png',
  iAir: '/iphone-models/iphone-air.png',
  cmp: '/iphone-models/nav-compare.png',
  fb: '/iphone-models/fallback.png',
}

/**
 * iPhone category strip — newest first; “New” on the 17 / Air generation.
 */
export const iphoneModels = [
  { id: '17-pro-max', name: 'iPhone 17 Pro Max', badge: 'New', image: I.i17nav },
  { id: '17-pro', name: 'iPhone 17 Pro', badge: 'New', image: I.i17nav },
  { id: 'air', name: 'iPhone Air', badge: 'New', image: I.iAir },
  { id: '17', name: 'iPhone 17', badge: 'New', image: I.i17Phone },
  { id: '16', name: 'iPhone 16', badge: null, image: I.i16Phone },
  { id: 'compare', name: 'Compare', badge: null, image: I.cmp, isAction: true },
]

export const globalNavLinks = [
  { href: '#iphone-category', label: 'iPhone' },
  { href: '#/compare', label: 'Compare' },
]
