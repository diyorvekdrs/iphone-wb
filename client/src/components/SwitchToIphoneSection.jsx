import { useState } from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import GetToKnowCamerasModal from './GetToKnowCamerasModal.jsx'
import GetToKnowChipBatteryModal from './GetToKnowChipBatteryModal.jsx'
import GetToKnowInnovationModal from './GetToKnowInnovationModal.jsx'
import GetToKnowTopicModal from './GetToKnowTopicModal.jsx'
import { getToKnowTopicModalContent } from '../data/getToKnowTopicModalContent.js'
import { iphoneModels } from '../data/iphoneModels.js'
import { iphonePageHref } from '../utils/iphoneRoutes.js'

const ease = [0.22, 1, 0.36, 1]

function modelNameForCard(modelId) {
  const id = String(modelId ?? '').trim()
  return iphoneModels.find((m) => m.id === id)?.name ?? id
}

function cardModelLabel(card) {
  if (!card) return ''
  return card.exactModel ?? modelNameForCard(card.modelId)
}

const cards = [
  {
    id: 'android-switch',
    modelId: '17-pro',
    eyebrow: 'Innovation',
    title: 'Beautiful and durable, by design.',
    theme: 'dark',
    image: '/iphone-models/first-card.png',
    fit: 'cover',
    textSize: 'xlarge',
  },
  {
    id: 'value',
    modelId: '17-pro-max',
    eyebrow: 'Cutting-Edge Cameras',
    title: 'Picture your best\nphotos and videos.',
    theme: 'dark',
    image: '/iphone-models/second-card.png',
    fit: 'cover',
    textSize: 'medium',
  },
  {
    id: 'ios-ai',
    modelId: '17-pro',
    eyebrow: 'Chip and Battery Life',
    title: 'Fast that lasts.',
    theme: 'dark',
    image: '/iphone-models/third-card.png',
    fit: 'contain',
    containPosition: 'center',
    textSize: 'medium',
  },
  {
    id: 'privacy',
    modelId: '17',
    eyebrow: 'Privacy',
    title: 'Your data. Just where you want it.',
    theme: 'dark',
    image: '/iphone-models/fourth-card.png',
    fit: 'contain',
    containPosition: 'center',
    noImageOverlay: true,
    textSize: 'medium',
  },
  {
    id: 'camera',
    modelId: '17-pro',
    eyebrow: 'Cutting-Edge Cameras',
    title: 'Picture your best photos and videos.',
    theme: 'dark',
    image: '/iphone-models/fifth-card.png',
    fit: 'cover',
    textSize: 'medium',
  },
]

