import { useState } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const ACCORDION_ITEMS = [
  {
    id: 'mac',
    title: 'iPhone and Mac',
    body:
      'You can copy images, video, or text from your iPhone directly on your Mac, then paste into another app on your nearby Mac, as well as, answer calls or messages from your iPhone. And with iCloud, you can access your favorite files from either your iPhone or Mac.',
  },
  {
    id: 'watch',
    title: 'iPhone and Apple Watch',
    body:
      'Misplaced your iPhone? The latest Apple Watch models can show you its approximate distance and direction.13 To set up a group photo on your iPhone, join the group and use Apple Watch as a viewfinder to snap the shot. And when you take a call on your Apple Watch, just tap your iPhone to continue the conversation there.',
  },
  {
    id: 'airpods',
    title: 'iPhone and AirPods',
    body:
      'Set up AirPods on iPhone with just a tap. You’ll love Adaptive Audio, which automatically tailors the noise control for you to provide the best listening experience across different environments and interactions throughout the day.',
  },
]

export default function SignificantOthersSection() {
  const [openId, setOpenId] = useState('mac')
  const reduceMotion = useReducedMotion()
  return (
    <section
      className="bg-white py-14 md:py-20"
      aria-labelledby="significant-others-title"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Motion.h2
          id="significant-others-title"
          className="mb-6 text-left text-[40px] font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f] md:mb-8 md:text-[48px] lg:text-[56px]"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease }}
        >
          Significant others
        </Motion.h2>

        <div className="overflow-hidden rounded-[36px] bg-[#f5f5f7] p-8 md:grid md:min-h-[min(100%,520px)] md:grid-cols-2 md:items-stretch md:gap-12 md:p-12 lg:gap-16 lg:p-16">
          <div className="min-w-0 self-start md:pt-1">
            {ACCORDION_ITEMS.map((item, idx) => {
              const open = openId === item.id
              return (
                <Motion.div
                  key={item.id}
                  className="border-b border-black/[0.1] last:border-b-0"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(idx * 0.08, 0.24),
                    ease,
                  }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-left md:py-6"
                    aria-expanded={open}
                    aria-controls={`accordion-panel-${item.id}`}
                    id={`accordion-trigger-${item.id}`}
                    onClick={() => setOpenId(open ? null : item.id)}
                  >
                    <span className="text-[18px] font-semibold text-[#1d1d1f] md:text-[21px]">
                      {item.title}
                    </span>
                    <span
                      className={[
                        'inline-flex h-8 w-8 shrink-0 items-center justify-center text-[#1d1d1f] transition-transform duration-200',
                        open ? 'rotate-180' : 'rotate-0',
                      ].join(' ')}
                      aria-hidden
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={`accordion-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`accordion-trigger-${item.id}`}
                    className={[
                      'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    ].join(' ')}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="pb-5 pr-2 text-[16px] leading-relaxed text-[#1d1d1f]/75 md:pb-6 md:text-[17px]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Motion.div>
              )
            })}
          </div>

          <div className="mt-8 flex min-h-[220px] w-full flex-col justify-end md:mt-0 md:min-h-0">
            <div className="relative w-full">
              <img
                src="/iphone-models/significant-others-visual.png"
                alt="iPhone Mirroring on Mac: iPhone upright beside a MacBook with the mirrored window on screen"
                className="block h-auto w-full max-h-[280px] object-contain object-[left_bottom] sm:max-h-[320px] md:max-h-[min(440px,52vh)]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
