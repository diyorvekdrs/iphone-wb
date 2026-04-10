import { motion as Motion } from 'framer-motion'

export default function ProductHighlight() {
  return (
    <section
      id="highlight"
      className="bg-white py-24 md:py-32"
      aria-labelledby="highlight-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-8">
        <Motion.div
          className="order-2 md:order-1"
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Display
          </p>
          <h2
            id="highlight-heading"
            className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl md:leading-[1.08]"
          >
            Super Retina XDR.{' '}
            <span className="text-neutral-400">Brighter than bright.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-neutral-600">
            Peak brightness for HDR that pops. ProMotion up to 120Hz for fluid scrolling
            and responsive touch. Ceramic Shield front glass — tougher where it matters.
          </p>
          <ul className="mt-8 space-y-3 text-[15px] text-neutral-700">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
              Always-On display with smart dimming
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
              True Tone for comfortable viewing anywhere
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
              Dynamic Island keeps notifications glanceable
            </li>
          </ul>
        </Motion.div>

        <Motion.div
          className="order-1 md:order-2"
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="overflow-hidden rounded-[2rem] bg-neutral-100 shadow-[0_24px_80px_rgba(0,0,0,0.1)] md:rounded-[2.5rem]">
            <img
              src="https://images.unsplash.com/photo-1611472173362-8073bdb6e17a?auto=format&fit=crop&w=1200&q=80"
              alt="Close-up of smartphone display and interface"
              className="aspect-[4/5] w-full object-cover md:aspect-square"
              width={1200}
              height={1200}
              loading="lazy"
            />
          </div>
        </Motion.div>
      </div>
    </section>
  )
}
