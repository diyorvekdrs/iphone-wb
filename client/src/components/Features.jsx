import { motion as Motion } from 'framer-motion'

const items = [
  {
    title: 'A18 Pro chip',
    body: 'The most advanced iPhone chip ever. Gaming, AI, and battery life — all pushed further.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 8v4l2 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Pro camera system',
    body: '48MP Fusion camera with stunning low light, macro, and next-level portraits.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="6"
          width="18"
          height="14"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 6V5a1 1 0 011-1h6a1 1 0 011 1v1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'All-day battery',
    body: 'Intelligent power management keeps you going from morning briefings to late-night edits.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="4"
          y="7"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M18 10h2a1 1 0 011 1v2a1 1 0 01-1 1h-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 11h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

const card = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Features() {
  return (
    <section
      id="features"
      className="border-t border-neutral-200/80 bg-neutral-50 py-24 md:py-32"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Motion.h2
          id="features-heading"
          className="text-center text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Built to stand out.
        </Motion.h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-neutral-600">
          Every detail refined — from the titanium frame to the brightest display we’ve ever made.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-10">
          {items.map((item, i) => (
            <Motion.article
              key={item.title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={card}
              className="group rounded-3xl border border-neutral-200/90 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-neutral-100 p-3 text-neutral-900 transition-transform group-hover:scale-105">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-neutral-950">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                {item.body}
              </p>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
