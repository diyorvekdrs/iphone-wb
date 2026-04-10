import { motion as Motion } from 'framer-motion'

import { iphoneModels } from '../data/iphoneModels.js'
import { staggerFast, textFadeUp } from '../motion/textVariants.js'
import { iphonePageHref } from '../utils/iphoneRoutes.js'

const productLinks = iphoneModels
  .filter((m) => !m.isAction)
  .map((m) => ({ label: m.name, href: iphonePageHref(m.id) }))

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'Store home', href: '#/' },
      { label: 'Compare iPhone', href: '#/compare' },
      { label: 'Basket', href: '#/basket' },
      { label: 'Checkout', href: '#/payment' },
      { label: 'Order processing', href: '#/order' },
      ...productLinks,
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', href: '#/' },
      { label: 'Shipping & delivery', href: '#/' },
      { label: 'Returns', href: '#/' },
      { label: 'Contact support', href: '#/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '#/' },
      { label: 'Careers', href: '#/' },
      { label: 'Newsroom', href: '#/' },
      { label: 'Admin dashboard', href: '#/admin' },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      id="cta"
      className="border-t border-neutral-200 bg-neutral-50 py-14 text-[12px] text-neutral-500"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Motion.div
          className="grid gap-10 sm:grid-cols-2 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerFast}
        >
          <Motion.div
            className="sm:col-span-2 md:col-span-1"
            variants={textFadeUp}
            custom={0}
          >
            <p className="text-[13px] font-semibold text-neutral-800">iPhone Store</p>
            <p className="mt-3 max-w-xs leading-relaxed">
              Shop the latest iPhone lineup — clean layout, full product pages, and checkout tied to our
              catalog.
            </p>
          </Motion.div>
          {columns.map((col, i) => (
            <Motion.div key={col.title} variants={textFadeUp} custom={i + 1}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <a
                      href={link.href}
                      className="text-neutral-600 transition-colors hover:text-neutral-900"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Motion.div>
          ))}
        </Motion.div>
        <Motion.div
          className="mt-12 flex flex-col gap-6 border-t border-neutral-200 pt-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="max-w-4xl text-[11px] leading-relaxed text-neutral-500">
            This is an educational project and is not affiliated with Apple Inc. All trademarks and media
            belong to their respective owners.
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>Copyright © {new Date().getFullYear()} IT BALL Store. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              <a href="#/privacy" className="transition-colors hover:text-neutral-800">
                Privacy Policy
              </a>
              <a href="#/terms" className="transition-colors hover:text-neutral-800">
                Terms of Use
              </a>
              <a href="#" className="transition-colors hover:text-neutral-800">
                Site Map
              </a>
            </div>
          </div>
        </Motion.div>
      </div>
    </footer>
  )
}