export default function SwitchToIphoneSection() {
  const reduceMotion = useReducedMotion()
  const [innovationModalOpen, setInnovationModalOpen] = useState(false)
  const [camerasModalOpen, setCamerasModalOpen] = useState(false)
  const [camerasModalExactModel, setCamerasModalExactModel] = useState(
    'iPhone 17 Pro Max',
  )
  const [topicModalId, setTopicModalId] = useState(null)
  const [chipBatteryModalOpen, setChipBatteryModalOpen] = useState(false)
  const [chipBatteryExactModel, setChipBatteryExactModel] = useState('iPhone 17 Pro')

  const topicCard = topicModalId
    ? cards.find((c) => c.id === topicModalId)
    : null
  const topicCopy =
    topicModalId && getToKnowTopicModalContent[topicModalId]
      ? getToKnowTopicModalContent[topicModalId]
      : null
  const topicModalOpen = Boolean(topicModalId && topicCard && topicCopy)

  return (
    <section className="bg-[#f5f5f7] py-14 md:py-16" aria-labelledby="switch-title">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Motion.h2
          id="switch-title"
          className="text-left text-[40px] font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f] md:text-[52px]"
          initial={
            reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(8px)' }
          }
          whileInView={
            reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }
          }
          viewport={{ once: true, amount: 'some', margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.55, ease }}
        >
          Get to know iPhone.
        </Motion.h2>

        <div className="scrollbar-hide mt-8 flex touch-pan-x gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2 md:mt-10">
          {cards.map((card, i) => {
            const dark = card.theme === 'dark'
            const modelLabel = cardModelLabel(card)
            const opensInnovationModal = card.id === 'android-switch'
            const opensCamerasModal =
              card.id === 'value' ||
              card.id === 'camera' ||
              (card.eyebrow === 'Cutting-Edge Cameras' &&
                /picture your best/i.test(String(card.title ?? '')))
            const opensChipBatteryModal =
              card.id === 'ios-ai' || card.eyebrow === 'Chip and Battery Life'
            const opensTopicModal = card.id === 'privacy'
            const a11yTitle = `${modelLabel}. ${card.title.replace('\n', ' ')}`
            const hitTargetClass = [
              'pointer-events-auto absolute bottom-0 right-0 z-[50] h-full w-full cursor-pointer rounded-[32px] outline-none transition-opacity hover:opacity-[0.97]',
              'focus-visible:ring-2 focus-visible:ring-offset-2',
              dark
                ? 'focus-visible:ring-white focus-visible:ring-offset-[#09090b]'
                : 'focus-visible:ring-[#0071e3] focus-visible:ring-offset-[#ececef]',
            ].join(' ')
            return (
              <Motion.article
                key={card.id}
                className={[
                  'group relative isolate h-[680px] w-[245px] shrink-0 overflow-hidden rounded-[32px] md:w-[380px]',
                  dark
                    ? 'bg-[#09090b] text-white'
                    : 'bg-[#ececef] text-[#1d1d1f]',
                ].join(' ')}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{
                  once: true,
                  amount: 'some',
                  margin: '0px 48px -15% 48px',
                }}
                transition={{ delay: Math.min(i * 0.05, 0.35), duration: 0.4 }}
              >
                {card.privacy ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center text-[130px] leading-none text-white/90"
                  >
                    
                  </div>
                ) : null}
                {card.image ? (
                  <img
                    src={card.image}
                    alt=""
                    draggable={false}
                    className={[
                      'pointer-events-none absolute inset-0 z-0 h-full w-full transition-transform duration-300 group-hover:scale-[1.02]',
                      card.imageClassName ?? '',
                      card.fit === 'contain'
                        ? card.containPosition === 'center'
                          ? 'object-contain object-center'
                          : 'object-contain object-bottom'
                        : 'object-cover object-[center_72%]',
                      'opacity-100',
                    ].join(' ')}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}

                <div
                  aria-hidden
                  className={[
                    'pointer-events-none absolute inset-0 z-[1]',
                    dark
                      ? card.image
                        ? card.noImageOverlay
                          ? 'bg-transparent'
                          : 'bg-black/35'
                        : 'bg-transparent'
                      : 'bg-gradient-to-b from-[#ececef]/98 via-[#ececef]/30 to-[#ececef]/0',
                  ].join(' ')}
                />

                <div className="pointer-events-none relative z-[2] flex h-full flex-col p-7">
                  <Motion.p
                    className={[
                      'text-[12px] font-semibold leading-none tracking-[-0.01em]',
                      dark ? 'text-white/75' : 'text-black/55',
                    ].join(' ')}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    {card.eyebrow}
                  </Motion.p>
                  <Motion.p
                    className={[
                      'mt-2 text-[13px] font-semibold leading-tight tracking-[-0.01em]',
                      dark ? 'text-white/90' : 'text-black/80',
                    ].join(' ')}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.4, delay: 0.02, ease }}
                  >
                    {modelLabel}
                  </Motion.p>
                  <Motion.h3
                    className={[
                      'mt-2.5 max-w-[14ch] whitespace-pre-line font-semibold tracking-[-0.02em] text-[28px] leading-[1.04]',
                    ].join(' ')}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.5, delay: 0.06, ease }}
                  >
                    {card.title}
                  </Motion.h3>
                  {card.subtitle ? (
                    <Motion.p
                      className="mt-3 text-[12px] text-white/78"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ delay: 0.15, duration: 0.35 }}
                    >
                      {card.subtitle}
                    </Motion.p>
                  ) : null}

                  <div
                    className={[
                      'mt-auto ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-[40px] leading-none transition-transform group-hover:scale-105',
                      dark
                        ? 'bg-white/85 text-black'
                        : 'bg-black/85 text-white',
                    ].join(' ')}
                    aria-hidden
                  >
                    <span className="-mt-1">+</span>
                  </div>
                </div>

                {opensInnovationModal ? (
                  <button
                    type="button"
                    className={hitTargetClass}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setInnovationModalOpen(true)
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={innovationModalOpen}
                    aria-label={`Get to know iPhone — ${a11yTitle}`}
                  />
                ) : opensCamerasModal ? (
                  <button
                    type="button"
                    className={hitTargetClass}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCamerasModalExactModel(modelLabel)
                      setCamerasModalOpen(true)
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={camerasModalOpen}
                    aria-label={`Get to know iPhone — ${a11yTitle}`}
                  />
                ) : opensChipBatteryModal ? (
                  <button
                    type="button"
                    className={hitTargetClass}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setChipBatteryExactModel(modelLabel)
                      setChipBatteryModalOpen(true)
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={chipBatteryModalOpen}
                    aria-label={`Get to know iPhone — ${a11yTitle}`}
                  />
                ) : opensTopicModal ? (
                  <button
                    type="button"
                    className={hitTargetClass}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setTopicModalId(card.id)
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={topicModalId === card.id}
                    aria-label={`Get to know iPhone — ${a11yTitle}`}
                  />
                ) : (
                  <a
                    href={iphonePageHref(card.modelId)}
                    className={hitTargetClass}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`View ${modelLabel} — ${card.title.replace('\n', ' ')}`}
                  />
                )}
              </Motion.article>
            )
          })}
        </div>
      </div>

      <GetToKnowInnovationModal
        open={innovationModalOpen}
        onClose={() => setInnovationModalOpen(false)}
      />
      <GetToKnowCamerasModal
        open={camerasModalOpen}
        onClose={() => setCamerasModalOpen(false)}
        exactModel={camerasModalExactModel}
      />
      <GetToKnowChipBatteryModal
        open={chipBatteryModalOpen}
        onClose={() => setChipBatteryModalOpen(false)}
        exactModel={chipBatteryExactModel}
      />
      <GetToKnowTopicModal
        open={topicModalOpen}
        onClose={() => setTopicModalId(null)}
        eyebrow={topicCard?.eyebrow ?? ''}
        headline={topicCard?.title ?? ''}
        exactModel={topicCard ? cardModelLabel(topicCard) : ''}
        lead={topicCopy?.lead ?? ''}
        paragraphs={topicCopy?.paragraphs ?? []}
        imageSrc={topicCard?.image ?? ''}
      />
    </section>
  )
}
