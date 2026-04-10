import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  comparePickerModels,
  defaultColumnModelIds,
  getColorways,
  isExcludedFromComparePicker,
} from '../data/compareModels.js'
import { useIphoneSpecs } from '../hooks/useIphoneSpecs.js'
import {
  compareBlurUp,
  compareBlurUpReduced,
  compareRise,
  compareRiseReduced,
  staggerCompareColumn,
  staggerCompareGrid,
} from '../motion/textVariants.js'
import { iphonePageHref } from '../utils/iphoneRoutes.js'

function isYes(v) {
  return String(v ?? '').trim().toLowerCase() === 'yes'
}

/** Lines after the primary display line; primary is rendered with a footnote superscript. */
function getDisplayFeatureTailLines(spec) {
  if (!spec) return []
  const lines = []
  if (isYes(spec.proMotion)) lines.push('ProMotion technology')
  if (isYes(spec.alwaysOnDisplay)) lines.push('Always-On display')
  if (isYes(spec.dynamicIsland)) lines.push('Dynamic Island')
  return lines
}

function FrameLayersIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="10"
        y="6"
        width="36"
        height="18"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <rect
        x="10"
        y="28"
        width="36"
        height="18"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  )
}

function CeramicShieldIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M28 6 50 28 28 50 6 28 28 6Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M28 6v44M6 28h44" stroke="currentColor" strokeWidth="1.25" />
      <path d="m17 17 22 22M39 17 17 39" stroke="currentColor" strokeWidth="1" opacity="0.85" />
    </svg>
  )
}

function SummaryColumn({ spec, reduceMotion }) {
  const heroVariant = reduceMotion ? compareBlurUpReduced : compareBlurUp
  const lineVariant = reduceMotion ? compareRiseReduced : compareRise
  const tailLines = getDisplayFeatureTailLines(spec)
  const frame = spec?.frameMaterial?.trim()
  const actionLabel = isYes(spec?.actionButton) ? 'Action button' : null
  const cameraControlBlurb = isYes(spec?.cameraControl)
    ? 'Camera Control for faster access to photo and video tools'
    : null

  return (
    <Motion.div
      className="flex w-full max-w-[300px] flex-col items-center justify-self-center text-center"
      variants={staggerCompareColumn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35, margin: '0px 0px -12% 0px' }}
    >
      {spec?.screenSize ? (
        <Motion.p
          className="text-[32px] font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]"
          variants={heroVariant}
        >
          {spec.screenSize}
        </Motion.p>
      ) : (
        <Motion.p
          className="h-[40px] text-[13px] text-[#86868b]"
          variants={lineVariant}
        >
          —
        </Motion.p>
      )}

      {spec ? (
        <Motion.p
          className="mt-4 max-w-[260px] text-[12px] leading-snug text-[#1d1d1f] md:text-[13px]"
          variants={lineVariant}
        >
          Super Retina XDR display
          <sup className="ml-0.5 align-super text-[0.65em] font-normal leading-none">1</sup>
        </Motion.p>
      ) : null}

      {tailLines.map((line, i) => (
        <Motion.p
          key={`${line}-${i}`}
          className="mt-1.5 max-w-[260px] text-[12px] leading-snug text-[#1d1d1f] md:text-[13px]"
          variants={lineVariant}
        >
          {line}
        </Motion.p>
      ))}

      {frame ? (
        <>
          <Motion.div
            className="mt-8 text-[#1d1d1f] md:mt-10"
            variants={lineVariant}
            aria-hidden
          >
            <FrameLayersIcon className="mx-auto h-[52px] w-14" />
          </Motion.div>
          <Motion.p
            className="mt-3 max-w-[260px] text-[12px] leading-snug text-[#1d1d1f] md:text-[13px]"
            variants={lineVariant}
          >
            {frame}
          </Motion.p>
        </>
      ) : null}

      {actionLabel ? (
        <Motion.p
          className="mt-4 max-w-[260px] text-[12px] leading-snug text-[#1d1d1f] md:text-[13px]"
          variants={lineVariant}
        >
          {actionLabel}
        </Motion.p>
      ) : null}

      {cameraControlBlurb ? (
        <Motion.p
          className="mt-3 max-w-[240px] text-[12px] leading-snug text-[#1d1d1f] md:text-[13px]"
          variants={lineVariant}
        >
          {cameraControlBlurb}
        </Motion.p>
      ) : null}

      {spec ? (
        <>
          <Motion.div
            className="mt-8 text-[#1d1d1f] md:mt-10"
            variants={lineVariant}
            aria-hidden
          >
            <CeramicShieldIcon className="mx-auto h-14 w-14" />
          </Motion.div>
          <Motion.p
            className="mt-3 max-w-[260px] text-[12px] leading-snug text-[#1d1d1f] md:text-[13px]"
            variants={lineVariant}
          >
            Ceramic Shield 2 front
          </Motion.p>
        </>
      ) : null}
    </Motion.div>
  )
}

