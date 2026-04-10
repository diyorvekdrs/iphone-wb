import { motion as Motion } from 'framer-motion';

export default function TermsOfUse() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <Motion.h1
        className="text-2xl font-semibold text-[#1d1d1f] mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        Terms of Use
      </Motion.h1>
      <article className="prose prose-sm text-[#6e6e73]">
        <p>
          These Terms of Use ("Terms") govern your access to and use of the iPhone Store
          website (the "Service"). By accessing or using the Service you
          agree to be bound by these Terms. If you do not agree, please discontinue use of the
          Service.
        </p>
        <h2>1. Eligibility</h2>
        <p>
          You must be at least 13 years of age to use the Service. Users under the age of 18 must
          have parental or guardian consent.
        </p>
        <h2>2. Account Registration</h2>
        <p>
          To place orders you may create an account. You are responsible for maintaining the
          confidentiality of your account credentials and for all activities that occur under
          your account.
        </p>
        <h2>3. Use of the Service</h2>
        <p>
          The Service is provided for your personal, non-commercial use. You may not use the Service for
          any unlawful activity or in any way that harms the platform.
        </p>
        <h2>4. Intellectual Property</h2>
        <p>
          All content, designs, and code presented in the Service are the property of iPhone
          and its contributors. You may not reproduce or distribute the materials for unauthorized use.
        </p>
        <h2>5. Disclaimer</h2>
        <p>
          The Service is provided "as is" without warranties of any kind. While we strive for the
          best possible experience, we do not warrant that the service will be error‑free or uninterrupted.
        </p>
        <h2>6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, iPhone shall not be liable for
          any indirect, incidental, special, or consequential damages arising out of or in any
          way connected with the use of the Service.
        </p>
        <h2>7. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Service after revisions
          constitutes acceptance of the updated Terms.
        </p>
        <h2>8. Contact</h2>
        <p>
          For any questions regarding these Terms, please contact our support team.
        </p>
      </article>
    </section>
  );
}
