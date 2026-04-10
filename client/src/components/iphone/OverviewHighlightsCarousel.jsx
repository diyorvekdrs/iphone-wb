import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

/** Full-bleed background clip; plays when the slide is active, pauses at end until the slide is active again (then restarts). */
function SlideBackgroundVideo({ src, poster, isActive, playMedia }) {
  const ref = useRef(null)
  const wasActiveRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const run = isActive && playMedia
    if (run) {
      if (!wasActiveRef.current) {
        el.currentTime = 0
      }
      void el.play().catch(() => {})
    } else {
      el.pause()
    }
    wasActiveRef.current = isActive
  }, [isActive, playMedia])

  const onEnded = useCallback(() => {
    ref.current?.pause()
  }, [])

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full scale-[1.01] object-cover object-center"
      poster={poster}
      src={src}
      muted
      playsInline
      preload="metadata"
      aria-hidden
      onEnded={onEnded}
    />
  )
}

const mediaClass =
  'mx-auto max-h-[min(54vh,560px)] w-full object-contain md:max-h-[min(60vh,640px)]'

const mediaClassCompact =
  'mx-auto h-full max-h-full w-full object-contain object-center'

const sequentialVideoClass =
  'absolute left-0 right-0 top-0 z-0 mx-auto max-h-[min(54vh,560px)] w-full object-contain md:max-h-[min(60vh,640px)]'

const sequentialVideoClassCompact =
  'absolute left-0 right-0 top-0 z-0 mx-auto h-full max-h-full w-full object-contain object-center'

function SlideSequentialVideos({ urls, poster, isActive, playMedia, compact = false }) {
  const [phase, setPhase] = useState(0)
  const v0Ref = useRef(null)
  const v1Ref = useRef(null)

  const [src0, src1] = urls

  useEffect(() => {
    if (!isActive) {
      const v0 = v0Ref.current
      const v1 = v1Ref.current
      v0?.pause()
      v1?.pause()
      if (v0) v0.currentTime = 0
      if (v1) v1.currentTime = 0
      const id = window.requestAnimationFrame(() => setPhase(0))
      return () => window.cancelAnimationFrame(id)
    }
    return undefined
  }, [isActive])

  useEffect(() => {
    const v0 = v0Ref.current
    const v1 = v1Ref.current
    if (!isActive) {
      v0?.pause()
      v1?.pause()
      return
    }
    if (!playMedia) {
      v0?.pause()
      v1?.pause()
      return
    }
    if (phase === 0) {
      if (v0) v0.currentTime = 0
      if (v1) {
        v1.currentTime = 0
        v1.pause()
      }
      void v0?.play().catch(() => {})
    } else {
      void v1?.play().catch(() => {})
    }
  }, [isActive, playMedia, phase])

  const onFirstEnded = useCallback(() => {
    v0Ref.current?.pause()
    setPhase(1)
  }, [])

  const onSecondEnded = useCallback(() => {
    v1Ref.current?.pause()
  }, [])

  if (!src0 || !src1) return null

  const wrapClass = compact
    ? 'relative mx-auto h-full min-h-0 w-full'
    : 'relative mx-auto min-h-[min(48vh,480px)] w-full md:min-h-[min(52vh,560px)]'
  const vidClass = compact ? sequentialVideoClassCompact : sequentialVideoClass

  return (
    <div className={wrapClass}>
      <video
        ref={v0Ref}
        className={[
          vidClass,
          phase === 0 ? 'z-10' : 'invisible',
        ].join(' ')}
        poster={poster}
        muted
        playsInline
        preload="auto"
        aria-label=""
        onEnded={onFirstEnded}
      >
        <source src={src0} type="video/mp4" />
      </video>
      <video
        ref={v1Ref}
        className={[
          vidClass,
          phase === 1 ? 'z-10' : 'invisible',
        ].join(' ')}
        poster={poster}
        muted
        playsInline
        preload="auto"
        aria-label=""
        onEnded={onSecondEnded}
      >
        <source src={src1} type="video/mp4" />
      </video>
    </div>
  )
}

