import { iphoneModels } from './iphoneModels.js'

/** Fallback picker when `/api/iphone-specs` has no rows (DB empty / offline). Otherwise Compare uses all `iphone_specs` slugs. */
export const comparePickerModels = iphoneModels.filter((m) => !m.isAction)

/** Map API / alternate ids to keys in `COLORWAYS` + `iphoneModels.id`. */
const COMPARE_MODEL_ID_ALIASES = {
  'iphone-17': '17',
  'iphone-16': '16',
  'iphone-air': 'air',
  'iphone-17-pro': '17-pro',
  'iphone-17-pro-max': '17-pro-max',
  'iphone-16-pro': '16-pro',
  'iphone-16-pro-max': '16-pro-max',
  'iphone-11': '11',
  'iphone-11-pro': '11-pro',
  'iphone-11-pro-max': '11-pro-max',
  'iphone-12': '12',
  'iphone-12-pro': '12-pro',
  'iphone-12-pro-max': '12-pro-max',
  'iphone-13': '13',
  'iphone-13-pro': '13-pro',
  'iphone-13-pro-max': '13-pro-max',
  'iphone-14': '14',
  'iphone-15': '15',
  'iphone-15-pro': '15-pro',
  'iphone-15-pro-max': '15-pro-max',
}

function normalizeCompareModelId(modelId) {
  const s = String(modelId ?? '').trim()
  return COMPARE_MODEL_ID_ALIASES[s] ?? s
}

/** iPhone 8 / 7 / 6 family and older — not shown on Compare (cutoff is iPhone X and newer). */
const COMPARE_EXCLUDED_PRE_IPHONE_X = new Set([
  '8',
  '8-plus',
  '7',
  '7-plus',
  '6s',
  '6s-plus',
  '6',
  '6-plus',
  '5s',
  '5c',
  '5',
  '4s',
  '4',
])

/**
 * Compare shows standard-size flagships only: no pre–iPhone X, no Plus, no “e” line (16e, 17e, …).
 *
 * @param {string | number | null | undefined} modelId Slug or short id from API / picker
 * @returns {boolean} True if this model should not appear in the Compare dropdown
 */
export function isExcludedFromComparePicker(modelId) {
  const id = normalizeCompareModelId(modelId)
  let key = String(id ?? '')
      .trim()
      .toLowerCase()
  if (key.startsWith('iphone-')) key = key.slice(7)
  if (COMPARE_EXCLUDED_PRE_IPHONE_X.has(key)) return true
  if (key.endsWith('-plus')) return true
  if (/^\d+e$/.test(key)) return true
  return false
}

/** Shared compare hero (Sierra Blue marketing shot) for 13 Pro and 13 Pro Max — same size-class lineup. */
const IPHONE_13_PRO_COMPARE = '/iphone-models/iphone-13-pro-compare.png'
const IPHONE_13_PRO_COLORWAYS = [
  { label: 'Graphite', swatch: '#3d3d3f', image: IPHONE_13_PRO_COMPARE },
  { label: 'Gold', swatch: '#e8d4c4', image: IPHONE_13_PRO_COMPARE },
  { label: 'Silver', swatch: '#e3e4e6', image: IPHONE_13_PRO_COMPARE },
  { label: 'Sierra Blue', swatch: '#6b8fa8', image: IPHONE_13_PRO_COMPARE },
  { label: 'Alpine Green', swatch: '#4a5c4e', image: IPHONE_13_PRO_COMPARE },
]

/** Shared compare hero (Natural Titanium marketing shot) for 15 Pro and 15 Pro Max. */
const IPHONE_15_PRO_COMPARE = '/iphone-models/iphone-15-pro-compare.png'
const IPHONE_15_PRO_COLORWAYS = [
  { label: 'Natural Titanium', swatch: '#a8a59c', image: IPHONE_15_PRO_COMPARE },
  { label: 'Blue Titanium', swatch: '#4a6a8c', image: IPHONE_15_PRO_COMPARE },
  { label: 'White Titanium', swatch: '#e8e6e1', image: IPHONE_15_PRO_COMPARE },
  { label: 'Black Titanium', swatch: '#3d3d3f', image: IPHONE_15_PRO_COMPARE },
]