/** Full comparison data from the API (`iphone_specs`, loaded from `iphone_comparison.csv`). */
function getTechSpecRows(spec) {
  if (!spec) return []
  const rows = [
    ['Screen', spec.screenSize],
    ['Chip', spec.chip],
    ['Battery (video)', spec.batteryVideoHours],
    ['Frame', spec.frameMaterial],
    ['Water resistance', spec.waterResistance],
    ['ProMotion', spec.proMotion],
    ['Always-On display', spec.alwaysOnDisplay],
    ['Dynamic Island', spec.dynamicIsland],
    ['Action button', spec.actionButton],
    ['Camera Control', spec.cameraControl],
    ['Neural Engine', spec.neuralEngine],
    ['GPU', spec.gpu],
    ['Front camera', spec.frontCamera],
    ['Colors', spec.colorsAvailable],
  ]
  return rows.filter(([, v]) => v != null && String(v).trim() !== '')
}

function TechSpecsColumn({ spec, reduceMotion }) {
  const rows = getTechSpecRows(spec)
  const lineVariant = reduceMotion ? compareRiseReduced : compareRise
  const blockVariant =
    reduceMotion ? compareBlurUpReduced : compareBlurUp

  return (
    <Motion.div
      className="flex w-full max-w-[300px] flex-col items-center justify-self-center text-center"
      variants={staggerCompareColumn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3, margin: '0px 0px -12% 0px' }}
    >
      {rows.length === 0 ? (
        <Motion.p className="text-[13px] text-[#86868b]" variants={lineVariant}>
          —
        </Motion.p>
      ) : (
        rows.map(([label, value], idx) => {
          const hero = label === 'Screen' || label === 'Chip'
          return (
            <Motion.div
              key={label}
              variants={hero ? blockVariant : lineVariant}
              className={[
                'w-full max-w-[280px]',
                idx === 0 ? '' : 'mt-6 md:mt-7',
              ].join(' ')}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">
                {label}
              </p>
              <p
                className={[
                  'mt-2 leading-relaxed text-[#1d1d1f]',
                  hero
                    ? 'text-[17px] font-semibold tracking-[-0.02em] md:text-[19px]'
                    : 'text-[12px] md:text-[13px]',
                ].join(' ')}
              >
                {value}
              </p>
            </Motion.div>
          )
        })
      )}
    </Motion.div>
  )
}

