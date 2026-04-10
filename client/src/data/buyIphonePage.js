import { getColorways } from './compareModels.js'
import { iphoneModels } from './iphoneModels.js'

/** Entry storage tier MSRP (US-style); totals align with `catalog_products.json` when SKUs match. */
const STORAGE_BY_MODEL = {
  '17-pro': [
    { gb: 256, priceUsd: 1099 },
    { gb: 512, priceUsd: 1299 },
    { gb: 1024, priceUsd: 1599 },
    { gb: 2048, priceUsd: 1999 },
  ],
  '17-pro-max': [
    { gb: 256, priceUsd: 1199 },
    { gb: 512, priceUsd: 1399 },
    { gb: 1024, priceUsd: 1699 },
    { gb: 2048, priceUsd: 2099 },
  ],
  '16-pro': [
    { gb: 128, priceUsd: 899 },
    { gb: 256, priceUsd: 999 },
    { gb: 512, priceUsd: 1199 },
    { gb: 1024, priceUsd: 1399 },
  ],
  '16-pro-max': [
    { gb: 256, priceUsd: 1099 },
    { gb: 512, priceUsd: 1299 },
    { gb: 1024, priceUsd: 1499 },
    { gb: 2048, priceUsd: 1699 },
  ],
  air: [
    { gb: 256, priceUsd: 999 },
    { gb: 512, priceUsd: 1199 },
    { gb: 1024, priceUsd: 1399 },
  ],
  '17': [
    { gb: 256, priceUsd: 799 },
    { gb: 512, priceUsd: 999 },
  ],
  '16': [
    { gb: 128, priceUsd: 699 },
    { gb: 256, priceUsd: 799 },
    { gb: 512, priceUsd: 999 },
  ],
}

const DEFAULT_STORAGE = [
  { gb: 256, priceUsd: 899 },
  { gb: 512, priceUsd: 1099 },
  { gb: 1024, priceUsd: 1299 },
]

/** Shown on Buy flow — user picks cellular hardware preference; stored on order notes. */
export const SIM_CONFIGURATION_OPTIONS = [
  {
    id: 'nano-sim',
    label: 'Nano-SIM',
    description: 'Single physical SIM card.',
  },
  {
    id: 'esim',
    label: 'eSIM',
    description: 'Digital SIM only — no physical card.',
  },
  {
    id: 'sim-esim',
    label: 'Nano-SIM + eSIM',
    description: 'Physical SIM and eSIM together (dual).',
  },
  {
    id: 'dual-sim',
    label: 'Dual SIM',
    description: 'Two physical SIM cards (where available).',
  },
  {
    id: 'dual-esim',
    label: 'Dual eSIM',
    description: 'Two eSIM lines, no physical SIM.',
  },
]

export const DEFAULT_SIM_OPTION_ID = SIM_CONFIGURATION_OPTIONS[0].id

export const CARRIER_DEALS = [
  {
    id: 'att',
    name: 'AT&T',
    shortDeal: 'Save up to $1100 after trade-in.',
    footnote: '◊',
  },
  {
    id: 'boost',
    name: 'Boost Mobile',
    shortDeal: 'Up to $830. No trade‑in needed to qualify.',
    footnote: '∆',
  },
  {
    id: 'tmobile',
    name: 'T‑Mobile',
    shortDeal: 'Save up to $1100 after trade-in.',
    footnote: '§',
  },
  {
    id: 'verizon',
    name: 'Verizon',
    shortDeal: 'Up to $1100 for an eligible trade-in in any condition.',
    footnote: '±',
  },
  {
    id: 'later',
    name: 'Connect on your own later',
    shortDeal: 'Choose a carrier when your iPhone arrives.',
    footnote: null,
  },
]

function modelLineName(modelId) {
  return iphoneModels.find((m) => m.id === modelId)?.name ?? `iPhone ${modelId}`
}

function alternateBuyModels(modelId) {
  const id = String(modelId)
  const pairs = {
    '17-pro': ['17-pro-max'],
    '17-pro-max': ['17-pro'],
    '16-pro': ['16-pro-max'],
    '16-pro-max': ['16-pro'],
  }
  const alt = pairs[id]
  if (!alt) return []
  return alt
    .map((mid) => {
      const m = iphoneModels.find((x) => x.id === mid)
      return m ? { id: m.id, name: m.name } : null
    })
    .filter(Boolean)
}

/**
 * @param {string} modelId
 */
export function getBuyPageConfig(modelId) {
  const id = String(modelId ?? '').toLowerCase().trim()
  const name = modelLineName(id)
  const colors = getColorways(id)
  const storageTiers = STORAGE_BY_MODEL[id] ?? DEFAULT_STORAGE

  return {
    modelId: id,
    name,
    colors,
    storageTiers,
    carriers: CARRIER_DEALS,
    simOptions: SIM_CONFIGURATION_OPTIONS,
    alternateModels: alternateBuyModels(id),
    /** Footnote line under price when a carrier deal is selected */
    carrierPricingNote:
      'Monthly pricing and bill credits vary by carrier and plan. Amounts shown are estimates for this storefront.',
  }
}
