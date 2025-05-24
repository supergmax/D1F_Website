import type { Metadata } from "next"
import Image from "next/image"
import Header from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { StatsSection } from "@/components/stats-section"
import { Users, Award, TrendingUp, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | With Us Associates",
  description: "Learn about With Us Associates, our mission, values, and the team behind our success.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-16">
      <Header />

      <PageHeader
        title="About Us"
        description="Learn about our mission, values, and the team that makes With Us Associates exceptional."
      />

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#4E463F]">Our Mission & Vision</h2>
              <p className="text-gray-600 mb-4">
                At With Us Associates, our mission is to empower businesses and individuals to reach their full
                potential through strategic innovation and professional excellence.
              </p>
              <p className="text-gray-600 mb-4">
                We envision a world where every organization has access to the tools, knowledge, and support needed to
                thrive in an ever-changing business landscape.
              </p>
              <p className="text-gray-600">
                Founded in 2010, we've grown from a small consulting firm to a comprehensive business solutions provider
                with clients across multiple industries and countries.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <Users className="w-12 h-12 text-[#4E463F] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-[#4E463F]">Client-Focused</h3>
                  <p className="text-gray-600 text-sm">Your success is our priority</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <Award className="w-12 h-12 text-[#4E463F] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-[#4E463F]">Excellence</h3>
                  <p className="text-gray-600 text-sm">Committed to the highest standards</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <TrendingUp className="w-12 h-12 text-[#4E463F] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-[#4E463F]">Innovation</h3>
                  <p className="text-gray-600 text-sm">Forward-thinking solutions</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <Clock className="w-12 h-12 text-[#4E463F] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-[#4E463F]">Reliability</h3>
                  <p className="text-gray-600 text-sm">Consistent and dependable service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#4E463F]">Meet Our Leadership Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Johnson",
                position: "Chief Executive Officer",
                bio: "With over 20 years of experience in business strategy and leadership.",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Michael Chen",
                position: "Chief Operations Officer",
                bio: "Expert in optimizing business processes and driving operational excellence.",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Elena Rodriguez",
                position: "Chief Financial Officer",
                bio: "Specializes in financial strategy and sustainable business growth.",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "David Williams",
                position: "Chief Technology Officer",
                bio: "Passionate about leveraging technology to solve complex business challenges.",
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1 text-[#4E463F]">{member.name}</h3>
                  <p className="text-[#CABA9F] font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our History */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#4E463F]">Our Journey</h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {[
                {
                  year: "2010",
                  title: "Founded",
                  description:
                    "With Us Associates was established with a vision to provide exceptional business consulting services.",
                },
                {
                  year: "2013",
                  title: "Expansion",
                  description: "Expanded our service offerings to include financial advisory and market analysis.",
                },
                {
                  year: "2016",
                  title: "International Growth",
                  description:
                    "Opened our first international office and began serving clients across Europe and Asia.",
                },
                {
                  year: "2019",
                  title: "Digital Transformation",
                  description:
                    "Launched our digital solutions division to help clients navigate the digital landscape.",
                },
                {
                  year: "2022",
                  title: "Industry Recognition",
                  description: "Recognized as a leading business consultancy firm with multiple industry awards.",
                },
              ].map((milestone, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 w-24 pt-1">
                    <div className="font-bold text-xl text-[#CABA9F]">{milestone.year}</div>
                  </div>
                  <div className="flex-grow pl-8 border-l-2 border-gray-200">
                    <h3 className="font-bold text-xl mb-2 text-[#4E463F]">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
