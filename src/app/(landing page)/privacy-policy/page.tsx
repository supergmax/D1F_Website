import type { Metadata } from "next"
import Header from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/landing/page-header"

export const metadata: Metadata = {
  title: "Privacy Policy | With Us Associates",
  description: "Our privacy policy outlines how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-16">
      <Header />

      <PageHeader title="Privacy Policy" description="Last updated: May 12, 2025" />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-[#4E463F]">Introduction</h2>
            <p>
              With Us Associates ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit our website or use
              our services.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
              please do not access the site or use our services.
            </p>

            <h2 className="text-[#4E463F]">Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
            <h3 className="text-[#4E463F]">Personal Data</h3>
            <p>
              Personally identifiable information, such as your name, email address, telephone number, and mailing
              address, that you voluntarily give to us when you register with us or when you choose to participate in
              various activities related to our website and services.
            </p>
            <h3 className="text-[#4E463F]">Derivative Data</h3>
            <p>
              Information our servers automatically collect when you access our website, such as your IP address,
              browser type, operating system, access times, and the pages you have viewed directly before and after
              accessing the website.
            </p>
            <h3 className="text-[#4E463F]">Financial Data</h3>
            <p>
              Financial information, such as data related to your payment method (e.g., valid credit card number, card
              brand, expiration date) that we may collect when you purchase, order, return, exchange, or request
              information about our services.
            </p>

            <h2 className="text-[#4E463F]">Use of Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized
              experience. Specifically, we may use information collected about you via the website to:
            </p>
            <ul>
              <li>Create and manage your account.</li>
              <li>Process your transactions.</li>
              <li>Send you email newsletters, if you have opted in to receive them.</li>
              <li>Respond to your inquiries and customer service requests.</li>
              <li>
                Deliver targeted advertising, newsletters, and other information regarding promotions and our website to
                you.
              </li>
              <li>Administer sweepstakes, promotions, and contests.</li>
              <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
              <li>Increase the efficiency and operation of our website and services.</li>
              <li>Monitor and analyze usage and trends to improve your experience with our website and services.</li>
              <li>Notify you of updates to our website and services.</li>
              <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
            </ul>

            <h2 className="text-[#4E463F]">Disclosure of Your Information</h2>
            <p>
              We may share information we have collected about you in certain situations. Your information may be
              disclosed as follows:
            </p>
            <h3 className="text-[#4E463F]">By Law or to Protect Rights</h3>
            <p>
              If we believe the release of information about you is necessary to respond to legal process, to
              investigate or remedy potential violations of our policies, or to protect the rights, property, and safety
              of others, we may share your information as permitted or required by any applicable law, rule, or
              regulation.
            </p>
            <h3 className="text-[#4E463F]">Third-Party Service Providers</h3>
            <p>
              We may share your information with third parties that perform services for us or on our behalf, including
              payment processing, data analysis, email delivery, hosting services, customer service, and marketing
              assistance.
            </p>
            <h3 className="text-[#4E463F]">Marketing Communications</h3>
            <p>
              With your consent, or with an opportunity for you to withdraw consent, we may share your information with
              third parties for marketing purposes.
            </p>

            <h2 className="text-[#4E463F]">Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal
              information. While we have taken reasonable steps to secure the personal information you provide to us,
              please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method
              of data transmission can be guaranteed against any interception or other type of misuse.
            </p>

            <h2 className="text-[#4E463F]">Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
            <p>
              With Us Associates
              <br />
              123 Business Avenue, Suite 500
              <br />
              New York, NY 10001
              <br />
              United States
              <br />
              info@withusassociates.com
              <br />
              +1 (555) 123-4567
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
