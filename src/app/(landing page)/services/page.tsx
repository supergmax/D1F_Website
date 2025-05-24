import type { Metadata } from "next"
import Image from "next/image"
import Header from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/landing/page-header"
import { WhyChooseUsSection } from "@/components/landing/why-choose-us-section"
import { Button } from "@/components/ui/landing/button"

export const metadata: Metadata = {
  title: "Services | With Us Associates",
  description: "Explore our comprehensive range of professional services designed to help your business thrive.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-16">
      <Header />

      <PageHeader title="Our Services" description="Comprehensive solutions tailored to your business needs" />

      {/* Main Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div id="trading-challenges">
              <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Business Consulting"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-[#4E463F]">Business Consulting</h2>
              <p className="text-gray-600 mb-4">
                Our strategic business consulting services help organizations identify opportunities, overcome
                challenges, and achieve sustainable growth. We work closely with your team to develop customized
                strategies that align with your business goals.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-[#CABA9F] mr-2">•</span>
                  <span className="text-gray-600">Strategic planning and implementation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#CABA9F] mr-2">•</span>
                  <span className="text-gray-600">Business process optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#CABA9F] mr-2">•</span>
                  <span className="text-gray-600">Market entry and expansion strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#CABA9F] mr-2">•</span>
                  <span className="text-gray-600">Competitive analysis and positioning</span>
                </li>
              </ul>
              <Button className="bg-[#4E463F] hover:bg-[#CABA9F] text-white">Learn More</Button>
            </div>

            <div id="funded-accounts">
              <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Financial Advisory"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-[#4E463F]">Financial Advisory</h2>
              <p className="text-gray-600 mb-4">
                Our financial advisory services provide businesses with the insights and guidance needed to make
                informed financial decisions. We help you optimize your financial performance and achieve your financial
                objectives.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-[#CABA9F] mr-2">•</span>
                  <span className="text-gray-600">Financial planning and analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#CABA9F] mr-2">•</span>
                  <span className="text-gray-600">Investment strategy and management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#CABA9F] mr-2">•</span>
                  <span className="text-gray-600">Risk assessment and mitigation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#CABA9F] mr-2">•</span>
                  <span className="text-gray-600">Mergers and acquisitions advisory</span>
                </li>
              </ul>
              <Button className="bg-[#4E463F] hover:bg-[#CABA9F] text-white">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#4E463F]">Additional Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div id="education" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-[#4E463F]">Training & Development</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive training programs designed to enhance the skills and capabilities of your team. Our
                workshops and coaching sessions are tailored to address specific organizational needs.
              </p>
              <Button variant="outline" className="border-[#4E463F] text-[#4E463F] hover:bg-[#4E463F] hover:text-white">
                Explore Training
              </Button>
            </div>

            <div id="trading-tools" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-[#4E463F]">Digital Transformation</h3>
              <p className="text-gray-600 mb-4">
                Navigate the digital landscape with our technology-driven solutions. We help businesses leverage digital
                tools and platforms to improve efficiency and drive growth.
              </p>
              <Button variant="outline" className="border-[#4E463F] text-[#4E463F] hover:bg-[#4E463F] hover:text-white">
                Discover Solutions
              </Button>
            </div>

            <div id="market-analysis" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-[#4E463F]">Market Research</h3>
              <p className="text-gray-600 mb-4">
                Data-driven market research to help you understand industry trends, customer preferences, and
                competitive landscapes. Make informed decisions based on actionable insights.
              </p>
              <Button variant="outline" className="border-[#4E463F] text-[#4E463F] hover:bg-[#4E463F] hover:text-white">
                Get Insights
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUsSection />

      {/* Service Packages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#4E463F]">Service Packages</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xl font-bold text-center text-[#4E463F]">Starter</h3>
                <div className="text-center my-4">
                  <span className="text-4xl font-bold text-[#4E463F]">$1,500</span>
                  <span className="text-gray-600 ml-2">/ month</span>
                </div>
                <p className="text-center text-gray-600">Perfect for small businesses and startups</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Business strategy consultation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Monthly financial review</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Basic market analysis</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Email support</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button className="w-full bg-[#4E463F] hover:bg-[#CABA9F] text-white">Get Started</Button>
                </div>
              </div>
            </div>

            <div className="border-2 border-[#CABA9F] rounded-lg overflow-hidden shadow-md relative">
              <div className="absolute top-0 right-0 bg-[#CABA9F] text-white px-4 py-1 text-sm font-medium">
                Popular
              </div>
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xl font-bold text-center text-[#4E463F]">Professional</h3>
                <div className="text-center my-4">
                  <span className="text-4xl font-bold text-[#4E463F]">$3,500</span>
                  <span className="text-gray-600 ml-2">/ month</span>
                </div>
                <p className="text-center text-gray-600">Ideal for growing businesses</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Comprehensive business strategy</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Bi-weekly financial analysis</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Detailed market research</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Priority email & phone support</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button className="w-full bg-[#4E463F] hover:bg-[#CABA9F] text-white">Get Started</Button>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xl font-bold text-center text-[#4E463F]">Enterprise</h3>
                <div className="text-center my-4">
                  <span className="text-4xl font-bold text-[#4E463F]">$7,500</span>
                  <span className="text-gray-600 ml-2">/ month</span>
                </div>
                <p className="text-center text-gray-600">For established organizations</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Custom business strategy</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Weekly financial consulting</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Comprehensive market analysis</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Executive team coaching</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">24/7 priority support</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">Quarterly on-site consultation</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button className="w-full bg-[#4E463F] hover:bg-[#CABA9F] text-white">Get Started</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
