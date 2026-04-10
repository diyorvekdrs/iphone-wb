import { motion as Motion, useReducedMotion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section
      className="relative overflow-hidden bg-white pb-16 pt-16 md:pb-24 md:pt-20"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-6xl px-6 text-center md:px-8">
        <Motion.p
          custom={0}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500"
        >
          New
        </Motion.p>
        <Motion.h1
          id="hero-heading"
          custom={1}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mx-auto max-w-4xl text-balance text-5xl font-semibold tracking-tight text-neutral-950 md:text-7xl md:leading-[1.05]"
        >
          iPhone 16 Pro
        </Motion.h1>
        <Motion.p
          custom={2}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mx-auto mt-5 max-w-xl text-lg text-neutral-600 md:text-xl"
        >
          Titanium. So strong. So light. So Pro.
        </Motion.p>
        <Motion.div
          custom={3}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#/order"
            className="rounded-full bg-neutral-900 px-8 py-3 text-[15px] font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:translate-y-0"
          >
            Buy
          </a>
          <a
            href="#features"
            className="rounded-full border border-neutral-300 bg-white px-8 py-3 text-[15px] font-medium text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          >
            Learn more
          </a>
        </Motion.div>
      </div>

      <Motion.div
        className="relative mx-auto mt-14 max-w-4xl px-4 md:mt-20"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-neutral-100 shadow-[0_24px_80px_rgba(0,0,0,0.12)] md:aspect-[16/10] md:rounded-[2.5rem]">
          <img
            src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1600&q=80"
            alt="iPhone product showcase on a minimal background"
            className="h-full w-full object-cover object-center"
            width={1600}
            height={1000}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </Motion.div>
    </section>
  )
}
