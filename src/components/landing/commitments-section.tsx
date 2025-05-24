import { CheckCircle, Lock, Lightbulb, LineChart } from "lucide-react"

const commitments = [
  {
    icon: Lock,
    title: "100% Secure",
    description: "Enterprise-grade security for your funds and data",
  },
  {
    icon: Lightbulb,
    title: "Simplified Process",
    description: "Clear and straightforward evaluation system",
  },
  {
    icon: LineChart,
    title: "Trading Rules Compliance",
    description: "Fair and transparent trading guidelines",
  },
  {
    icon: CheckCircle,
    title: "Financial Transparency",
    description: "Clear profit-sharing and payout structure",
  },
]

export function CommitmentsSection() {
  return (
    <section className="py-20 bg-[#CABA9F]/20 "> {/*bg-gray-50*/}
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#4E463F]">Our Commitments</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We stand by our promises to provide you with the best trading experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {commitments.map((commitment, index) => (
            <div
              key={commitment.title}
              className="flex items-start space-x-4 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <commitment.icon className="w-8 h-8 text-[#4E463F]" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#4E463F]">{commitment.title}</h3>
                <p className="text-gray-600">{commitment.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
