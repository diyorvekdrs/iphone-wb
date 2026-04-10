import { motion as Motion } from 'framer-motion'
import { iphoneModels } from '../data/iphoneModels.js'
import ModelThumb from './ModelThumb.jsx'
import { iphonePageHref } from '../utils/iphoneRoutes.js'

const newColor = '#bf4800'

export default function IphoneModelStrip() {
  return (
    <div className="w-full px-1 py-1 md:px-2">
      <div
        className="scrollbar-hide flex justify-center gap-6 overflow-x-auto pb-3 pt-3 md:gap-8 lg:gap-10"
        role="list"
        aria-label="iPhone models"
      >
        {iphoneModels.map((model, i) => (
          <Motion.a
            key={model.id}
            role="listitem"
            href={model.isAction ? '#/compare' : iphonePageHref(model.id)}
            className="group flex min-w-[5.5rem] shrink-0 flex-col items-center px-2 text-center md:min-w-0 md:px-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{
              delay: Math.min(i * 0.02, 0.6),
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="w-full max-w-[6rem] transition-transform duration-300 group-hover:scale-[1.03]">
              <ModelThumb model={model} paletteIndex={i} />
            </div>
            <Motion.p
              className="mt-1.5 text-[11px] font-semibold leading-tight text-[#1d1d1f] md:text-[13px]"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: Math.min(i * 0.04, 0.35) + 0.12,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {model.name}
            </Motion.p>
            {model.badge && (
              <Motion.span
                className="mt-0.5 text-[10px] font-normal md:text-[11px]"
                style={{ color: newColor }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: Math.min(i * 0.04, 0.35) + 0.2,
                  duration: 0.35,
                }}
              >
                {model.badge}
              </Motion.span>
            )}
          </Motion.a>
        ))}
      </div>
    </div>
  )
}
