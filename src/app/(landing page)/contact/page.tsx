import type { Metadata } from "next"
import Header from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | With Us funded",
  description: "Get in touch with our team for inquiries, consultations, or to learn more about our services.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-16">
      <Header />

      <PageHeader
        title="Contact Us"
        description="Get in touch with our team for inquiries or to schedule a consultation"
      />

      {/* Contact Form and Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center w-full">
            {/* Contact Information */}
            <div className="w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-6 text-[#4E463F] text-center">Contact Information</h2>

              <div className="bg-gray-50 p-8 rounded-lg mb-8 w-full">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-[#CABA9F] mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#4E463F] mb-1">Our Office</h3>
                      <p className="text-gray-600">
                        123 Business Avenue, Suite 500<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-[#CABA9F] mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#4E463F] mb-1">Phone</h3>
                      <p className="text-gray-600">
                        Main: +1 (555) 123-4567<br />
                        Support: +1 (555) 987-6543
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-[#CABA9F] mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#4E463F] mb-1">Email</h3>
                      <p className="text-gray-600">
                        General Inquiries: info@withusfunded.com<br />
                        Support: support@withusfunded.com<br />
                        Careers: careers@withusfunded.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-[#CABA9F] mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#4E463F] mb-1">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Saturday: 10:00 AM - 2:00 PM EST<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Global Offices */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#4E463F]">Our Global Offices</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-4 text-[#4E463F]">New York</h3>
              <p className="text-gray-600 mb-2">123 Business Avenue, Suite 500</p>
              <p className="text-gray-600 mb-2">New York, NY 10001</p>
              <p className="text-gray-600 mb-4">United States</p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> +1 (555) 123-4567
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-4 text-[#4E463F]">London</h3>
              <p className="text-gray-600 mb-2">45 Commerce Street</p>
              <p className="text-gray-600 mb-2">London, EC2N 1HQ</p>
              <p className="text-gray-600 mb-4">United Kingdom</p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> +44 20 1234 5678
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-4 text-[#4E463F]">Singapore</h3>
              <p className="text-gray-600 mb-2">78 Business Park, #08-01</p>
              <p className="text-gray-600 mb-2">Singapore 123456</p>
              <p className="text-gray-600 mb-4">Singapore</p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> +65 6123 4567
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
