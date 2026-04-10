import { useMemo } from 'react'
import { motion as Motion } from 'framer-motion'

import { iphoneModels } from '../data/iphoneModels.js'
import { staggerFast, textFadeUp } from '../motion/textVariants.js'
import { iphonePageHref } from '../utils/iphoneRoutes.js'
import { useAuth } from '../hooks/useAuth.js'

export default function Footer() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'super_admin'

  const productLinks = useMemo(() => {
    return iphoneModels
      .filter((m) => !m.isAction)
      .map((m) => ({ label: m.name, href: iphonePageHref(m.id) }))
  }, [])

  const columns = useMemo(() => {
    const cols = [
      {
        title: 'Shop',
        links: [
          { label: 'Store Home', href: '#/' },
          { label: 'Compare iPhone', href: '#/compare' },
          ...productLinks,
        ],
      },
      {
        title: 'Account',
        links: [
          { label: 'Shopping Cart', href: '#/basket' },
          { label: 'Your Orders', href: '#/orders' },
          { label: 'Account Profile', href: '#/account' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About iPhone', href: '#/' },
          { label: 'Newsroom', href: '#/' },
        ],
      },
    ]

    if (isAdmin) {
      cols[2].links.push({ label: 'Admin Dashboard', href: '#/admin' })
    }

    return cols
  }, [isAdmin, productLinks])

  return (
    <footer
      id="cta"
      className="border-t border-neutral-200 bg-[#f5f5f7] py-14 text-[12px] text-[#86868b]"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerFast}
        >
          <Motion.div
            className="sm:col-span-1"
            variants={textFadeUp}
            custom={0}
          >
            <p className="text-[14px] font-semibold text-[#1d1d1f]">iPhone Store</p>
            <p className="mt-4 max-w-xs leading-relaxed text-[#6e6e73]">
              Experience the future today. Discover the most advanced iPhone lineup ever and redefine what's possible with the touch of a button.
            </p>
          </Motion.div>
          {columns.map((col, i) => (
            <Motion.div key={col.title} variants={textFadeUp} custom={i + 1}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <a
                      href={link.href}
                      className="text-[#86868b] transition-colors hover:text-[#1d1d1f] hover:underline"
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
          className="mt-14 flex flex-col gap-6 border-t border-black/[0.1] pt-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-[#86868b]">Copyright © {new Date().getFullYear()} iPhone Store. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#/privacy" className="text-[#6e6e73] transition-colors hover:text-[#1d1d1f] hover:underline">
                Privacy Policy
              </a>
              <a href="#/terms" className="text-[#6e6e73] transition-colors hover:text-[#1d1d1f] hover:underline">
                Terms of Use
              </a>
              <a href="#/sla" className="text-[#6e6e73] transition-colors hover:text-[#1d1d1f] hover:underline">
                SLA
              </a>
              <a href="#/shipping" className="text-[#6e6e73] transition-colors hover:text-[#1d1d1f] hover:underline">
                Shipping & Delivery
              </a>
              <a href="#" className="text-[#6e6e73] transition-colors hover:text-[#1d1d1f] hover:underline">
                Site Map
              </a>
            </div>
          </div>
        </Motion.div>
      </div>
    </footer>
  )
}
