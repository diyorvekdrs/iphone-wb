export default function ShippingPolicyPage() {
  const updated = 'April 10, 2026'

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-11 text-[#1d1d1f]">
      <div className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">
        <p className="text-[12px] font-medium uppercase tracking-wide text-[#6e6e73]">
          Legal
        </p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-tight md:text-[40px]">
          Shipping & Delivery
        </h1>
        <p className="mt-2 text-[14px] text-[#6e6e73]">Last updated: {updated}</p>

        <div className="mt-8 space-y-10 text-[15px] leading-relaxed text-[#424245]">
          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">1. Our Global Logistics Commitment</h2>
            <p className="mt-3">
              The iPhone Store is dedicated to providing a premium fulfillment experience. We partner with 
              leading global carriers to ensure your devices are handled with care and delivered with precision. 
              Every shipment is fully insured and traceable from our warehouse to your doorstep.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">2. Shipping Options & Timelines</h2>
            <p className="mt-3">
              Shipping speeds vary by region and selected service. All processing begins immediately upon payment 
              verification.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.08] bg-white text-[14px]">
              <div className="flex border-b border-black/[0.05] bg-[#f5f5f7] font-medium text-[#1d1d1f]">
                <div className="w-1/3 px-6 py-3">Method</div>
                <div className="w-1/3 px-6 py-3">Speed</div>
                <div className="w-1/3 px-6 py-3">Cost</div>
              </div>
              <div className="flex divide-x divide-black/[0.05]">
                <div className="w-1/3 px-6 py-4 font-medium uppercase tracking-tight">Standard</div>
                <div className="w-1/3 px-6 py-4">5–7 Business Days</div>
                <div className="w-1/3 px-6 py-4 text-[#0066cc]">Complimentary</div>
              </div>
              <div className="flex border-t border-black/[0.05] divide-x divide-black/[0.05]">
                <div className="w-1/3 px-6 py-4 font-medium uppercase tracking-tight text-[#0066cc]">Priority Express</div>
                <div className="w-1/3 px-6 py-4">2–3 Business Days</div>
                <div className="w-1/3 px-6 py-4">$15.00</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">3. Real-Time Tracking</h2>
            <p className="mt-3">
              Transparency is essential. Once your order is dispatched, you will receive a confirmation 
              email containing a unique tracking number and a direct link to the carrier's portal. 
              You can also monitor your order's lifecycle (Processing → Dispatched → In Transit → Delivered) 
              directly from your <a href="#/orders" className="text-[#0066cc] hover:underline">Orders Dashboard</a>.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">4. International Shipments</h2>
            <p className="mt-3">
              We offer distribution to over 100 countries. Please be advised that international shipments 
              may be subject to local import duties, taxes, and customs inspections. These charges are the 
              responsibility of the recipient and are not included in the purchase price.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">5. Damaged or Missing Items</h2>
            <p className="mt-3">
              In the rare event that your package arrives damaged or is lost in transit, our support 
              team will execute a priority investigation. Claims for missing or damaged items must 
              be initiated within 48 hours of the recorded delivery date.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">6. Support & Inquiries</h2>
            <p className="mt-3">
              For any logistical concerns or to modify an existing shipment, please contact our 
              global fulfillment center:
            </p>
            <p className="mt-4">
              <a
                href="mailto:ItzIbragimov.uz@gmail.com"
                className="inline-flex items-center text-[15px] font-medium text-[#0066cc] hover:underline"
              >
                ItzIbragimov.uz@gmail.com
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </p>
          </section>

          <div className="border-t border-black/[0.08] pt-10">
            <a
              href="#/"
              className="text-[15px] font-medium text-[#0066cc] hover:underline"
            >
              ← Back to Store
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
