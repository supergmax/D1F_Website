import type { Metadata } from "next"
import Header from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { ProcessSection } from "@/components/process-section"
import { CommitmentsSection } from "@/components/commitments-section"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Our Process | With Us Associates",
  description: "Learn about our proven process that delivers exceptional results for our clients.",
}

export default function ProcessPage() {
  return (
    <main className="min-h-screen pt-16">
      <Header />

      <PageHeader title="Our Process" description="A systematic approach to delivering exceptional results" />

      <ProcessSection />

      {/* Process Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#4E463F]">Our Approach in Detail</h2>

            <div className="space-y-12">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-[#4E463F]">1. Discovery & Assessment</h3>
                <p className="text-gray-600 mb-4">
                  We begin by thoroughly understanding your business, challenges, and objectives. Our team conducts a
                  comprehensive assessment to identify opportunities and areas for improvement.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">In-depth stakeholder interviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Business process analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Market and competitive assessment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Financial performance review</span>
                  </li>
                </ul>
                <p className="text-gray-600 italic">
                  "The discovery phase with With Us Associates was incredibly thorough. They took the time to truly
                  understand our business before proposing solutions." - Client Testimonial
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-[#4E463F]">2. Strategy Development</h3>
                <p className="text-gray-600 mb-4">
                  Based on our findings, we develop a customized strategy tailored to your specific needs and goals. Our
                  strategies are practical, actionable, and designed to deliver measurable results.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Collaborative strategy workshops</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Scenario planning and analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Resource allocation planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Implementation roadmap development</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-[#4E463F]">3. Implementation & Execution</h3>
                <p className="text-gray-600 mb-4">
                  We work alongside your team to implement the strategy, providing guidance, support, and expertise
                  throughout the process. Our hands-on approach ensures successful execution.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Project management and coordination</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Change management support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Skill development and training</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Regular progress reviews</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-[#4E463F]">4. Monitoring & Optimization</h3>
                <p className="text-gray-600 mb-4">
                  We continuously monitor progress, measure results, and make adjustments as needed to ensure optimal
                  outcomes. Our commitment to your success extends beyond implementation.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Performance tracking and analytics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Regular review meetings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Strategy refinement and adaptation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Long-term support and guidance</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-[#4E463F]">5. Evaluation & Growth</h3>
                <p className="text-gray-600 mb-4">
                  We evaluate the impact of our work, celebrate successes, and identify opportunities for further growth
                  and improvement. Our goal is to establish a long-term partnership that drives ongoing success.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Comprehensive impact assessment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Future opportunity identification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Long-term growth planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#CABA9F] mr-2">•</span>
                    <span className="text-gray-600">Ongoing advisory support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button className="bg-[#4E463F] hover:bg-[#CABA9F] text-white px-8 py-3">Schedule a Consultation</Button>
            </div>
          </div>
        </div>
      </section>

      <CommitmentsSection />

      <Footer />
    </main>
  )
}