function SlideMedia({ slide, isActive, playMedia = true, compact = false }) {
  const videoRef = useRef(null)
  const wasActiveRef = useRef(false)
  const mClass = compact ? mediaClassCompact : mediaClass

  const onVideoEnded = useCallback(() => {
    videoRef.current?.pause()
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const run = isActive && playMedia
    if (run) {
      if (!wasActiveRef.current) {
        el.currentTime = 0
      }
      void el.play().catch(() => {})
    } else {
      el.pause()
    }
    wasActiveRef.current = isActive
  }, [isActive, playMedia])

  if (Array.isArray(slide.videos) && slide.videos.length >= 2) {
    return (
      <SlideSequentialVideos
        key={isActive && playMedia ? 'on' : 'off'}
        urls={slide.videos}
        poster={slide.image}
        isActive={isActive}
        playMedia={playMedia}
        compact={compact}
      />
    )
  }

  if (slide.video) {
    return (
      <video
        ref={videoRef}
        className={mClass}
        poster={slide.image}
        muted
        playsInline
        preload="metadata"
        aria-label=""
        onEnded={onVideoEnded}
      >
        <source src={slide.video} type="video/mp4" />
      </video>
    )
  }

  if (slide.image) {
    return (
      <img
        src={slide.image}
        alt=""
        className={mClass}
        loading="lazy"
        decoding="async"
      />
    )
  }

  return null
}

