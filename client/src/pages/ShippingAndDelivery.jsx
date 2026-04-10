import { motion as Motion } from 'framer-motion';

export default function ShippingAndDelivery() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <Motion.h1
        className="text-2xl font-semibold text-[#1d1d1f] mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        Shipping &amp; Delivery
      </Motion.h1>
      <article className="prose prose-sm text-[#6e6e73]">
        <p>
          The iPhone Store provides a premium shipping experience for all our customers. We work with 
          top logistics partners to ensure your products arrive safely and on time.
        </p>
        <h2>1. Shipping Options</h2>
        <ul>
          <li><strong>Standard (Free)</strong> – Delivery within 5‑7 business days across most regions.</li>
          <li><strong>Express</strong> – Delivery within 2‑3 business days for urgent orders.</li>
        </ul>
        <h2>2. Order Processing Timeline</h2>
        <p>
          Once your order is placed, it enters our processing queue. You can track your order status
          (Processing → Shipped → Delivered) in your account dashboard.
        </p>
        <h2>3. Delivery Areas</h2>
        <p>
          We offer worldwide shipping. Specific restrictions may apply based on your selected 
          destination and local regulations.
        </p>
        <h2>4. Peace of Mind</h2>
        <p>
          All shipments are fully insured and tracked. You will receive a notification with your tracking
          information as soon as your order leaves our warehouse.
        </p>
        <h2>5. Contact</h2>
        <p>
          For any questions about your shipping status, please contact our support team.
        </p>
      </article>
    </section>
  );
}
