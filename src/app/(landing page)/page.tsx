import Hero from "@/components/landing/hero"
import Header from "@/components/landing/header"
import { CommitmentsSection } from "@/components/landing/commitments-section"
import { ProcessSection } from "@/components/landing/process-section"
import { StatsSection } from "@/components/landing/stats-section"
import { FaqSection } from "@/components/landing/faq-section"
import { WhyChooseUsSection } from "@/components/landing/why-choose-us-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      
      <Hero />
      <Header />

      <section id="about" className="py-20 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#4E463F]">About Us</h2>
          <p className="text-lg text-center max-w-3xl mx-auto text-gray-600">
            With Us Associates is dedicated to helping individuals and organizations reach their full potential. We
            believe in challenging conventional limits and pushing boundaries to achieve extraordinary results.
          </p>
        </div>
      </section>

      <StatsSection />

      <WhyChooseUsSection />

      <ProcessSection />

      <CommitmentsSection />

      <section id="services" className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#4E463F]">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-[#4E463F]">Consulting</h3>
              <p className="text-gray-600">Strategic consulting services to help your business grow and thrive.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-[#4E463F]">Training</h3>
              <p className="text-gray-600">Professional development and training programs for teams and individuals.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-[#4E463F]">Coaching</h3>
              <p className="text-gray-600">
                One-on-one coaching to help you achieve your personal and professional goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />

      <section id="contact" className="py-20 px-4 md:px-8 lg:px-16 bg-[#CABA9F]/20"> {/*bg-white*/}
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#4E463F]">Contact Us</h2>
          <p className="text-lg text-center max-w-3xl mx-auto mb-8 text-gray-600">
            Ready to challenge yourself without limits? Get in touch with our team today.
          </p>
          <div className="flex justify-center ">
            <button className="bg-[#4E463F] text-white px-8 py-3 rounded-md hover:bg-[#CABA9F] transition-all">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
