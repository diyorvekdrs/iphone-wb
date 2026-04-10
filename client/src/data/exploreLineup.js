const S = {
  gen17: [
    { color: '#c17d4a', label: 'Cosmic Orange' },
    { color: '#1d1d1f', label: 'Black' },
    { color: '#e8e4d9', label: 'Silver' },
    { color: '#3d4f5c', label: 'Blue' },
  ],
  gen16: [
    { color: '#1e3a5f', label: 'Ultramarine' },
    { color: '#1d1d1f', label: 'Black' },
    { color: '#f5f5f0', label: 'White' },
    { color: '#3d2b2e', label: 'Pink' },
  ],
  gen15: [
    { color: '#3c3c3d', label: 'Titanium' },
    { color: '#1d1d1f', label: 'Black' },
    { color: '#e3e4e6', label: 'White' },
    { color: '#2f506c', label: 'Blue' },
  ],
  gen14: [
    { color: '#d4c4dc', label: 'Deep Purple' },
    { color: '#1d1d1f', label: 'Black' },
    { color: '#f5f5f0', label: 'Silver' },
    { color: '#2d3d52', label: 'Blue' },
  ],
  gen13: [
    { color: '#4a6670', label: 'Sierra Blue' },
    { color: '#1d1d1f', label: 'Midnight' },
    { color: '#f5f5f0', label: 'Starlight' },
    { color: '#8b2942', label: 'Red' },
  ],
  gen12: [
    { color: '#1e3a5f', label: 'Pacific Blue' },
    { color: '#1d1d1f', label: 'Graphite' },
    { color: '#f5f5f0', label: 'Silver' },
    { color: '#b76e79', label: 'Rose' },
  ],
  gen11: [
    { color: '#3d4a42', label: 'Midnight Green' },
    { color: '#1d1d1f', label: 'Space Gray' },
    { color: '#f5f0e8', label: 'Silver' },
    { color: '#c9baa8', label: 'Gold' },
  ],
  xs: [
    { color: '#c9baa8', label: 'Gold' },
    { color: '#1d1d1f', label: 'Space Gray' },
    { color: '#e8e8ed', label: 'Silver' },
    { color: '#5b7c99', label: 'Blue' },
  ],
  legacy: [
    { color: '#1d1d1f', label: 'Black' },
    { color: '#f5f5f0', label: 'White' },
    { color: '#c41e3a', label: 'Red' },
    { color: '#314a63', label: 'Blue' },
  ],
}

export function swatchesFor(id) {
  if (id === 'air' || id.startsWith('17')) return S.gen17
  if (id.startsWith('16')) return S.gen16
  if (id.startsWith('15')) return S.gen15
  if (id.startsWith('14')) return S.gen14
  if (id.startsWith('13')) return S.gen13
  if (id.startsWith('12')) return S.gen12
  if (id.startsWith('11')) return S.gen11
  if (id.startsWith('xs')) return S.xs
  return S.legacy
}

export const defaultTagline =
  'Powerful features, gorgeous display, and all-day battery — built for how you use iPhone.'

/** Custom taglines for headline SKUs; others use the default. */
export const taglineById = {
  '17-pro-max': 'Our largest Pro display. Ultimate performance and battery life.',
  '17-pro': 'Innovative design for ultimate performance and battery life.',
  air: 'The thinnest iPhone ever. With the power of pro inside.',
  '17': 'Even more delightful. Even more durable.',
  '16-pro-max': 'Pro camera system. Stunning titanium design.',
  '16-pro': 'A huge leap in battery life and camera.',
  '16-plus': 'A big, beautiful display in a durable design.',
  '16': 'Amazing performance. Durable design.',
  '16e': 'All the essentials. An approachable price.',
  '15-pro-max': 'Forged in titanium. Pro camera breakthroughs.',
  '15-pro': 'Pro. Beyond pro.',
  '15-plus': 'More screen. More battery.',
  '15': 'A total powerhouse.',
  '14-pro-max': 'Pro camera. Pro display. Pro performance.',
  '14-pro': 'Dynamic Island. Always-On display.',
  '14-plus': 'Supersized. Super capable.',
  '14': 'Big and bigger.',
  '13-pro-max': 'A huge leap in battery life.',
  '13-pro': 'A dramatic new camera layout.',
  '13-mini': 'Your superpower. Pocket size.',
  '13': 'Your new superpower.',
  '12-pro-max': '5G to the max.',
  '12-pro': 'A new era for iPhone.',
  '12-mini': 'Small phone. Huge possibilities.',
  '12': 'Blast past fast.',
  '11-pro-max': 'Pro cameras. Pro display. Pro performance.',
  '11-pro': 'Pro cameras. Pro display.',
  '11': 'Just the right amount of everything.',
  'xs-max': 'Supersized. Super retina.',
  xs: 'Welcome to the big screens.',
  xr: 'Brilliant. In every way.',
  x: 'The future is here.',
}

/** Tagline from DB-backed spec (CSV). Returns null if nothing usable. */
export function buildTaglineFromSpec(spec) {
  if (!spec) return null
  const parts = []
  if (spec.chip) parts.push(spec.chip)
  if (spec.screenSize) parts.push(`${spec.screenSize} display`)
  if (spec.batteryVideoHours != null && spec.batteryVideoHours !== '') {
    parts.push(`Up to ${spec.batteryVideoHours}h video playback`)
  }
  if (parts.length === 0) return null
  return `${parts.join(' · ')}.`
}
