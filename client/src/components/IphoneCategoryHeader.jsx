import { motion as Motion, useReducedMotion } from 'framer-motion'
import { textBlurUp, textBlurUpReduced } from '../motion/textVariants.js'
import IphoneModelStrip from './IphoneModelStrip.jsx'

export default function IphoneCategoryHeader() {
  const reduceMotion = useReducedMotion()
  const headlineVariants = reduceMotion ? textBlurUpReduced : textBlurUp

  return (
    <section
      id="iphone-category"
      className="border-b border-black/[0.06] bg-white py-8 md:py-10"
      aria-labelledby="iphone-category-title"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-10 md:py-10 lg:px-12">
        <Motion.h1
          id="iphone-category-title"
          className="px-0.5 pb-0.5 text-[52px] font-semibold leading-[1.03] tracking-tight text-[#1d1d1f] md:text-[64px] lg:text-[72px]"
          variants={headlineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.9 }}
        >
          iPhone
        </Motion.h1>
        <div className="mt-6 md:mt-8">
          <IphoneModelStrip />
        </div>
      </div>
    </section>
  )
}
