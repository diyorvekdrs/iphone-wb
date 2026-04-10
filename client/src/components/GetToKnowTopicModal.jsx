import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion as Motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function GetToKnowTopicModal({
  open,
  onClose,
  eyebrow = '',
  headline = '',
  exactModel = '',
  lead = '',
  paragraphs = [],
  imageSrc = '',
}) {
  const titleId = useId()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      cancelAnimationFrame(t)
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  const summary = [eyebrow, headline, exactModel, lead, ...paragraphs].join(' ')

  return createPortal(
    <AnimatePresence>
      {open ? (
        <Motion.div
          key="get-to-know-topic"
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
            aria-label="Dismiss dialog"
            onClick={onClose}
          />
          <Motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex h-[min(96vh,1040px)] w-full max-w-[min(100%,600px)] flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.2)] sm:max-w-[680px] md:rounded-[36px] lg:max-w-[820px]"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.32, ease }}
          >
            <p className="sr-only">{summary}</p>

            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-black/[0.06] px-4 pb-3 pt-4 md:px-7 md:pb-4 md:pt-5">
              <div id={titleId} className="min-w-0 pr-2">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#86868b]">
                  {eyebrow}
                </p>
                <p className="mt-1 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1d1d1f] md:text-[26px] lg:text-[28px] whitespace-pre-line">
                  {headline}
                </p>
                {exactModel ? (
                  <p className="mt-2 text-[14px] font-semibold text-[#1d1d1f]/80 md:text-[15px]">
                    {exactModel}
                  </p>
                ) : null}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-sm outline-none ring-offset-2 ring-offset-white hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-black"
                aria-label="Close"
              >
                <span className="text-[15px] font-light leading-none" aria-hidden>
                  ×
                </span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white px-4 pb-6 pt-4 md:px-7 md:pb-8 md:pt-5">
              <div className="rounded-[24px] bg-[#f5f5f7] p-6 md:rounded-[28px] md:p-8 lg:p-10">
                {lead ? (
                  <p className="text-[17px] font-semibold leading-snug text-[#1d1d1f] md:text-[19px]">
                    {lead}
                  </p>
                ) : null}
                <div
                  className={[
                    'space-y-4 text-[16px] leading-[1.55] text-[#1d1d1f] md:text-[17px] md:leading-[1.6]',
                    lead ? 'mt-4' : '',
                  ].join(' ')}
                >
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {imageSrc ? (
                  <div className="mt-8 flex justify-center md:mt-10">
                    <img
                      src={imageSrc}
                      alt=""
                      className="h-auto max-h-[min(52vh,520px)] w-full max-w-[640px] object-contain"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
