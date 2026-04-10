/**
 * Privacy Policy for iPhone Store.
 */
export default function PrivacyPolicyPage() {
  const updated = 'April 10, 2026'

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-11 text-[#1d1d1f]">
      <div className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">
        <p className="text-[12px] font-medium uppercase tracking-wide text-[#6e6e73]">
          Legal
        </p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-tight md:text-[40px]">
          Privacy policy
        </h1>
        <p className="mt-2 text-[14px] text-[#6e6e73]">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-[#424245]">

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Who we are</h2>
            <p className="mt-2">
              This website is operated as <strong className="font-medium text-[#1d1d1f]">iPhone Store</strong>{' '}
              (the “Store,” “we,” or “us”). When this policy says “you,” it means anyone who visits the site,
              creates an account, or places an order.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">What we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="font-medium text-[#1d1d1f]">Account information.</strong> If you register,
                we may store your name, email address, and a secured password hash so you can sign in.
              </li>
              <li>
                <strong className="font-medium text-[#1d1d1f]">Order information.</strong> When you checkout,
                we process items in your cart, totals, shipping or notes you provide, and link orders to your
                account where applicable.
              </li>
              <li>
                <strong className="font-medium text-[#1d1d1f]">Payment-related data.</strong> Card payments
                may be processed by our payment partner (e.g. Stripe). We typically do not store full card
                numbers on our servers; payment details are handled according to the provider’s terms and
                security standards.
              </li>
              <li>
                <strong className="font-medium text-[#1d1d1f]">Technical data.</strong> Like most sites, our
                servers may receive basic technical information such as IP address, browser type, and dates/times
                of requests when you use the Store.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">How we use information</h2>
            <p className="mt-2">We use the information above to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Create and manage customer accounts;</li>
              <li>Process and fulfill orders, and communicate about your orders;</li>
              <li>Operate, secure, and improve the Store;</li>
              <li>Meet legal obligations where required.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Cookies and similar technologies</h2>
            <p className="mt-2">
              We may use cookies or similar technologies (for example, to keep you signed in). You can control
              cookies through your browser settings. If you block cookies, parts of the Store may not work as
              expected.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Sharing of information</h2>
            <p className="mt-2">
              We do not sell your personal information. We may share information with service providers who
              help us run the Store (such as payment processing), when required by law, or to protect rights
              and safety.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Retention</h2>
            <p className="mt-2">
              We keep information only as long as needed for the purposes above, unless a longer period is
              required by law.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Security</h2>
            <p className="mt-2">
              We take reasonable steps to protect information. No method of transmission over the Internet is
              100% secure; we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Your choices</h2>
            <p className="mt-2">
              Depending on where you live, you may have rights to access, correct, or delete certain personal
              information, or to object to some processing. To make a request, contact us using the details
              below. We may need to verify your identity before responding.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Children</h2>
            <p className="mt-2">
              The Store is not directed at children under the age where parental consent is required in your
              region. We do not knowingly collect personal information from such children.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Changes to this policy</h2>
            <p className="mt-2">
              We may update this policy from time to time. We will change the “Last updated” date above when we
              do. Continued use of the Store after changes means you accept the updated policy, except where
              applicable law requires other steps.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Contact</h2>
            <p className="mt-2">
              For questions regarding this policy, please reach out to our privacy team at:{' '}
              <a
                href="mailto:ItzIbragimov.uz@gmail.com"
                className="font-mono text-[14px] text-[#0066cc] hover:underline"
              >
                ItzIbragimov.uz@gmail.com
              </a>
              .
            </p>
          </section>

          <p className="border-t border-black/[0.08] pt-8">
            <a
              href="#/"
              className="text-[15px] font-medium text-[#0066cc] hover:underline"
            >
              ← Back to Store
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
