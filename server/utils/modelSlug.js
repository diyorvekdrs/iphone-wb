/**
 * Stable slug for `iphone_specs.slug` — matches app model ids (e.g. `17-pro-max`, `air`).
 * @param {string} modelName Value from CSV "Model" column (e.g. "iPhone 17 Pro Max")
 */
export function modelNameToSlug(modelName) {
  const t = String(modelName ?? '').trim()
  if (t === 'iPhone Air') return 'air'
  let s = t.replace(/^iPhone\s+/i, '').trim()
  s = s.replace(/\s*\([^)]*\)/g, '').trim()
  s = s.toLowerCase().replace(/\s+/g, '-')
  s = s.replace(/[^a-z0-9-]/g, '')
  return s || 'unknown'
}
