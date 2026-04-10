/**
 * Terms of Use for iPhone Store.
 */
export default function TermsOfUsePage() {
  const updated = 'April 10, 2026'

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-11 text-[#1d1d1f]">
      <div className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">
        <p className="text-[12px] font-medium uppercase tracking-wide text-[#6e6e73]">
          Legal
        </p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-tight md:text-[40px]">
          Terms of use
        </h1>
        <p className="mt-2 text-[14px] text-[#6e6e73]">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-[#424245]">

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Agreement</h2>
            <p className="mt-2">
              By using <strong className="font-medium text-[#1d1d1f]">iPhone Store</strong> (the “Store,”
              “we,” or “us”), including browsing, creating an account, or placing an order, you agree to
              these Terms of Use and our{' '}
              <a href="#/privacy" className="text-[#0066cc] hover:underline">
                Privacy Policy
              </a>
              . If you do not agree, do not use the Store.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Eligibility &amp; accounts</h2>
            <p className="mt-2">
              You must be old enough in your region to enter a binding agreement and to use this type of
              service. You are responsible for keeping your login credentials confidential and for activity
              under your account. Tell us promptly at the contact below if you suspect unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Products, pricing, &amp; availability</h2>
            <p className="mt-2">
              Product descriptions, images, and prices are shown for your information. We may correct errors,
              update catalog data, or limit quantities. If an order cannot be fulfilled as described, we may
              cancel it or contact you.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Orders &amp; payment</h2>
            <p className="mt-2">
              When you place an order, you offer to buy the items in your cart subject to these terms.
              Payment may be processed by a third-party provider (for example Stripe). You agree to their
              terms where applicable. You represent that your payment information is valid and that you are
              authorized to use it.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Shipping &amp; risk</h2>
            <p className="mt-2">
              Shipping details, timelines, and carriers may be shown on the Store or communicated after
              checkout. Risk of loss for physical goods typically passes in line with the carrier’s terms
              and local law; adjust this section for your real shipping policy.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Acceptable use</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Break the law or infringe others’ rights;</li>
              <li>Attempt to hack, scrape, overload, or disrupt the Store or its API;</li>
              <li>Use another person’s account without permission;</li>
              <li>Submit false or fraudulent order or payment information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Intellectual property</h2>
            <p className="mt-2">
              The Store’s design, text, and original assets belong to us or our licensors.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Disclaimer of warranties</h2>
            <p className="mt-2">
              The Store is provided <strong className="font-medium text-[#1d1d1f]">“as is”</strong> and{' '}
              <strong className="font-medium text-[#1d1d1f]">“as available.”</strong> To the fullest extent
              allowed by law, we disclaim all warranties, express or implied, including merchantability,
              fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Limitation of liability</h2>
            <p className="mt-2">
              To the fullest extent allowed by law, we are not liable for indirect, incidental, special,
              consequential, or punitive damages, or loss of profits, data, or goodwill. Our total liability
              for claims arising from the Store is limited to the amount you paid us for the order giving
              rise to the claim in the ninety (90) days before the claim, or fifty dollars (USD) if greater
              — adjust caps for your jurisdiction and counsel’s advice.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Termination</h2>
            <p className="mt-2">
              We may suspend or terminate access to the Store or your account for conduct that violates these
              terms or puts the service or others at risk.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Governing law</h2>
            <p className="mt-2">
              These terms are governed by the laws applicable in our jurisdiction. Any disputes will be 
              handled in the appropriate courts.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Changes</h2>
            <p className="mt-2">
              We may update these terms; the “Last updated” date will change. Continued use after updates
              means you accept the new terms, where allowed by law.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Contact</h2>
            <p className="mt-2">
              For any legal inquiries regarding these terms, please contact us at:{' '}
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
