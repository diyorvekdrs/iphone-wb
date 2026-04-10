import { motion as Motion } from 'framer-motion'

export default function CTA() {
  return (
    <section
      id="cta"
      className="border-t border-neutral-200/80 bg-neutral-100 py-24 md:py-32"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[2rem] border border-neutral-200/90 bg-white px-8 py-16 shadow-[0_24px_80px_rgba(0,0,0,0.06)] md:px-16 md:py-20"
        >
          <h2
            id="cta-heading"
            className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl"
          >
            Ready for yours?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-neutral-600">
            Choose your finish. Trade in a device. Pick up today or get free delivery.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#/order"
              className="rounded-full bg-neutral-900 px-10 py-3.5 text-[15px] font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)] active:translate-y-0"
            >
              Shop iPhone
            </a>
            <a
              href="#features"
              className="rounded-full border border-neutral-300 bg-white px-10 py-3.5 text-[15px] font-medium text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
            >
              Compare models
            </a>
          </div>
        </Motion.div>
      </div>
    </section>
  )
}
