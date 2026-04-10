import { useState } from 'react'
import {
  AnimatePresence,
  motion as Motion,
} from 'framer-motion'
import { globalNavLinks } from '../data/iphoneModels.js'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, loading, logout } = useAuth()
  const { paymentQueueCount } = useCart()

  const accountLabel =
    user?.role === 'super_admin'
      ? user.displayName ?? user.username
      : user?.email

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.08] bg-[#f5f5f7]">
      <nav
        className="mx-auto flex h-11 max-w-[1024px] items-center justify-between px-4 md:px-6"
        aria-label="Global"
      >
        <a
          href="#/"
          className="flex h-11 shrink-0 items-center text-[17px] font-semibold tracking-tight text-[#1d1d1f] opacity-90 transition-opacity hover:opacity-60"
          aria-label="iPhone — home"
        >
          iPhone
        </a>

        <ul className="scrollbar-hide mx-4 hidden h-11 min-w-0 flex-1 items-center justify-center gap-x-6 overflow-x-auto text-[12px] text-[#1d1d1f]/90 lg:flex xl:gap-x-8">
          {globalNavLinks.map((item) => (
            <li key={item.label} className="shrink-0">
              <a
                href={item.href}
                className="whitespace-nowrap transition-colors hover:text-[#1d1d1f]"
              >
                {item.label}
              </a>
            </li>
          ))}
          {!loading && user?.role === 'user' ? (
            <li className="shrink-0">
              <a
                href="#/orders"
                className="whitespace-nowrap transition-colors hover:text-[#1d1d1f]"
              >
                Orders
              </a>
            </li>
          ) : null}
        </ul>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <a
            href="#/payment"
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[#1d1d1f] transition hover:bg-black/[0.06]"
            aria-label={
              paymentQueueCount > 0
                ? `Payment queue, ${paymentQueueCount} items`
                : 'Payment queue'
            }
          >
            <svg
              className="h-[22px] w-[22px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {paymentQueueCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#0071e3] px-1 text-[10px] font-bold leading-none text-white">
                {paymentQueueCount > 99 ? '99+' : paymentQueueCount}
              </span>
            ) : null}
          </a>
          {!loading && user ? (
            <>
              <span
                className="hidden max-w-[100px] truncate text-[11px] text-[#1d1d1f]/75 md:inline"
                title={accountLabel}
              >
                {accountLabel}
              </span>
              {user.role === 'super_admin' ? (
                <a
                  href="#/admin"
                  className="hidden rounded-full px-2 py-1.5 text-[11px] font-medium text-[#0066cc] transition hover:underline sm:inline-flex"
                >
                  Dashboard
                </a>
              ) : null}
              <button
                type="button"
                className="hidden rounded-full px-2.5 py-1.5 text-[11px] font-medium text-[#1d1d1f]/90 transition hover:text-[#1d1d1f] sm:inline-flex"
                onClick={() => {
                  void logout()
                }}
              >
                Sign out
              </button>
            </>
          ) : !loading ? (
            <a
              href="#/login"
              className="hidden rounded-full px-2.5 py-1.5 text-[11px] font-medium text-[#1d1d1f]/90 transition hover:text-[#1d1d1f] sm:inline-flex"
            >
              Sign in
            </a>
          ) : null}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#1d1d1f] lg:hidden"
            aria-expanded={open}
            aria-controls="global-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <Motion.div
            id="global-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-black/[0.08] bg-[#f5f5f7] lg:hidden"
          >
            <ul className="flex max-h-[70vh] flex-col gap-0 overflow-y-auto px-4 py-3">
              <li>
                <a
                  href="#/payment"
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-[17px] text-[#1d1d1f] hover:bg-black/[0.04]"
                  onClick={() => setOpen(false)}
                >
                  <span>Bag</span>
                  {paymentQueueCount > 0 ? (
                    <span className="rounded-full bg-[#0071e3] px-2 py-0.5 text-[12px] font-semibold text-white">
                      {paymentQueueCount > 99 ? '99+' : paymentQueueCount}
                    </span>
                  ) : null}
                </a>
              </li>
              {globalNavLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="block rounded-lg px-3 py-3 text-[17px] text-[#1d1d1f] hover:bg-black/[0.04]"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              {!loading && user?.role === 'user' ? (
                <li>
                  <a
                    href="#/orders"
                    className="block rounded-lg px-3 py-3 text-[17px] text-[#1d1d1f] hover:bg-black/[0.04]"
                    onClick={() => setOpen(false)}
                  >
                    Orders
                  </a>
                </li>
              ) : null}
              {!loading && user ? (
                <>
                  <li className="border-t border-black/[0.06] px-3 py-2 text-[13px] text-[#6e6e73]">
                    {accountLabel}
                  </li>
                  {user.role === 'super_admin' ? (
                    <li>
                      <a
                        href="#/admin"
                        className="block rounded-lg px-3 py-3 text-[17px] text-[#0066cc] hover:bg-black/[0.04]"
                        onClick={() => setOpen(false)}
                      >
                        Dashboard
                      </a>
                    </li>
                  ) : null}
                  <li>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-3 text-left text-[17px] text-[#1d1d1f] hover:bg-black/[0.04]"
                      onClick={() => {
                        setOpen(false)
                        void logout()
                      }}
                    >
                      Sign out
                    </button>
                  </li>
                </>
              ) : !loading ? (
                <li>
                  <a
                    href="#/login"
                    className="block rounded-lg px-3 py-3 text-[17px] text-[#1d1d1f] hover:bg-black/[0.04]"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </a>
                </li>
              ) : null}
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
