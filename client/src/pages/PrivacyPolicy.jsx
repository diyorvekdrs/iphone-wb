import { motion as Motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <Motion.h1
        className="text-2xl font-semibold text-[#1d1d1f] mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        Privacy Policy
      </Motion.h1>
      <article className="prose prose-sm text-[#6e6e73]">
        <p>
          This Privacy Policy explains how the iPhone Store (the "Service") collects, uses, and
          protects personal information when you interact with the platform. No personal data is
          transmitted to unauthorized external services; all data is handled with the highest
          security standards.
        </p>
        <h2>1. Information We Collect</h2>
        <ul>
          <li>Account details you provide during registration (email, name).</li>
          <li>Order information entered for processing (shipping address, selected products).</li>
          <li>Technical data such as browser type, device information, and usage analytics.</li>
        </ul>
        <h2>2. Use of Information</h2>
        <p>
          Collected information is used solely to provide and improve the service, manage your cart,
          process orders, and enhance your shopping experience.
        </p>
        <h2>3. Data Retention</h2>
        <p>
          We retain your information for as long as your account is active or as needed to provide
          you services and comply with our legal obligations.
        </p>
        <h2>4. Sharing & Disclosure</h2>
        <p>
          We do not sell your personal data. Information is only shared when necessary to fulfill
          orders (e.g., with logistics partners) or if required by law.
        </p>
        <h2>5. Security</h2>
        <p>
          We implement rigorous security measures, including encryption and secure server protocols,
          to protect your personal information from unauthorized access or disclosure.
        </p>
        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information at any time
          through your account settings.
        </p>
        <h2>7. Changes to This Policy</h2>
        <p>
          Updates may be posted periodically. Continued use of the Service after changes indicates
          acceptance of the revised policy.
        </p>
        <h2>8. Contact</h2>
        <p>
          For questions, please contact our support team.
        </p>
      </article>
    </section>
  );
}
