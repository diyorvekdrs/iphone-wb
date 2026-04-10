import { useMemo, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useIphoneSpecs } from '../hooks/useIphoneSpecs.js'
import { getProductPage } from '../data/iphoneProductPages.js'
import { iphoneBuyHref } from '../utils/iphoneRoutes.js'
import OverviewHighlightsCarousel from './iphone/OverviewHighlightsCarousel.jsx'

function slugFromModelId(modelId) {
  const id = String(modelId ?? '').toLowerCase().trim()
  const map = {
    '17-pro': 'iphone-17-pro',
    '17-pro-max': 'iphone-17-pro-max',
    '17': 'iphone-17',
    air: 'iphone-air',
    '16-pro': 'iphone-16-pro',
    '16-pro-max': 'iphone-16-pro-max',
    '16': 'iphone-16',
  }
  return map[id] ?? null
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function SpecRow({ label, value, variant = 'dark' }) {
  const isLight = variant === 'light'
  return (
    <div
      className={[
        'flex items-start justify-between gap-4 border-b py-4',
        isLight ? 'border-black/10' : 'border-white/10',
      ].join(' ')}
    >
      <p
        className={[
          'text-[12px] font-semibold uppercase tracking-[0.14em]',
          isLight ? 'text-black/55' : 'text-white/60',
        ].join(' ')}
      >
        {label}
      </p>
      <p
        className={[
          'text-right text-[14px] font-medium',
          isLight ? 'text-black/85' : 'text-white/90',
        ].join(' ')}
      >
        {value ?? '—'}
      </p>
    </div>
  )
}

/** Fallback when `getProductPage` omits `designExplore` (should not happen for known models). */
const DEFAULT_DESIGN_EXPLORE_ORDER = [
  'colors',
  'aluminum-unibody',
  'vapor-chamber',
  'ceramic-shield',
  'display',
  'camera-control',
  'action-button',
]

const designEase = [0.22, 1, 0.36, 1]

const designRowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: designEase },
  },
}

const designListVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.06 },
  },
}

const designRowSwapTransition = { duration: 0.32, ease: designEase }
const designImageSwapTransition = { duration: 0.4, ease: designEase }

const DESIGN_UI = {
  dark: {
    navBtn:
      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#1c1c1e] text-[12px] text-white/85',
    navHover: 'rgba(255,255,255,0.08)',
    colorsPanel:
      'overflow-hidden rounded-2xl bg-[#1c1c1e] px-4 py-4 md:px-5 md:py-5',
    colorsTitle: 'font-semibold text-white',
    colorsBody: 'text-white/75',
    pill: 'flex w-full items-center gap-3 rounded-full bg-[#1c1c1e] px-4 py-3 text-left text-[15px] font-medium tracking-[-0.01em] text-white/85 transition-colors duration-200 hover:bg-white/[0.08]',
    pillPlus:
      'flex w-full items-center gap-3 rounded-full bg-[#1c1c1e] px-4 py-3 text-left text-[15px] font-medium tracking-[-0.01em] text-white/90 transition-colors duration-200 hover:bg-white/[0.08]',
    featurePanel:
      'overflow-hidden rounded-2xl bg-[#1c1c1e] px-4 py-4 md:px-5 md:py-5',
    featureTitle: 'font-semibold text-white',
    featureBody: 'text-white/85',
    plusRing: 'border-white/25 text-white/65',
    swatchOn: 'border-[#2997ff] shadow-[0_0_0_1px_rgba(41,151,255,0.4)]',
    swatchOff: 'border-white/30 hover:border-white/50',
    canvas: 'bg-black/40',
    canvasEmpty: 'text-white/45',
  },
  air: {
    navBtn:
      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[12px] text-black/75 shadow-sm',
    navHover: 'rgba(0,0,0,0.06)',
    colorsPanel:
      'overflow-hidden rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-black/[0.06] md:px-5 md:py-5',
    colorsTitle: 'font-semibold text-[#1d1d1f]',
    colorsBody: 'text-black/70',
    pill: 'flex w-full items-center gap-3 rounded-full border border-black/[0.08] bg-white px-4 py-3 text-left text-[15px] font-medium tracking-[-0.01em] text-[#1d1d1f] shadow-sm transition-colors hover:bg-black/[0.03]',
    pillPlus:
      'flex w-full items-center gap-3 rounded-full border border-black/[0.08] bg-white px-4 py-3 text-left text-[15px] font-medium tracking-[-0.01em] text-[#1d1d1f] shadow-sm transition-colors hover:bg-black/[0.03]',
    featurePanel:
      'overflow-hidden rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-black/[0.06] md:px-5 md:py-5',
    featureTitle: 'font-semibold text-[#1d1d1f]',
    featureBody: 'text-black/80',
    plusRing: 'border-black/15 text-black/45',
    swatchOn: 'border-[#0071e3] shadow-[0_0_0_1px_rgba(0,113,227,0.35)]',
    swatchOff: 'border-black/20 hover:border-black/35',
    canvas: 'bg-[#ececef]',
    canvasEmpty: 'text-black/35',
  },
}

