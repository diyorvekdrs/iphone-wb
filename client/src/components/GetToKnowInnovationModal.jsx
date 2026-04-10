import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion as Motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const PART1_BODY = (
  <>
    <span className="font-semibold text-[#1d1d1f]">Second to none.</span>{' '}
    iPhone is known for its iconic design and advanced materials — like iPhone 17 Pro, which has a
    heat-forged aluminum unibody and is built to deliver exceptional performance. And our thinnest
    iPhone ever, iPhone Air. Hardware and software are designed in tandem — like Dynamic Island,
    Camera Control, and the Action button.
  </>
)

const PART3_BODY = (
  <>
    <span className="font-semibold text-[#1d1d1f]">Ease of use.</span>{' '}
    We design our hardware and software together for a seamless experience. Want to share your
    contact info? Hold your iPhone close to theirs. New AirPods? It&apos;s a one-tap setup. And
    regular iOS updates keep your iPhone feeling new for years to come.
  </>
)

/** Mirrors full scroll content for assistive tech. */
const MODAL_SUMMARY =
  'Innovation: Beautiful and durable, by design. Second to none — iPhone design, iPhone 17 Pro, iPhone Air, Dynamic Island, Camera Control, Action button. ' +
  'Last phone standing: Ceramic Shield 2, splash resistance. ' +
  'Ease of use: hardware and software together, AirPods one-tap setup, iOS updates.'

function CardShell({ children, className = '' }) {
  return (
    <div
      className={[
        'overflow-hidden rounded-[20px] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] md:rounded-[24px]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export default function GetToKnowInnovationModal({ open, onClose }) {
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

  return createPortal(
    <AnimatePresence>
      {open ? (
        <Motion.div
          key="get-to-know-innovation"
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            aria-label="Dismiss dialog"
            onClick={onClose}
          />
          <Motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex h-[min(95vh,1020px)] w-full max-w-[min(100%,560px)] flex-col overflow-hidden rounded-[28px] bg-[#f5f5f7] shadow-[0_25px_80px_rgba(0,0,0,0.22)] sm:max-w-[640px] md:rounded-[32px] lg:max-w-[760px]"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.32, ease }}
          >
            <h2 id={titleId} className="sr-only">
              Get to know iPhone — Innovation
            </h2>
            <p className="sr-only">{MODAL_SUMMARY}</p>

            <div className="flex shrink-0 items-center justify-end bg-[#f5f5f7] px-3 pt-3 pb-1 md:px-5 md:pt-4">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-sm outline-none ring-offset-2 ring-offset-[#f5f5f7] hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-black"
                aria-label="Close"
              >
                <span className="text-[15px] font-light leading-none" aria-hidden>
                  ×
                </span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6 md:px-5 md:pb-8">
              <div className="flex flex-col gap-4 md:gap-5">
                {/* Part 1 — Innovation + hero */}
                <CardShell>
                  <div className="px-6 pb-8 pt-8 md:px-10 md:pb-10 md:pt-10">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#86868b]">
                      Innovation
                    </p>
                    <p className="mt-2 text-balance text-[28px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#1d1d1f] md:text-[36px] lg:text-[40px]">
                      Beautiful and durable, by design.
                    </p>
                    <div className="mt-6 rounded-[16px] bg-[#f5f5f7] p-5 md:mt-8 md:rounded-[20px] md:p-8">
                      <p className="text-left text-[16px] leading-[1.5] text-[#1d1d1f] md:text-[17px] md:leading-[1.55]">
                        {PART1_BODY}
                      </p>
                      <div className="mt-6 flex justify-center md:mt-8">
                        <img
                          src="/iphone-models/innovation-modal.png"
                          alt=""
                          className="h-auto w-full max-w-[480px] object-contain"
                          loading="eager"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>
                </CardShell>

                {/* Part 2 — Last phone standing (Ceramic Shield) */}
                <CardShell className="p-0">
                  <img
                    src="/iphone-models/get-to-know-innovation-part2-ceramic.png"
                    alt="Last phone standing — Ceramic Shield layers above iPhone display."
                    className="h-auto w-full select-none"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </CardShell>

                {/* Part 3 — Ease of use */}
                <CardShell>
                  <div className="px-6 pb-8 pt-8 md:px-10 md:pb-10 md:pt-10">
                    <p className="text-left text-[17px] leading-[1.55] text-[#1d1d1f] md:text-[19px] md:leading-[1.6]">
                      {PART3_BODY}
                    </p>
                    <div className="mt-6 flex justify-center md:mt-8">
                      <img
                        src="/iphone-models/third-card.png"
                        alt=""
                        className="h-auto w-full max-w-[420px] object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </CardShell>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