export default function OverviewHighlightsCarousel({
  slides = [],
  buyHref = '#/order',
  watchFilmHref = null,
  autoplayMs = 6500,
  variant = 'dark',
  /** When variant is dark, still use light (dark-on-white) chrome — heading, chips, dots — on a white section. */
  lightChrome = false,
}) {
  const trackRef = useRef(null)
  const carouselRootRef = useRef(null)
  const firstCardRef = useRef(null)
  const activeIdxRef = useRef(0)
  const [sideInsetPx, setSideInsetPx] = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)
  const [autoplayOn, setAutoplayOn] = useState(true)
  /** When false, carousel is off-screen — do not call video.play() or the browser may scroll the page to the video. */
  const [playMedia, setPlayMedia] = useState(true)
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides])

  useLayoutEffect(() => {
    activeIdxRef.current = activeIdx
  }, [activeIdx])

  const scrollToIdx = useCallback(
    (idx, behavior = 'smooth') => {
      const track = trackRef.current
      if (!track || !safeSlides.length) return
      const i = clamp(idx, 0, safeSlides.length - 1)
      const cards = track.querySelectorAll(':scope > article')
      const card = cards[i]
      if (!card) return
      // Scroll only the carousel track — not scrollIntoView, which can scroll the page vertically.
      const viewport = track.clientWidth
      const maxLeft = Math.max(0, track.scrollWidth - viewport)
      const targetLeft =
        card.offsetLeft - viewport / 2 + card.offsetWidth / 2
      const left = clamp(targetLeft, 0, maxLeft)
      track.scrollTo({
        left,
        behavior: behavior === 'smooth' ? 'smooth' : 'auto',
      })
    },
    [safeSlides.length],
  )

  const recomputeSideInset = useCallback(() => {
    const card = firstCardRef.current
    if (!card) return
    const w = card.getBoundingClientRect().width
    const inset = Math.max(16, Math.round((window.innerWidth - w) / 2))
    setSideInsetPx(inset)
  }, [])

  useLayoutEffect(() => {
    recomputeSideInset()
    const card = firstCardRef.current
    const ro = new ResizeObserver(() => recomputeSideInset())
    if (card) ro.observe(card)
    window.addEventListener('resize', recomputeSideInset)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recomputeSideInset)
    }
  }, [recomputeSideInset, safeSlides.length])

  useLayoutEffect(() => {
    if (sideInsetPx <= 0) return
    scrollToIdx(activeIdxRef.current, 'auto')
  }, [sideInsetPx, scrollToIdx])

  useEffect(() => {
    const el = carouselRootRef.current
    if (!el) return
    const onIntersect = (entries) => {
      const entry = entries[0]
      if (!entry) return
      setPlayMedia(
        entry.isIntersecting && entry.intersectionRatio >= 0.12,
      )
    }
    const io = new IntersectionObserver(onIntersect, {
      threshold: [0, 0.05, 0.1, 0.12, 0.15, 0.2, 0.35, 0.5, 0.75, 1],
    })
    io.observe(el)
    return () => io.disconnect()
  }, [safeSlides.length])

  const onScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    const cards = el.querySelectorAll(':scope > article')
    let bestIdx = 0
    let bestDist = Number.POSITIVE_INFINITY
    for (let i = 0; i < cards.length; i += 1) {
      const c = cards[i]
      const r = c.getBoundingClientRect()
      const cCenter = r.left + r.width / 2
      const d = Math.abs(cCenter - center)
      if (d < bestDist) {
        bestDist = d
        bestIdx = i
      }
    }
    setActiveIdx(bestIdx)
  }, [])

  useEffect(() => {
    if (!autoplayOn || safeSlides.length < 2) return undefined
    const id = window.setInterval(() => {
      scrollToIdx((activeIdx + 1) % safeSlides.length)
    }, autoplayMs)
    return () => window.clearInterval(id)
  }, [autoplayOn, activeIdx, autoplayMs, safeSlides.length, scrollToIdx])

  if (!safeSlides.length) return null

  const hasTopicChips = safeSlides.some((s) => s.topic)
  const isLight = variant === 'light'
  const chromeLight = isLight || lightChrome
  const headingClass = chromeLight
    ? 'text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] md:text-[52px] lg:text-[56px]'
    : 'text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white md:text-[52px] lg:text-[56px]'
  const cardWidthClass = isLight
    ? 'w-[min(100vw-2rem,900px)] shrink-0 snap-center sm:w-[min(94vw,900px)] md:w-[min(88vw,1040px)] lg:w-[min(82vw,1180px)]'
    : 'min-w-[min(100%,calc(100vw-2rem))] shrink-0 snap-center sm:min-w-[min(92vw,760px)] md:min-w-[min(88vw,1000px)] lg:min-w-[min(82vw,1160px)]'
  const cardClass = isLight
    ? 'flex min-h-[680px] flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] md:min-h-[640px] md:rounded-[2.25rem]'
    : 'flex min-h-[640px] flex-col overflow-hidden rounded-[2rem] bg-black md:min-h-[720px] md:rounded-[2.25rem]'
  const captionClassStack = isLight
    ? 'max-w-[40rem] text-center text-balance text-[19px] font-semibold leading-snug tracking-[-0.01em] text-[#1d1d1f] md:text-[21px] lg:text-[24px]'
    : 'max-w-[40rem] text-center text-balance text-[19px] font-semibold leading-snug tracking-[-0.01em] text-white md:text-[21px] lg:text-[24px]'
  const captionClassSplit = [
    'max-w-[22rem] text-left text-balance text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#1d1d1f] sm:max-w-none',
    'md:text-[25px] lg:text-[29px]',
  ].join(' ')
  const captionClassSplitTopCenter = [
    'mx-auto w-full max-w-[52rem] text-center text-balance text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#1d1d1f]',
    'md:text-[28px] lg:text-[32px]',
  ].join(' ')
  /** Full-bleed photo/video behind caption — match dark-carousel contrast */
  const captionClassSplitTopCenterOnMedia = [
    'mx-auto w-full max-w-[52rem] text-center text-balance text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-white',
    'md:text-[28px] lg:text-[32px]',
  ].join(' ')
  const controlsClass = chromeLight
    ? 'flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-black/[0.06]'
    : 'flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 backdrop-blur'
  const dotInactive = chromeLight ? 'w-2 bg-black/30 hover:bg-black/45' : 'w-2 bg-white/35 hover:bg-white/55'
  const dotActive = chromeLight ? 'w-10 bg-black/50' : 'w-6 bg-white'
  const dividerClass = chromeLight ? 'mx-1 h-4 w-px bg-black/10' : 'mx-1 h-4 w-px bg-white/20'
  const toggleBtnClass = chromeLight
    ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black/70 shadow-sm ring-1 ring-black/[0.06] hover:bg-black/[0.03]'
    : 'ml-1 flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10'

  function renderCaption(text, layout, splitAlign = 'start', onMediaBackground = false) {
    const lines = String(text ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (layout === 'split') {
      const splitClass =
        splitAlign === 'center'
          ? onMediaBackground
            ? captionClassSplitTopCenterOnMedia
            : captionClassSplitTopCenter
          : captionClassSplit
      return (
        <p className={splitClass}>
          {lines.map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
        </p>
      )
    }
    return (
      <p className={[captionClassStack, 'whitespace-pre-line'].join(' ')}>{text}</p>
    )
  }

  return (
    <div
      ref={carouselRootRef}
      className={[
        'relative z-10 pb-14 pt-10 [overflow-anchor:none] md:pb-16 md:pt-14',
        isLight ? 'bg-[#f5f5f7]' : lightChrome ? 'bg-white' : '',
      ].join(' ')}
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className={headingClass}>
            Get the highlights.
          </h2>
          <div className="flex flex-wrap items-center gap-5 sm:justify-end">
            {watchFilmHref ? (
              <a
                href={watchFilmHref}
                className="inline-flex items-center gap-1.5 text-[17px] font-normal text-[#0066cc] hover:underline"
              >
                Watch the film
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] opacity-90">
                  ▶
                </span>
              </a>
            ) : null}
            <a
              href={buyHref}
              className="rounded-full bg-[#0071e3] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#0064c8]"
            >
              Buy
            </a>
          </div>
        </div>
      </div>

      {hasTopicChips ? (
        <div className="mx-auto mt-6 max-w-[1400px] px-4 md:px-8">
          <ul className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {safeSlides.map((s, i) => {
              if (!s.topic) return null
              const on = i === activeIdx
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoplayOn(false)
                      scrollToIdx(i)
                    }}
                    className={[
                      'rounded-full border px-3 py-1.5 text-[12px] font-medium tracking-[-0.01em] transition-colors md:text-[13px]',
                      chromeLight
                        ? on
                          ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#1d1d1f]'
                          : 'border-black/[0.12] bg-white text-[#1d1d1f] shadow-sm hover:border-black/25'
                        : on
                          ? 'border-white bg-white/15 text-white'
                          : 'border-white/20 bg-white/5 text-white/90 hover:bg-white/10',
                    ].join(' ')}
                  >
                    {s.topic}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      {/* Full-bleed track — no side gutters from a max-width wrapper */}
      <div
        className={[
          'relative left-1/2 w-[100vw] max-w-[100vw] -translate-x-1/2',
          hasTopicChips ? 'mt-6' : 'mt-8',
        ].join(' ')}
      >
        <div
          ref={trackRef}
          onScroll={onScroll}
          className={[
            'flex gap-4 overflow-x-auto overscroll-x-contain pb-4',
            'snap-x snap-mandatory',
            '[scrollbar-width:none] [-ms-overflow-style:none]',
            '[&::-webkit-scrollbar]:hidden',
          ].join(' ')}
        >
          <div
            aria-hidden
            className="shrink-0"
            style={{ width: sideInsetPx ? `${sideInsetPx}px` : 0 }}
          />
        {safeSlides.map((s, i) => {
          const darkVideoCover =
            !isLight &&
            Boolean(s.video) &&
            !(Array.isArray(s.videos) && s.videos.length >= 2)
          const darkImageCover =
            !isLight &&
            Boolean(s.backgroundImage) &&
            !s.video &&
            !(Array.isArray(s.videos) && s.videos.length >= 2)
          const darkFullBleed = darkVideoCover || darkImageCover
          return (
          <article
            key={s.key}
            ref={i === 0 ? firstCardRef : undefined}
            className={[
              cardWidthClass,
              cardClass,
              isLight && (s.backgroundVideo || s.backgroundImage)
                ? 'relative'
                : '',
              darkFullBleed ? 'relative' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {isLight && (s.backgroundVideo || s.backgroundImage) ? (
              <>
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
                  {s.backgroundImage ? (
                    <img
                      src={s.backgroundImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      draggable={false}
                      decoding="async"
                    />
                  ) : (
                    <SlideBackgroundVideo
                      src={s.backgroundVideo}
                      poster={s.image}
                      isActive={i === activeIdx}
                      playMedia={playMedia}
                    />
                  )}
                </div>
                <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col items-center justify-start px-6 pb-8 pt-8 sm:px-8 md:px-10 md:pb-10 md:pt-10 lg:px-12 lg:pt-12 [&_p]:[text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_2px_16px_rgba(0,0,0,0.35)]">
                  {renderCaption(s.caption, 'split', 'center', true)}
                </div>
              </>
            ) : isLight ? (
              <div className="grid h-full min-h-0 flex-1 grid-cols-1 content-center gap-6 p-6 sm:gap-8 md:grid-cols-2 md:gap-10 md:p-10 lg:p-12">
                <div className="flex min-h-[9.5rem] items-center justify-center md:min-h-0 md:items-center md:justify-start md:pl-2">
                  {renderCaption(s.caption, 'split')}
                </div>
                <div
                  className={[
                    'flex h-[360px] shrink-0 items-center justify-center sm:h-[400px] md:h-[440px] md:justify-end',
                    '[&_video]:mx-0 [&_video]:h-full [&_video]:max-h-full [&_video]:w-full [&_video]:object-contain',
                    '[&_img]:mx-0 [&_img]:h-full [&_img]:max-h-full [&_img]:w-full [&_img]:object-contain',
                  ].join(' ')}
                >
                  <SlideMedia
                    slide={s}
                    isActive={i === activeIdx}
                    playMedia={playMedia}
                    compact
                  />
                </div>
              </div>
            ) : darkFullBleed ? (
              <>
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
                  {darkVideoCover ? (
                    <SlideBackgroundVideo
                      src={s.video}
                      poster={s.image}
                      isActive={i === activeIdx}
                      playMedia={playMedia}
                    />
                  ) : (
                    <img
                      src={s.backgroundImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      draggable={false}
                      decoding="async"
                    />
                  )}
                </div>
                <div className="relative z-10 flex min-h-[7rem] w-full shrink-0 justify-center px-6 pb-6 pt-8 md:min-h-0 md:px-10 md:pb-8 md:pt-10 [&_p]:[text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_2px_16px_rgba(0,0,0,0.35)]">
                  {renderCaption(s.caption, 'stack')}
                </div>
              </>
            ) : (
              <>
                <div className="flex w-full shrink-0 justify-center px-6 pt-8 md:px-10 md:pt-10">
                  {renderCaption(s.caption, 'stack')}
                </div>
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-4 pt-6 md:px-6 md:pb-6 md:pt-8">
                  <SlideMedia
                    slide={s}
                    isActive={i === activeIdx}
                    playMedia={playMedia}
                  />
                </div>
              </>
            )}
          </article>
          )
        })}
          <div
            aria-hidden
            className="shrink-0"
            style={{ width: sideInsetPx ? `${sideInsetPx}px` : 0 }}
          />
        </div>
      </div>

      <div
        className={[
          'mt-6 flex justify-center px-4 md:px-8',
          chromeLight ? 'items-center gap-2' : '',
        ].join(' ')}
      >
        <div className={controlsClass}>
          <div className="flex items-center gap-1.5 px-1">
            {safeSlides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => scrollToIdx(i)}
                className={[
                  'h-2 rounded-full transition-all',
                  i === activeIdx ? dotActive : dotInactive,
                ].join(' ')}
              />
            ))}
          </div>
          {!chromeLight ? (
            <>
              <span className={dividerClass} aria-hidden />
              <button
                type="button"
                aria-label={autoplayOn ? 'Pause slideshow' : 'Play slideshow'}
                onClick={() => setAutoplayOn((v) => !v)}
                className={toggleBtnClass}
              >
                {autoplayOn ? (
                  <span className="flex gap-0.5">
                    <span className="h-3 w-0.5 rounded-sm bg-current" />
                    <span className="h-3 w-0.5 rounded-sm bg-current" />
                  </span>
                ) : (
                  <span className="text-[12px]">▶</span>
                )}
              </button>
            </>
          ) : null}
        </div>
        {chromeLight ? (
          <button
            type="button"
            aria-label={autoplayOn ? 'Pause slideshow' : 'Play slideshow'}
            onClick={() => setAutoplayOn((v) => !v)}
            className={toggleBtnClass}
          >
            {autoplayOn ? (
              <span className="flex gap-0.5">
                <span className="h-3 w-0.5 rounded-sm bg-current" />
                <span className="h-3 w-0.5 rounded-sm bg-current" />
              </span>
            ) : (
              <span className="text-[11px]">▶</span>
            )}
          </button>
        ) : null}
      </div>
    </div>
  )
}