export default function IphoneProductPage({ modelId }) {
  const page = useMemo(() => getProductPage(modelId), [modelId])
  const colors = useMemo(() => page.colors ?? [], [page])
  const highlights = useMemo(() => page.highlights ?? [], [page])
  const [colorIdx, setColorIdx] = useState(0)
  const [designExploreTab, setDesignExploreTab] = useState(
    () => page.designExplore?.defaultTab ?? 'vapor-chamber',
  )
  const resetKey = `${modelId}|${page.designExplore?.defaultTab ?? 'vapor-chamber'}`
  const [prevResetKey, setPrevResetKey] = useState(resetKey)
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey)
    setColorIdx(0)
    setDesignExploreTab(page.designExplore?.defaultTab ?? 'vapor-chamber')
  }
  const safeIdx = clamp(colorIdx, 0, Math.max(0, colors.length - 1))
  const active = colors[safeIdx] ?? colors[0] ?? null

  const explore = page.designExplore
  const exploreOrder = explore?.order ?? DEFAULT_DESIGN_EXPLORE_ORDER
  const exploreLabels = explore?.labels
  const exploreFeatureCopy = explore?.featureCopy
  const exploreFeatureImages = explore?.featureImages

  const designExploreImage = explore?.staticCanvasImage
    ? explore.staticCanvasImage
    : designExploreTab === 'colors'
      ? exploreFeatureImages?.colors ?? '/iphone-models/fallback.png'
      : exploreFeatureImages?.[designExploreTab] ?? '/iphone-models/fallback.png'

  const cycleDesignExplore = (delta) => {
    const order = exploreOrder
    const i = order.indexOf(designExploreTab)
    const next = i < 0 ? 0 : (i + delta + order.length) % order.length
    setDesignExploreTab(order[next])
  }

  const buyHref = iphoneBuyHref(modelId)

  const { bySlug } = useIphoneSpecs()
  const specSlug = useMemo(() => slugFromModelId(modelId), [modelId])
  const spec = useMemo(() => (specSlug ? bySlug?.[specSlug] : null), [bySlug, specSlug])

  const designSection = page.designSection ?? {
    eyebrow: 'Design',
    headline: 'Designed to delight.',
    body: `${page.name} brings together advanced features in a refined design.`,
    image: '/iphone-models/unibody-design-promo.png',
  }
  const designIntroSection = page.designIntroSection ?? null

  const overviewSlides = useMemo(() => {
    if (page.overviewCarouselSlides?.length) return page.overviewCarouselSlides
    const cols = colors.length ? colors : [{ image: '/iphone-models/fallback.png' }]
    return highlights.map((h, i) => ({
      key: h.key,
      caption: h.description,
      image: cols[i % cols.length]?.image ?? '/iphone-models/fallback.png',
    }))
  }, [page.overviewCarouselSlides, highlights, colors])

  const watchFilmHref = page.heroVideoSrc ? '#hero-video' : null
  const heroPlaybackRate = 1.15
  const isAir = modelId === 'air'
  const is17 = modelId === '17'
  const techSpecsLight = isAir || is17
  const useLightDesignSection = isAir || Boolean(designIntroSection)
  const pageVariant = isAir ? 'light' : 'dark'
  const ui = useLightDesignSection ? DESIGN_UI.air : DESIGN_UI.dark

  return (
    <div className={isAir ? 'bg-white text-[#1d1d1f]' : 'bg-black text-white'}>
      {isAir && page.tradeInPromo ? (
        <div className="border-b border-black/[0.06] bg-[#f5f5f7] px-4 py-3 text-center">
          <p className="mx-auto max-w-3xl text-[13px] leading-snug text-[#1d1d1f] md:text-[14px]">
            {page.tradeInPromo}{' '}
            <a href="#" className="whitespace-nowrap text-[#0066cc] hover:underline">
              Learn more
            </a>
          </p>
        </div>
      ) : null}

      {page.heroVideoSrc || page.topBannerImage ? (
        <div
          id={page.heroVideoSrc ? 'hero-video' : undefined}
          className={[
            'relative w-full overflow-hidden',
            isAir ? 'bg-white' : 'bg-black',
          ].join(' ')}
        >
          {page.heroVideoSrc ? (
            <video
              className="block min-h-[62vh] w-full max-h-[min(96vh,1120px)] object-cover object-bottom md:min-h-[66vh] md:max-h-[min(99vh,1280px)]"
              poster={page.topBannerImage}
              autoPlay
              muted
              playsInline
              preload="auto"
              aria-label={`${page.name} hero video`}
              onLoadedMetadata={(e) => {
                e.currentTarget.playbackRate = heroPlaybackRate
              }}
            >
              <source src={page.heroVideoSrc} type="video/mp4" />
            </video>
          ) : (
            <img
              src={page.topBannerImage}
              alt=""
              className="block w-full max-h-[min(82vh,900px)] object-cover object-bottom md:max-h-[min(88vh,1000px)]"
              loading="eager"
              decoding="async"
            />
          )}
        </div>
      ) : null}

      {/* Hero — Apple-style highlights carousel */}
      <section
        id="overview"
        className={[
          'relative overflow-hidden',
          isAir
            ? 'bg-[#f5f5f7] text-[#1d1d1f]'
            : is17
              ? 'bg-white text-[#1d1d1f]'
              : 'bg-black',
        ].join(' ')}
      >
        <OverviewHighlightsCarousel
          slides={overviewSlides}
          buyHref={buyHref}
          watchFilmHref={watchFilmHref}
          variant={pageVariant}
          lightChrome={is17}
        />
      </section>

      {designIntroSection ? (
        <section className="bg-[#f5f5f7] text-[#1d1d1f]">
          <div className="mx-auto max-w-6xl px-4 py-24 md:py-28">
            <div className="max-w-4xl">
              <p className="text-[34px] font-semibold leading-tight tracking-[-0.02em] md:text-[38px]">
                {designIntroSection.eyebrow}
              </p>
              <h2 className="mt-4 whitespace-pre-line text-balance text-[58px] font-semibold leading-[0.98] tracking-[-0.04em] md:text-[76px] lg:text-[88px]">
                <span className="bg-gradient-to-r from-[#b179d6] via-[#548bb8] to-[#72b563] bg-clip-text text-transparent">
                  {designIntroSection.headline}
                </span>
              </h2>
              <p className="mt-8 max-w-[860px] text-[17px] leading-[1.58] text-black/70 md:text-[19px]">
                {designIntroSection.body}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* Design — unibody (replaces former “Details / features” grid) */}
      {!designIntroSection ? (
        <section
          id="highlights"
          className={[
            'border-t',
            isAir ? 'border-black/10 bg-white' : 'border-white/10 bg-black',
          ].join(' ')}
        >
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
            <div className="mx-auto max-w-[720px] text-center">
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#ff9f0a]">
                {designSection.eyebrow}
              </p>
              <h2
                className={[
                  'mt-4 text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[44px] lg:text-[52px]',
                  isAir ? 'text-[#1d1d1f]' : 'text-white',
                  'whitespace-pre-line',
                ].join(' ')}
              >
                {designSection.headline}
              </h2>
              <p
                className={[
                  'mt-6 text-[17px] leading-[1.6] md:text-[19px]',
                  isAir ? 'text-black/70' : 'text-white/70',
                ].join(' ')}
              >
                {designSection.body}
              </p>
              {isAir ? (
                <p className="mt-8">
                  <a
                    href="#/compare"
                    className="text-[17px] font-normal text-[#0066cc] hover:underline"
                  >
                    Compare iPhone design
                  </a>
                </p>
              ) : null}
            </div>
            {designSection.image ? (
              <div className="relative left-1/2 mt-12 w-screen -translate-x-1/2 md:mt-16">
                <img
                  src={designSection.image}
                  alt=""
                  className="mx-auto w-full max-w-[56rem] object-contain object-bottom md:max-w-[62rem]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Design — accordion + product visual (matches “Take a closer look” reference) */}
      <section
        id="design"
        className={[
          'border-t',
          useLightDesignSection ? 'border-black/10 bg-white' : 'border-white/10 bg-black',
        ].join(' ')}
      >
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <Motion.h2
            className={[
              'text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[40px] lg:text-[44px]',
              useLightDesignSection ? 'text-[#1d1d1f]' : 'text-white',
            ].join(' ')}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: designEase }}
          >
            Take a closer look.
          </Motion.h2>

          <Motion.div
            className={[
              'mt-8 overflow-hidden rounded-[2rem] border p-5 md:mt-10 md:rounded-[2.25rem] md:p-8',
              useLightDesignSection
                ? 'border-black/[0.08] bg-[#f5f5f7]'
                : 'border-white/[0.08] bg-[#141414]',
            ].join(' ')}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: designEase, delay: 0.05 }}
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
              <div className="flex gap-3 lg:max-w-[min(100%,400px)] lg:shrink-0">
                <div className="flex flex-col gap-2 pt-1">
                  <Motion.button
                    type="button"
                    aria-label="Previous design topic"
                    onClick={() => cycleDesignExplore(-1)}
                    whileHover={{ backgroundColor: ui.navHover }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                    className={ui.navBtn}
                  >
                    <span className="block -translate-y-px" aria-hidden>
                      ⌃
                    </span>
                  </Motion.button>
                  <Motion.button
                    type="button"
                    aria-label="Next design topic"
                    onClick={() => cycleDesignExplore(1)}
                    whileHover={{ backgroundColor: ui.navHover }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                    className={ui.navBtn}
                  >
                    <span className="block translate-y-px" aria-hidden>
                      ⌄
                    </span>
                  </Motion.button>
                </div>

                <Motion.div
                  className="min-w-0 flex-1 space-y-3"
                  variants={designListVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.12 }}
                >
                  {exploreOrder.map((id) => {
                    const selected = designExploreTab === id
                    const label = exploreLabels?.[id] ?? id

                    if (id === 'colors') {
                      return (
                        <Motion.div
                          key={id}
                          variants={designRowVariants}
                          className="w-full min-w-0"
                          layout
                        >
                          <AnimatePresence mode="popLayout" initial={false}>
                            {selected ? (
                              <Motion.div
                                key="colors-panel"
                                layout
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={designRowSwapTransition}
                                className={ui.colorsPanel}
                              >
                                <p className="text-[15px] leading-snug md:text-[16px]">
                                  <span className={ui.colorsTitle}>Colors.</span>{' '}
                                  <span className={ui.colorsBody}>
                                    {explore?.colorsLead ? (
                                      <>
                                        {explore.colorsLead} {page.name} shown in{' '}
                                        {active?.label ?? '—'}.
                                      </>
                                    ) : (
                                      <>
                                        Choose from{' '}
                                        {colors.length === 1
                                          ? 'this bold finish'
                                          : `${colors.length} bold finishes`}
                                        . {page.name} shown in {active?.label ?? '—'}.
                                      </>
                                    )}
                                  </span>
                                </p>
                                {colors.length > 0 ? (
                                  <div
                                    className="mt-3 flex flex-wrap gap-2"
                                    role="group"
                                    aria-label="Finishes"
                                  >
                                    {colors.map((c, i) => {
                                      const on = i === safeIdx
                                      return (
                                        <Motion.button
                                          key={`${c.label}-${i}`}
                                          type="button"
                                          onClick={() => setColorIdx(i)}
                                          title={c.label}
                                          aria-label={c.label}
                                          aria-pressed={on}
                                          whileHover={{ scale: 1.06 }}
                                          whileTap={{ scale: 0.94 }}
                                          transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 24,
                                          }}
                                          className={[
                                            'h-6 w-6 rounded-full border-2 transition-shadow duration-200 sm:h-7 sm:w-7',
                                            on ? ui.swatchOn : ui.swatchOff,
                                          ].join(' ')}
                                          style={{ backgroundColor: c.swatch }}
                                        />
                                      )
                                    })}
                                  </div>
                                ) : null}
                              </Motion.div>
                            ) : (
                              <Motion.button
                                key="colors-pill"
                                layout
                                type="button"
                                onClick={() => setDesignExploreTab('colors')}
                                aria-pressed={false}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={designRowSwapTransition}
                                whileHover={{ scale: 1.008 }}
                                whileTap={{ scale: 0.985 }}
                                className={ui.pill}
                              >
                                <span
                                  className="h-2 w-2 shrink-0 rounded-full bg-[#ff9f0a]"
                                  aria-hidden
                                />
                                {label}
                              </Motion.button>
                            )}
                          </AnimatePresence>
                        </Motion.div>
                      )
                    }

                    const copy = exploreFeatureCopy?.[id]
                    return (
                      <Motion.div
                        key={id}
                        variants={designRowVariants}
                        className="w-full min-w-0"
                        layout
                      >
                        <AnimatePresence mode="popLayout" initial={false}>
                          {selected && copy ? (
                            <Motion.div
                              key={`${id}-panel`}
                              layout
                              initial={{ opacity: 0, y: -12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={designRowSwapTransition}
                              className={ui.featurePanel}
                            >
                              <p
                                className={[
                                  'text-[15px] leading-relaxed md:text-[16px]',
                                  ui.featureBody,
                                ].join(' ')}
                              >
                                <span className={ui.featureTitle}>{copy.title}</span>{' '}
                                {copy.body}
                              </p>
                            </Motion.div>
                          ) : (
                            <Motion.button
                              key={`${id}-pill`}
                              layout
                              type="button"
                              onClick={() => setDesignExploreTab(id)}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={designRowSwapTransition}
                              whileHover={{ scale: 1.008 }}
                              whileTap={{ scale: 0.985 }}
                              className={ui.pillPlus}
                            >
                              <span
                                className={[
                                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[17px] font-light leading-none',
                                  ui.plusRing,
                                ].join(' ')}
                                aria-hidden
                              >
                                +
                              </span>
                              {label}
                            </Motion.button>
                          )}
                        </AnimatePresence>
                      </Motion.div>
                    )
                  })}
                </Motion.div>
              </div>

              <div
                className={[
                  'relative flex min-h-[min(58vh,560px)] flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl md:min-h-[640px] lg:min-h-[min(72vh,720px)]',
                  ui.canvas,
                ].join(' ')}
              >
                {designExploreImage ? (
                  <AnimatePresence mode="wait" initial={false}>
                    <Motion.div
                      key={explore?.staticCanvasImage ? 'static-canvas' : designExploreTab}
                      initial={{ opacity: 0, x: 28, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.98 }}
                      transition={designImageSwapTransition}
                      className={
                        explore?.staticCanvasImage
                          ? 'absolute inset-0 min-h-0'
                          : 'flex w-full flex-col items-center justify-center'
                      }
                    >
                      <img
                        src={designExploreImage}
                        alt=""
                        className={
                          explore?.staticCanvasImage
                            ? 'h-full w-full object-cover object-center'
                            : 'mx-auto max-h-[min(64vh,720px)] w-full max-w-[min(100%,56rem)] object-contain md:max-h-[min(72vh,800px)] lg:max-h-[min(78vh,880px)]'
                        }
                        loading="lazy"
                        decoding="async"
                      />
                    </Motion.div>
                  </AnimatePresence>
                ) : (
                  <div
                    className={[
                      'flex min-h-[360px] items-center justify-center',
                      ui.canvasEmpty,
                    ].join(' ')}
                  >
                    Preview unavailable
                  </div>
                )}
              </div>
            </div>
          </Motion.div>
        </div>
      </section>

      {page.camerasSection ? (
        <section
          id="cameras"
          className={[
            'border-t',
            isAir ? 'border-black/10 bg-white' : 'border-white/10 bg-black',
          ].join(' ')}
        >
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#ff9f0a]">
              {page.camerasSection.eyebrow}
            </p>
            <h2
              className={[
                'mt-4 max-w-[920px] text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] whitespace-pre-line md:text-[44px] lg:text-[52px]',
                isAir ? 'text-[#1d1d1f]' : 'text-white',
              ].join(' ')}
            >
              {page.camerasSection.headline}
            </h2>
            {page.camerasSection.subline ? (
              <p
                className={[
                  'mt-6 max-w-[720px] text-[17px] leading-[1.6] md:text-[19px]',
                  isAir ? 'text-black/70' : 'text-white/70',
                ].join(' ')}
              >
                {page.camerasSection.subline}
              </p>
            ) : null}
            {page.camerasSection.stats?.length ? (
              <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
                {page.camerasSection.stats.map((s, i) => (
                  <div key={i} className="min-w-0">
                    <p
                      className={[
                        'text-[28px] font-semibold tracking-[-0.02em] md:text-[34px]',
                        isAir ? 'text-[#1d1d1f]' : 'text-white',
                      ].join(' ')}
                    >
                      {s.value}
                    </p>
                    <p
                      className={[
                        'mt-1 text-[13px] font-medium leading-snug md:text-[14px]',
                        isAir ? 'text-black/55' : 'text-white/55',
                      ].join(' ')}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {page.performanceSection ? (
        <section
          id="performance"
          className={[
            'border-t',
            isAir
              ? 'border-black/10 bg-[#f5f5f7]'
              : 'border-white/10 bg-[#0a0a0a]',
          ].join(' ')}
        >
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#ff9f0a]">
              {page.performanceSection.eyebrow}
            </p>
            <h2
              className={[
                'mt-4 max-w-[720px] text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[40px] lg:text-[44px]',
                isAir ? 'text-[#1d1d1f]' : 'text-white',
              ].join(' ')}
            >
              {page.performanceSection.headline}
            </h2>
            {page.performanceSection.body ? (
              <p
                className={[
                  'mt-6 max-w-[720px] text-[17px] leading-[1.65] md:text-[19px]',
                  isAir ? 'text-black/70' : 'text-white/70',
                ].join(' ')}
              >
                {page.performanceSection.body}
              </p>
            ) : null}
            {page.performanceSection.chips?.length ? (
              <ul
                className={[
                  'mt-10 flex flex-wrap gap-3',
                  isAir ? 'text-[#1d1d1f]' : 'text-white',
                ].join(' ')}
              >
                {page.performanceSection.chips.map((chip, i) => (
                  <li
                    key={i}
                    className={[
                      'rounded-full border px-4 py-2 text-[14px] font-semibold tracking-[-0.01em]',
                      isAir
                        ? 'border-black/10 bg-white text-[#1d1d1f] shadow-sm'
                        : 'border-white/15 bg-white/5 text-white/90',
                    ].join(' ')}
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {isAir && page.sharedFeaturesSection ? (
        <section
          id="shared-features"
          className="border-t border-black/10 bg-[#f5f5f7]"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#ff9f0a]">
              {page.sharedFeaturesSection.eyebrow}
            </p>
            <h2 className="mt-4 whitespace-pre-line text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] md:text-[40px] lg:text-[44px]">
              {page.sharedFeaturesSection.headline}
            </h2>
            <p className="mt-6 max-w-[720px] text-[17px] leading-[1.6] text-black/70 md:text-[19px]">
              {page.sharedFeaturesSection.lead}
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-stretch">
              {page.sharedFeaturesSection.items.map((item, i) => (
                <div
                  key={i}
                  className="flex min-h-[12rem] flex-col rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm md:min-h-[14rem]"
                >
                  <h3 className="text-[19px] font-semibold leading-snug text-[#1d1d1f]">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-black/70">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Tech specs */}
      <section
        id="tech-specs"
        className={[
          'border-t',
          techSpecsLight ? 'border-black/10 bg-white' : 'border-white/10 bg-black',
        ].join(' ')}
      >
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p
            className={[
              'text-[12px] font-semibold uppercase tracking-[0.16em]',
              techSpecsLight ? 'text-black/55' : 'text-white/60',
            ].join(' ')}
          >
            {page.whatsInTheBoxImage ? "What's in the Box" : 'Tech Specs'}
          </p>
          {page.whatsInTheBoxImage ? (
            <>
              <div className="mt-10">
                <div
                  className={[
                    'relative aspect-[1024/537] w-full overflow-hidden rounded-3xl border bg-white shadow-sm',
                    techSpecsLight ? 'border-black/10' : 'border-white/10',
                  ].join(' ')}
                >
                  <img
                    src={page.whatsInTheBoxImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <h2
                className={[
                  'mt-3 text-[34px] font-semibold tracking-[-0.03em]',
                  techSpecsLight ? 'text-[#1d1d1f]' : 'text-white',
                ].join(' ')}
              >
                The essentials.
              </h2>
              <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-stretch">
                <div
                  className={[
                    'flex h-full min-h-0 flex-col rounded-3xl border p-7',
                    techSpecsLight ? 'border-black/10 bg-black/[0.02]' : 'border-white/10 bg-white/5',
                  ].join(' ')}
                >
                  <SpecRow
                    variant={techSpecsLight ? 'light' : pageVariant}
                    label="Display"
                    value={spec?.display || spec?.screen || spec?.display_size}
                  />
                  <SpecRow
                    variant={techSpecsLight ? 'light' : pageVariant}
                    label="Chip"
                    value={spec?.chip || spec?.processor || spec?.soc}
                  />
                  <SpecRow
                    variant={techSpecsLight ? 'light' : pageVariant}
                    label="Camera"
                    value={spec?.camera || spec?.rear_camera || spec?.rearCamera}
                  />
                  <SpecRow
                    variant={techSpecsLight ? 'light' : pageVariant}
                    label="Battery"
                    value={spec?.battery_life || spec?.battery || spec?.video_playback}
                  />
                </div>
                <div
                  className={[
                    'flex h-full min-h-0 flex-col rounded-3xl border p-7',
                    techSpecsLight ? 'border-black/10 bg-black/[0.02]' : 'border-white/10 bg-white/5',
                  ].join(' ')}
                >
                  <SpecRow
                    variant={techSpecsLight ? 'light' : pageVariant}
                    label="Storage"
                    value={spec?.storage || spec?.base_storage || spec?.storage_options}
                  />
                  <SpecRow
                    variant={techSpecsLight ? 'light' : pageVariant}
                    label="Connectivity"
                    value={spec?.connectivity || spec?.wireless}
                  />
                  <SpecRow
                    variant={techSpecsLight ? 'light' : pageVariant}
                    label="Materials"
                    value={spec?.materials || spec?.frame}
                  />
                  <SpecRow
                    variant={techSpecsLight ? 'light' : pageVariant}
                    label="Notes"
                    value={specSlug ? `Specs source: ${specSlug}` : '—'}
                  />
                </div>
              </div>
            </>
          )}

          <div className="mt-10">
            <a
              href={buyHref}
              className="inline-flex rounded-full bg-[#0071e3] px-7 py-3 text-[13px] font-semibold text-white hover:bg-[#0064c8]"
            >
              Buy {page.name}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

