import type { Metadata } from "next"
import Header from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { FaqSection } from "@/components/faq-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ | With Us Associates",
  description: "Find answers to frequently asked questions about our services, process, and more.",
}

export default function FaqPage() {
  return (
    <main className="min-h-screen pt-16">
      <Header />

      <PageHeader
        title="Frequently Asked Questions"
        description="Find answers to common questions about our services and process"
      />

      <FaqSection />

      {/* Additional FAQ Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#4E463F]">More Questions by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Services FAQ */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-[#4E463F]">About Our Services</h3>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2 text-[#4E463F]">What industries do you specialize in?</h4>
                  <p className="text-gray-600">
                    We have expertise across multiple industries including finance, technology, healthcare,
                    manufacturing, retail, and professional services. Our diverse team brings industry-specific
                    knowledge to each client engagement.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2 text-[#4E463F]">Do you offer customized solutions?</h4>
                  <p className="text-gray-600">
                    Yes, all our services are tailored to meet the specific needs and objectives of each client. We
                    don't believe in one-size-fits-all approaches and work closely with you to develop customized
                    solutions.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2 text-[#4E463F]">Can you work with businesses of any size?</h4>
                  <p className="text-gray-600">
                    Absolutely. We work with organizations of all sizes, from startups and small businesses to large
                    enterprises. Our service packages can be scaled to accommodate different business sizes and budgets.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2 text-[#4E463F]">
                    Do you offer ongoing support after project completion?
                  </h4>
                  <p className="text-gray-600">
                    Yes, we provide ongoing support and advisory services to ensure the long-term success of our
                    clients. We believe in building lasting partnerships rather than one-time engagements.
                  </p>
                </div>
              </div>
            </div>

            {/* Process FAQ */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-[#4E463F]">About Our Process</h3>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2 text-[#4E463F]">How long does a typical project take?</h4>
                  <p className="text-gray-600">
                    Project timelines vary depending on the scope and complexity of the engagement. A typical consulting
                    project may range from 3-6 months, while ongoing advisory services are structured based on your
                    needs.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2 text-[#4E463F]">What is your approach to client collaboration?</h4>
                  <p className="text-gray-600">
                    We believe in close collaboration with our clients throughout the process. We work as an extension
                    of your team, ensuring regular communication, knowledge transfer, and joint decision-making.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2 text-[#4E463F]">How do you measure success?</h4>
                  <p className="text-gray-600">
                    We establish clear, measurable objectives at the beginning of each engagement and track progress
                    against these metrics. Success is defined by tangible business outcomes and the achievement of your
                    strategic goals.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2 text-[#4E463F]">
                    What happens if our business needs change during a project?
                  </h4>
                  <p className="text-gray-600">
                    We understand that business needs can evolve. Our approach is flexible and adaptable, allowing us to
                    adjust strategies and deliverables as needed to address changing priorities or market conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#4E463F]">Still Have Questions?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is ready to answer any additional questions you may have about our services, process, or how we can
            help your business succeed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" >
              <Button className="bg-[#4E463F] hover:bg-[#CABA9F] text-white px-8 py-3">Contact Us</Button>
            </Link>
            <Button
              variant="outline"
              className="border-[#4E463F] text-[#4E463F] hover:bg-[#4E463F] hover:text-white px-8 py-3"
            >
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
