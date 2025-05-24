"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

type FaqItem = {
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    question: "What is a trading challenge?",
    answer:
      "A trading challenge is a risk-free opportunity to prove your trading skills. You trade with our capital, and if you meet the performance targets, you get funded with a larger account and keep a percentage of the profits.",
  },
  {
    question: "How do I qualify for funding?",
    answer:
      "To qualify for funding, you need to achieve the profit target while respecting the maximum drawdown and other risk management rules specified in your chosen challenge package.",
  },
  {
    question: "What markets can I trade?",
    answer:
      "You can trade forex, indices, commodities, and cryptocurrencies. We provide access to a wide range of financial instruments to suit your trading style.",
  },
  {
    question: "How much funding can I get?",
    answer:
      "We offer funding accounts ranging from $10,000 to $200,000, depending on the challenge level you successfully complete.",
  },
  {
    question: "What is the profit split?",
    answer:
      "After successfully completing the challenge, you'll receive up to 90% of the profits generated with our capital.",
  },
  {
    question: "How long does the evaluation process take?",
    answer:
      "The evaluation process typically takes between 1 to 30 days, depending on how quickly you reach the profit targets while respecting the risk management rules.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-primary">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            Get answers to the most common questions about our trading challenges
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={index} className="mb-4">
              <div className={`border dark:border-border rounded-lg overflow-hidden bg-background dark:bg-card`}>
                <button
                  className="flex justify-between items-center w-full p-4 text-left text-lg font-medium text-primary dark:text-primary"
                  onClick={() => toggleFaq(index)}
                >
                  {item.question}
                  <ChevronDown
                    className={`transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`}
                    size={20}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96 p-4 pt-0" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 dark:text-muted-foreground pt-2">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