function TechSpecsSection({ modelIds }) {
  const reduceMotion = useReducedMotion()
  const { bySlug } = useIphoneSpecs()
  const titleVariant = reduceMotion ? compareBlurUpReduced : compareBlurUp

  return (
    <section className="mt-16 w-full md:mt-24" aria-labelledby="compare-tech-heading">
      <Motion.h2
        id="compare-tech-heading"
        className="text-[21px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={titleVariant}
      >
        Tech specs
      </Motion.h2>
      <Motion.div
        className="mt-3 h-px w-full bg-black/[0.12]"
        initial={{ opacity: 0, y: 20, scaleX: 0.85 }}
        whileInView={{ opacity: 1, y: 0, scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      />

      <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
        {modelIds.map((id, i) => (
          <TechSpecsColumn
            key={`${i}-${id}`}
            spec={bySlug[id]}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </section>
  )
}

function SummarySection({ modelIds }) {
  const reduceMotion = useReducedMotion()
  const { bySlug } = useIphoneSpecs()
  const titleVariant = reduceMotion ? compareBlurUpReduced : compareBlurUp

  return (
    <section className="mt-14 w-full md:mt-20" aria-labelledby="compare-summary-heading">
      <Motion.h2
        id="compare-summary-heading"
        className="text-[21px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={titleVariant}
      >
        Summary
      </Motion.h2>
      <Motion.div
        className="mt-3 h-px w-full bg-black/[0.12]"
        initial={{ opacity: 0, y: 20, scaleX: 0.85 }}
        whileInView={{ opacity: 1, y: 0, scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      />

      <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
        {modelIds.map((id, i) => (
          <SummaryColumn
            key={`${i}-${id}`}
            spec={bySlug[id]}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </section>
  )
}

const selectButton =
  'flex w-full max-w-[280px] items-center justify-between gap-2.5 rounded-xl border border-black/[0.18] bg-white px-3.5 py-3 text-left text-[15px] font-normal text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[box-shadow,border-color] hover:border-black/25'

function ChevronDown({ className }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 4.25L6 7.75l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ModelSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listId = useId()

  const v = value == null ? '' : String(value)
  const current = options.find((o) => String(o.id) === v)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="relative mx-auto w-full max-w-[280px]" ref={rootRef}>
      <button
        type="button"
        className={selectButton}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="min-w-0 truncate">{current?.name ?? 'Select'}</span>
        <ChevronDown className="shrink-0 text-[#0066cc]" />
      </button>
      <AnimatePresence>
        {open ? (
          <Motion.ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-[min(50vh,320px)] overflow-auto rounded-xl border border-black/10 bg-white py-1 shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {options.map((m) => (
              <li key={String(m.id)} role="option" aria-selected={String(m.id) === v}>
                <button
                  type="button"
                  className={[
                    'w-full px-3.5 py-2 text-left text-[14px] text-[#1d1d1f] transition-colors',
                    String(m.id) === v ? 'bg-[#f0f7ff] font-medium' : 'hover:bg-[#f5f5f7]',
                  ].join(' ')}
                  onClick={() => {
                    onChange(String(m.id))
                    setOpen(false)
                  }}
                >
                  {m.name}
                </button>
              </li>
            ))}
          </Motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function CompareColumn({ modelId, onModelChange, pickerOptions }) {
  const reduceMotion = useReducedMotion()
  const lineVariant = reduceMotion ? compareRiseReduced : compareRise
  const colorways = getColorways(modelId)
  const [colorIdx, setColorIdx] = useState(0)

  useEffect(() => {
    setColorIdx(0)
  }, [modelId])

  const safeIdx = Math.min(colorIdx, colorways.length - 1)
  const active = colorways[safeIdx]
  /** Compare uses one static hero per model; swatches only reflect selection, not the photo. */
  const compareHeroImage =
    colorways[0]?.image ?? active?.image ?? '/iphone-models/fallback.png'
  const mid = modelId == null ? '' : String(modelId)
  const modelLabel =
    pickerOptions.find((m) => String(m.id) === mid)?.name ?? 'iPhone'

  return (
    <Motion.div
      className="flex flex-col items-center"
      variants={staggerCompareColumn}
    >
      <Motion.div className="relative z-10 w-full max-w-[280px]" variants={lineVariant}>
        <ModelSelect
          value={modelId}
          onChange={onModelChange}
          options={pickerOptions}
        />
      </Motion.div>

      <Motion.div className="relative z-0 w-full max-w-[300px]" variants={lineVariant}>
        <a
          href={iphonePageHref(modelId)}
          className="relative mt-8 flex min-h-[220px] w-full items-center justify-center rounded-2xl outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-[#0071e3] md:mt-10 md:min-h-[260px]"
          aria-label={`Open ${modelLabel} product page`}
        >
          <Motion.img
            key={String(modelId)}
            src={compareHeroImage}
            alt=""
            className="max-h-[220px] w-full object-contain md:max-h-[260px]"
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          />
        </a>
      </Motion.div>

      <Motion.div
        className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10"
        variants={lineVariant}
      >
        {colorways.map((c, i) => (
          <button
            key={`${c.label}-${i}`}
            type="button"
            aria-label={c.label}
            title={c.label}
            className={[
              'h-4 w-4 rounded-full border border-black/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] transition-[box-shadow,transform] ring-offset-2 ring-offset-white',
              i === safeIdx
                ? 'scale-100 ring-2 ring-[#0071e3]'
                : 'ring-0 hover:scale-105',
            ].join(' ')}
            style={{ backgroundColor: c.swatch }}
            onClick={() => setColorIdx(i)}
          />
        ))}
      </Motion.div>

      <Motion.p
        className="mt-3 text-center text-[13px] font-normal text-[#1d1d1f] md:mt-4 md:text-[14px]"
        variants={lineVariant}
      >
        {active.label}
      </Motion.p>
    </Motion.div>
  )
}

export default function CompareIphonePage() {
  const reduceMotion = useReducedMotion()
  const [columns, setColumns] = useState(() =>
    defaultColumnModelIds.map((id) => String(id)),
  )
  const { models: specModels, bySlug } = useIphoneSpecs()

  const pickerOptions = useMemo(() => {
    const strip = comparePickerModels.map((m) => ({
      id: String(m.id),
      name: m.name,
    }))

    const byId = new Map()
    const push = (o) => {
      if (!o?.id) return
      const id = String(o.id).trim()
      if (!id) return
      if (isExcludedFromComparePicker(id)) return
      if (!byId.has(id)) byId.set(id, { ...o, id })
    }

    const hasApiModels = Object.keys(bySlug).length > 0

    if (hasApiModels) {
      for (const slug of Object.keys(bySlug)) {
        const spec = bySlug[slug]
        push({
          id: String(slug),
          name: spec?.modelName ? String(spec.modelName) : String(slug),
        })
      }
    } else {
      for (const o of strip) push(o)
    }

    for (const o of strip) {
      if (!byId.has(o.id)) push(o)
    }

    if (Array.isArray(specModels) && specModels.length > 0) {
      const ordered = []
      const seen = new Set()
      for (const s of specModels) {
        const slug = s?.slug == null ? '' : String(s.slug).trim()
        if (!slug || seen.has(slug) || !byId.has(slug)) continue
        ordered.push(byId.get(slug))
        seen.add(slug)
      }
      for (const [id, o] of byId) {
        if (!seen.has(id)) ordered.push(o)
      }
      return ordered
    }

    return Array.from(byId.values())
  }, [specModels, bySlug])

  useEffect(() => {
    if (!Array.isArray(specModels) || specModels.length === 0) return
    const valid = new Set(
      specModels
        .map((s) => (s?.slug == null ? '' : String(s.slug).trim()))
        .filter(Boolean)
        .filter((slug) => !isExcludedFromComparePicker(slug)),
    )
    const order = [...valid]
    setColumns((prev) => {
      const next = prev.map((id, i) => {
        const sid = id == null ? '' : String(id)
        if (valid.has(sid)) return sid
        const pref = defaultColumnModelIds[i]
        const prefStr = pref == null ? '' : String(pref)
        if (prefStr && valid.has(prefStr)) return prefStr
        return order[Math.min(i, order.length - 1)] ?? sid
      })
      return next.every((v, i) => v === prev[i]) ? prev : next
    })
  }, [specModels])

  const setColumnModel = (index, id) => {
    const sid = id == null ? '' : String(id)
    setColumns((prev) => {
      const next = [...prev]
      next[index] = sid
      return next
    })
  }

  return (
    <main className="min-h-screen bg-white pt-11 text-[#1d1d1f]">
      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-8 md:px-10 md:pb-24 md:pt-12">
        <Motion.div
          className="text-center"
          variants={staggerCompareGrid}
          initial="hidden"
          animate="visible"
        >
          <Motion.div className="mb-1" variants={reduceMotion ? compareRiseReduced : compareRise}>
            <a
              href="#/"
              className="text-[13px] text-[#0066cc] hover:underline md:text-[14px]"
            >
              ‹ iPhone
            </a>
          </Motion.div>

          <Motion.h1
            className="text-center text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f] md:text-[36px] lg:text-[42px]"
            variants={reduceMotion ? compareBlurUpReduced : compareBlurUp}
          >
            Compare iPhone models
          </Motion.h1>
        </Motion.div>

        <Motion.div
          className="mt-10 grid gap-10 md:mt-12 md:grid-cols-3 md:gap-6 lg:gap-8"
          variants={staggerCompareGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {columns.map((modelId, i) => (
            <CompareColumn
              key={`column-${i}`}
              modelId={modelId}
              onModelChange={(id) => setColumnModel(i, id)}
              pickerOptions={pickerOptions}
            />
          ))}
        </Motion.div>

        <SummarySection modelIds={columns} />
        <TechSpecsSection modelIds={columns} />
      </div>
    </main>
  )
}