import { Clock, Shield, Wallet, GraduationCap } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Responsive Support",
    description: "24/7 dedicated support team to assist you throughout your trading journey",
  },
  {
    icon: Shield,
    title: "Full Transparency",
    description: "Clear rules, fair evaluation, and transparent profit-sharing system",
  },
  {
    icon: Wallet,
    title: "Fast Payouts",
    description: "Bi-weekly profit distributions with no hidden fees or delays",
  },
  {
    icon: GraduationCap,
    title: "Continuous Education",
    description: "Access to premium educational resources and trading workshops",
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#4E463F]">Why Choose Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide the tools and support you need to succeed as a funded trader
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <feature.icon className="w-12 h-12 text-[#4E463F] mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-[#4E463F]">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
