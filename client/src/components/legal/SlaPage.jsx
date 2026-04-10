export default function SlaPage() {
  const updated = 'April 10, 2026'

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-11 text-[#1d1d1f]">
      <div className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">
        <p className="text-[12px] font-medium uppercase tracking-wide text-[#6e6e73]">
          Legal
        </p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-tight md:text-[40px]">
          Service Level Agreement
        </h1>
        <p className="mt-2 text-[14px] text-[#6e6e73]">Last updated: {updated}</p>

        <div className="mt-8 space-y-10 text-[15px] leading-relaxed text-[#424245]">
          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">1. Overview</h2>
            <p className="mt-3">
              This Service Level Agreement (“SLA”) outlines the standards of service, performance, and 
              reliability that iPhone Store (“we,” “us,” or “Company”) commits to providing to our 
              global customers. Our mission is to ensure that your experience with the world’s most 
              advanced technology is supported by an equally advanced service infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">2. Platform Availability</h2>
            <p className="mt-3">
              We strive to maintain a monthly uptime of <strong className="font-semibold text-[#1d1d1f]">99.9%</strong>. 
              Our distributed CDN architecture and fault-tolerant cloud infrastructure are engineered to 
              handle extreme traffic surges during major product launches and global events.
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <span className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0066cc]" />
                <span><strong className="font-medium text-[#1d1d1f]">Scheduled Maintenance:</strong> Updates are typically performed between 1:00 AM and 4:00 AM UTC to minimize disruption. Notice will be provided at least 48 hours in advance for significant changes.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0066cc]" />
                <span><strong className="font-medium text-[#1d1d1f]">Incident Response:</strong> Our 24/7 Site Reliability Engineering (SRE) team monitor services globally.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">3. Order & Fulfillment Excellence</h2>
            <p className="mt-3">
              Timely delivery is a core pillar of our service. We commit to the following processing 
              milestones for all verified orders:
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.08] bg-white">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-[#f5f5f7] font-medium text-[#1d1d1f]">
                  <tr>
                    <th className="px-6 py-3">Service Tier</th>
                    <th className="px-6 py-3">Processing Time</th>
                    <th className="px-6 py-3">Delivery Commitment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  <tr>
                    <td className="px-6 py-4 font-medium">Standard</td>
                    <td className="px-6 py-4">24–48 Hours</td>
                    <td className="px-6 py-4">5–7 Business Days</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#0066cc]">Priority Express</td>
                    <td className="px-6 py-4">Less than 12 Hours</td>
                    <td className="px-6 py-4">2–3 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">4. Global Concierge Support</h2>
            <p className="mt-3">
              We provide expert support for technical, billing, and logistical inquiries. Response 
              times are categorized based on the nature of the request:
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/[0.05] bg-white p-6 shadow-sm">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Technical Support</h3>
                <p className="mt-2 text-[14px] text-[#6e6e73]">
                  Assistance with account access, device configuration, or purchase flow issues.
                </p>
                <p className="mt-4 text-[13px] font-medium text-[#0066cc]">Target Response: &lt; 4 Hours</p>
              </div>
              <div className="rounded-2xl border border-black/[0.05] bg-white p-6 shadow-sm">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Order Logistics</h3>
                <p className="mt-2 text-[14px] text-[#6e6e73]">
                  Updates on shipping, returns, and delivery troubleshooting.
                </p>
                <p className="mt-4 text-[13px] font-medium text-[#0066cc]">Target Response: &lt; 8 Hours</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">5. Security & Data Integrity</h2>
            <p className="mt-3">
              Our commitment to privacy and security is non-negotiable. The iPhone Store utilizes 
              end-to-end encryption for all sensitive data and adheres to the highest industry 
              standards for payment processing (PCI-DSS Level 1).
            </p>
            <p className="mt-3">
              We guarantee that your personal data is never sold to third parties and is used 
              exclusively to provide and improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">6. Hardware Warranty & Support</h2>
            <p className="mt-3">
              In addition to this SLA, all hardware products purchased through our store are 
              covered by a standard one-year limited warranty. For extended coverage, 
              customers may opt for our premium protection plans at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-[19px] font-semibold text-[#1d1d1f]">7. Contact Our Legal Team</h2>
            <p className="mt-3">
              For enterprise agreements, security audits, or formal inquiries related to this SLA, 
              please contact our Legal Affairs Department:
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

