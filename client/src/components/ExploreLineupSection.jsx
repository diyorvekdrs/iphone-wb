import { useMemo, useState } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { iphoneModels } from '../data/iphoneModels.js'
import {
  buildTaglineFromSpec,
  defaultTagline,
  swatchesFor,
  taglineById,
} from '../data/exploreLineup.js'
import { useIphoneSpecs } from '../hooks/useIphoneSpecs.js'
import { iphonePageHref } from '../utils/iphoneRoutes.js'

const link = 'text-[14px] font-normal text-[#0066cc] hover:underline'

const titleWords = ['Explore', 'the', 'lineup.']

const easeOut = [0.22, 1, 0.36, 1]

export default function ExploreLineupSection() {
  const reduceMotion = useReducedMotion()
  const { bySlug } = useIphoneSpecs()
  const lineupModels = useMemo(
    () => iphoneModels.filter((m) => !m.isAction),
    [],
  )
  const exploreLineup = useMemo(
    () =>
      lineupModels.map((m) => ({
        id: m.id,
        name: m.name,
        isNew: m.badge === 'New',
        image: m.image,
        swatches: swatchesFor(m.id),
        tagline:
          buildTaglineFromSpec(bySlug[m.id]) ?? taglineById[m.id] ?? defaultTagline,
      })),
    [bySlug, lineupModels],
  )
  const [swatchIdx, setSwatchIdx] = useState(() =>
    Object.fromEntries(lineupModels.map((c) => [c.id, 0])),
  )

  const wordDelay = reduceMotion ? 0.03 : 0.16
  const dustDuration = reduceMotion ? 0.35 : 1.05
  const linkDelay = reduceMotion ? 0.08 : titleWords.length * wordDelay + 0.22

  const dustInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, filter: 'blur(14px)', y: 40 }
  const dustAnimate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, filter: 'blur(0px)', y: 0 }

  const cardInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 72 }
  const cardAnimate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 }

  /** `amount: 'some'` = any overlap with the viewport (required for very wide carousels). */
  const headerViewport = {
    once: true,
    amount: 'some',
    margin: '0px 0px -10% 0px',
  }
  const cardsViewport = {
    once: true,
    amount: 'some',
    margin: '0px 0px -15% 0px',
  }

  return (
    <section
      id="explore-lineup"
      className="border-b border-black/[0.06] bg-white py-10 md:py-12"
      aria-labelledby="explore-lineup-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end md:mb-8">
          <h2
            id="explore-lineup-heading"
            className="flex flex-wrap items-baseline gap-x-[0.22em] text-[32px] font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f] md:text-[40px] lg:text-[44px]"
          >
            {titleWords.map((word, i) => (
              <Motion.span
                key={`${word}-${i}`}
                className="inline-block"
                initial={dustInitial}
                whileInView={dustAnimate}
                viewport={headerViewport}
                transition={{
                  duration: dustDuration,
                  ease: easeOut,
                  delay: i * wordDelay,
                }}
              >
                {word}
              </Motion.span>
            ))}
          </h2>
          <Motion.a
            href="#/compare"
            className={`${link} shrink-0 pb-0.5`}
            initial={dustInitial}
            whileInView={dustAnimate}
            viewport={headerViewport}
            transition={{
              duration: dustDuration,
              ease: easeOut,
              delay: linkDelay,
            }}
          >
            Compare all models&nbsp;&gt;
          </Motion.a>
        </div>

        <Motion.div
          className="scrollbar-hide flex gap-3 overflow-x-auto pb-3 pt-2 md:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={cardsViewport}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0.035 : 0.1,
                delayChildren: reduceMotion ? 0.08 : 0.38,
              },
            },
          }}
        >
          {exploreLineup.map((item) => {
            const active = swatchIdx[item.id] ?? 0
            return (
              <Motion.article
                key={item.id}
                className="flex w-[min(100%,280px)] shrink-0 flex-col rounded-[24px] bg-[#f5f5f7] p-5 md:w-[300px] md:p-6"
                variants={{
                  hidden: cardInitial,
                  visible: {
                    ...cardAnimate,
                    transition: {
                      duration: reduceMotion ? 0.32 : 0.75,
                      ease: easeOut,
                    },
                  },
                }}
              >
                <a
                  href={iphonePageHref(item.id)}
                  className="flex min-h-[168px] items-center justify-center rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 md:min-h-[200px]"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="max-h-[180px] w-full max-w-[170px] object-contain md:max-h-[210px]"
                    loading="lazy"
                    decoding="async"
                  />
                </a>

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {item.swatches.map((s, i) => (
                    <button
                      key={`${item.id}-${i}`}
                      type="button"
                      aria-label={s.label}
                      title={s.label}
                      className={[
                        'h-3.5 w-3.5 rounded-full ring-2 ring-offset-2 ring-offset-[#f5f5f7] transition-shadow',
                        i === active
                          ? 'ring-[#1d1d1f]'
                          : 'ring-transparent hover:ring-neutral-400',
                      ].join(' ')}
                      style={{ backgroundColor: s.color }}
                      onClick={() =>
                        setSwatchIdx((prev) => ({ ...prev, [item.id]: i }))
                      }
                    />
                  ))}
                </div>

                {item.isNew && (
                  <Motion.p
                    className="mt-3 text-center text-[11px] font-normal text-[#bf4800] md:text-[12px]"
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.35, ease: easeOut }}
                  >
                    New
                  </Motion.p>
                )}
                {!item.isNew && <div className="mt-3 h-[16px]" aria-hidden />}

                <Motion.h3
                  className="mt-1 text-center text-[20px] font-semibold tracking-tight text-[#1d1d1f] md:text-[22px]"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.45, ease: easeOut }}
                >
                  <a
                    href={iphonePageHref(item.id)}
                    className="text-inherit outline-none hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2"
                  >
                    {item.name}
                  </a>
                </Motion.h3>
                <Motion.p
                  className="mt-2 min-h-[2.75rem] text-center text-[14px] leading-snug text-[#1d1d1f]/80 md:min-h-[3rem] md:text-[15px]"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.06, ease: easeOut }}
                >
                  {item.tagline}
                </Motion.p>

                <Motion.div
                  className="mt-5 flex flex-col items-center gap-2.5"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: easeOut }}
                >
                  <a
                    href={iphonePageHref(item.id)}
                    className="rounded-full bg-[#0071e3] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#0077ed]"
                  >
                    Learn more
                  </a>
                  <a href={iphonePageHref(item.id)} className={link}>
                    Buy&nbsp;&gt;
                  </a>
                </Motion.div>
              </Motion.article>
            )
          })}
        </Motion.div>
      </div>
    </section>
  )
}
