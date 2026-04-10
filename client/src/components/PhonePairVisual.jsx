/**
 * Abstract two-phone thumbnails — color cues only (no Apple assets).
 * `paletteIndex` cycles through distinct gradient pairs for long lists.
 */
const PALETTES = [
  ['from-amber-200 via-orange-400 to-amber-950', 'from-neutral-200 via-neutral-400 to-neutral-800'],
  ['from-sky-100 via-slate-200 to-slate-400', 'from-neutral-950 via-neutral-900 to-black'],
  ['from-fuchsia-200 via-pink-300 to-rose-700', 'from-neutral-900 via-neutral-800 to-neutral-950'],
  ['from-neutral-100 via-neutral-300 to-neutral-600', 'from-blue-600 via-blue-800 to-slate-950'],
  ['from-sky-300 via-blue-500 to-blue-900', 'from-neutral-900 to-black'],
  ['from-white via-neutral-100 to-neutral-300', 'from-neutral-800 to-neutral-950'],
  ['from-violet-200 via-violet-400 to-violet-900', 'from-emerald-900 to-emerald-950'],
  ['from-yellow-100 via-amber-300 to-amber-800', 'from-slate-800 to-slate-950'],
  ['from-teal-200 via-cyan-400 to-cyan-900', 'from-orange-900 to-neutral-950'],
  ['from-indigo-200 via-indigo-400 to-indigo-950', 'from-stone-300 to-stone-700'],
  ['from-rose-200 via-rose-400 to-rose-900', 'from-zinc-800 to-zinc-950'],
  ['from-lime-100 via-green-400 to-green-900', 'from-neutral-100 to-neutral-500'],
]

export default function PhonePairVisual({
  paletteIndex = 0,
  compare = false,
  className = '',
}) {
  const basePhone =
    'rounded-[0.85rem] shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.06]'
  const h = 'h-[4.5rem]'
  const w = 'w-[2.35rem]'

  if (compare) {
    return (
      <div
        className={`flex h-[5.25rem] items-end justify-center gap-1.5 ${className}`}
        aria-hidden="true"
      >
        <div
          className={`${basePhone} ${h} ${w} bg-gradient-to-b from-white to-neutral-200`}
        />
        <div
          className={`${basePhone} ${h} ${w} bg-gradient-to-b from-neutral-700 to-neutral-950`}
        />
      </div>
    )
  }

  const i = ((paletteIndex % PALETTES.length) + PALETTES.length) % PALETTES.length
  const [left, right] = PALETTES[i]

  return (
    <div
      className={`flex h-[5.25rem] items-end justify-center gap-1.5 ${className}`}
      aria-hidden="true"
    >
      <div className={`${basePhone} ${h} ${w} bg-gradient-to-b ${left}`} />
      <div className={`${basePhone} ${h} ${w} bg-gradient-to-b ${right}`} />
    </div>
  )
}