/**
 * Finishes and swatch colors; images reference `/public/iphone-models` assets per lineup.
 */
const COLORWAYS = {
  '17-pro-max': [
    {
      label: 'Cosmic Orange',
      swatch: '#c17d4a',
      image: '/iphone-models/iphone-17-pro-orange-front-back.png',
    },
    {
      label: 'Deep Navy',
      swatch: '#1e2a3a',
      image: '/iphone-models/iphone-16-pro-max.png',
    },
    {
      label: 'Silver',
      swatch: '#e8e4d9',
      image: '/iphone-models/nav-iphone-17pro.png',
    },
  ],
  '17-pro': [
    {
      label: 'Cosmic Orange',
      swatch: '#c17d4a',
      image: '/iphone-models/iphone-17-pro-orange-front-back.png',
    },
    {
      label: 'Deep Blue',
      swatch: '#2c3e50',
      image: '/iphone-models/iphone-17-pro.avif',
    },
    {
      label: 'Silver',
      swatch: '#e8e4d9',
      image: '/iphone-models/nav-iphone-17pro.png',
    },
  ],
  air: [
    {
      label: 'Sky Blue',
      swatch: '#7eb8d6',
      image: '/iphone-models/iphone-air.png',
    },
    {
      label: 'Light Gold',
      swatch: '#d4c4a8',
      image: '/iphone-models/iphone-air.png',
    },
    {
      label: 'Cloud White',
      swatch: '#f2f1ed',
      image: '/iphone-models/iphone-air.png',
    },
    {
      label: 'Space Black',
      swatch: '#1d1d1f',
      image: '/iphone-models/iphone-air.png',
    },
  ],
  '16-pro-max': [
    {
      label: 'Natural Titanium',
      swatch: '#a8a59c',
      image: '/iphone-models/iphone-16-pro-max.png',
    },
    {
      label: 'Blue Titanium',
      swatch: '#4a6a8c',
      image: '/iphone-models/iphone-16-pro-max.png',
    },
    {
      label: 'White Titanium',
      swatch: '#e8e6e1',
      image: '/iphone-models/iphone-16-pro-max.png',
    },
  ],
  '16-pro': [
    {
      label: 'Natural Titanium',
      swatch: '#a8a59c',
      image: '/iphone-models/iphone-16-pro-max.png',
    },
    {
      label: 'Blue Titanium',
      swatch: '#4a6a8c',
      image: '/iphone-models/iphone-16-pro-max.png',
    },
    {
      label: 'Black Titanium',
      swatch: '#3d3d3f',
      image: '/iphone-models/iphone-16-pro-max.png',
    },
  ],
  '16': [
    {
      label: 'Ultramarine',
      swatch: '#2d3d6e',
      image: '/iphone-models/iphone-16.png',
    },
    {
      label: 'Teal',
      swatch: '#5a8a8a',
      image: '/iphone-models/iphone-16.png',
    },
    {
      label: 'Pink',
      swatch: '#e8b4c8',
      image: '/iphone-models/iphone-16.png',
    },
    {
      label: 'White',
      swatch: '#f5f5f0',
      image: '/iphone-models/iphone-16.png',
    },
    {
      label: 'Black',
      swatch: '#1d1d1f',
      image: '/iphone-models/iphone-16.png',
    },
  ],
  '17': [
    {
      label: 'Lavender',
      swatch: '#d4c4dc',
      image: '/iphone-models/nav-iphone-17.png',
    },
    {
      label: 'Sage Green',
      swatch: '#9cb8a8',
      image: '/iphone-models/nav-iphone-17.png',
    },
    {
      label: 'Light Blue',
      swatch: '#a8c4d8',
      image: '/iphone-models/nav-iphone-17.png',
    },
    {
      label: 'White',
      swatch: '#f5f5f0',
      image: '/iphone-models/nav-iphone-17.png',
    },
    {
      label: 'Space Gray',
      swatch: '#3d3d3f',
      image: '/iphone-models/nav-iphone-17.png',
    },
  ],
  '11': [
    {
      label: 'Black',
      swatch: '#1d1d1f',
      image: '/iphone-models/iphone-11-compare.png',
    },
    {
      label: 'White',
      swatch: '#f5f5f0',
      image: '/iphone-models/iphone-11-compare.png',
    },
    {
      label: 'Green',
      swatch: '#6b8f71',
      image: '/iphone-models/iphone-11-compare.png',
    },
    {
      label: 'Yellow',
      swatch: '#f4e8c8',
      image: '/iphone-models/iphone-11-compare.png',
    },
    {
      label: 'Purple',
      swatch: '#b8a9c9',
      image: '/iphone-models/iphone-11-compare.png',
    },
    {
      label: '(PRODUCT)RED',
      swatch: '#c41e3a',
      image: '/iphone-models/iphone-11-compare.png',
    },
  ],
  '12': [
    {
      label: 'Black',
      swatch: '#1d1d1f',
      image: '/iphone-models/iphone-12-compare.png',
    },
    {
      label: 'White',
      swatch: '#f5f5f0',
      image: '/iphone-models/iphone-12-compare.png',
    },
    {
      label: 'Blue',
      swatch: '#2d4a6e',
      image: '/iphone-models/iphone-12-compare.png',
    },
    {
      label: 'Green',
      swatch: '#6b8f71',
      image: '/iphone-models/iphone-12-compare.png',
    },
    {
      label: '(PRODUCT)RED',
      swatch: '#c41e3a',
      image: '/iphone-models/iphone-12-compare.png',
    },
    {
      label: 'Purple',
      swatch: '#b8a9c9',
      image: '/iphone-models/iphone-12-compare.png',
    },
  ],
  '12-pro': [
    {
      label: 'Pacific Blue',
      swatch: '#3a5a7a',
      image: '/iphone-models/iphone-12-pro-compare.png',
    },
    {
      label: 'Graphite',
      swatch: '#3d3d3f',
      image: '/iphone-models/iphone-12-pro-compare.png',
    },
    {
      label: 'Silver',
      swatch: '#e3e4e6',
      image: '/iphone-models/iphone-12-pro-compare.png',
    },
    {
      label: 'Gold',
      swatch: '#e8d4c4',
      image: '/iphone-models/iphone-12-pro-compare.png',
    },
  ],
  '12-pro-max': [
    {
      label: 'Pacific Blue',
      swatch: '#3a5a7a',
      image: '/iphone-models/iphone-12-pro-compare.png',
    },
    {
      label: 'Graphite',
      swatch: '#3d3d3f',
      image: '/iphone-models/iphone-12-pro-compare.png',
    },
    {
      label: 'Silver',
      swatch: '#e3e4e6',
      image: '/iphone-models/iphone-12-pro-compare.png',
    },
    {
      label: 'Gold',
      swatch: '#e8d4c4',
      image: '/iphone-models/iphone-12-pro-compare.png',
    },
  ],
  '13': [
    {
      label: 'Midnight',
      swatch: '#1d1d1f',
      image: '/iphone-models/iphone-13-compare.png',
    },
    {
      label: 'Starlight',
      swatch: '#f5f5f0',
      image: '/iphone-models/iphone-13-compare.png',
    },
    {
      label: 'Blue',
      swatch: '#2d4a6e',
      image: '/iphone-models/iphone-13-compare.png',
    },
    {
      label: 'Pink',
      swatch: '#e8b4c8',
      image: '/iphone-models/iphone-13-compare.png',
    },
    {
      label: 'Green',
      swatch: '#6b8f71',
      image: '/iphone-models/iphone-13-compare.png',
    },
    {
      label: '(PRODUCT)RED',
      swatch: '#c41e3a',
      image: '/iphone-models/iphone-13-compare.png',
    },
  ],
  '13-pro': IPHONE_13_PRO_COLORWAYS,
  '13-pro-max': IPHONE_13_PRO_COLORWAYS,
  '14': [
    {
      label: 'Midnight',
      swatch: '#1d1d1f',
      image: '/iphone-models/iphone-14-compare.png',
    },
    {
      label: 'Starlight',
      swatch: '#f5f5f0',
      image: '/iphone-models/iphone-14-compare.png',
    },
    {
      label: 'Blue',
      swatch: '#2d4a6e',
      image: '/iphone-models/iphone-14-compare.png',
    },
    {
      label: 'Purple',
      swatch: '#b8a9c9',
      image: '/iphone-models/iphone-14-compare.png',
    },
    {
      label: 'Yellow',
      swatch: '#f5e6a8',
      image: '/iphone-models/iphone-14-compare.png',
    },
    {
      label: '(PRODUCT)RED',
      swatch: '#c41e3a',
      image: '/iphone-models/iphone-14-compare.png',
    },
  ],
  '15': [
    {
      label: 'Black',
      swatch: '#1d1d1f',
      image: '/iphone-models/iphone-15-compare.png',
    },
    {
      label: 'Blue',
      swatch: '#4a7ba7',
      image: '/iphone-models/iphone-15-compare.png',
    },
    {
      label: 'Green',
      swatch: '#5a8f6e',
      image: '/iphone-models/iphone-15-compare.png',
    },
    {
      label: 'Yellow',
      swatch: '#f3e6a8',
      image: '/iphone-models/iphone-15-compare.png',
    },
    {
      label: 'Pink',
      swatch: '#e8b8c8',
      image: '/iphone-models/iphone-15-compare.png',
    },
  ],
  '15-pro': IPHONE_15_PRO_COLORWAYS,
  '15-pro-max': IPHONE_15_PRO_COLORWAYS,
  '11-pro': [
    {
      label: 'Midnight Green',
      swatch: '#3d4f3f',
      image: '/iphone-models/iphone-11-pro-compare.png',
    },
    {
      label: 'Space Gray',
      swatch: '#4a4a4c',
      image: '/iphone-models/iphone-11-pro-compare.png',
    },
    {
      label: 'Silver',
      swatch: '#e3e4e6',
      image: '/iphone-models/iphone-11-pro-compare.png',
    },
    {
      label: 'Gold',
      swatch: '#e8d4c4',
      image: '/iphone-models/iphone-11-pro-compare.png',
    },
  ],
  '11-pro-max': [
    {
      label: 'Midnight Green',
      swatch: '#3d4f3f',
      image: '/iphone-models/iphone-11-pro-compare.png',
    },
    {
      label: 'Space Gray',
      swatch: '#4a4a4c',
      image: '/iphone-models/iphone-11-pro-compare.png',
    },
    {
      label: 'Silver',
      swatch: '#e3e4e6',
      image: '/iphone-models/iphone-11-pro-compare.png',
    },
    {
      label: 'Gold',
      swatch: '#e8d4c4',
      image: '/iphone-models/iphone-11-pro-compare.png',
    },
  ],
}

export function getColorways(modelId) {
  const id = normalizeCompareModelId(modelId)
  if (COLORWAYS[id]) return COLORWAYS[id]
  const m = iphoneModels.find((x) => x.id === id)
  const img = m?.image ?? '/iphone-models/fallback.png'
  return [
    { label: 'Black', swatch: '#1d1d1f', image: img },
    { label: 'Silver', swatch: '#e8e8ea', image: img },
    { label: 'Blue', swatch: '#2d3d52', image: img },
  ]
}

export const defaultColumnModelIds = ['17-pro-max', 'air', '17']
