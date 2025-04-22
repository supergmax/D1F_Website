import React from 'react';
import { CircleDollarSign, LineChart, Trophy } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: <CircleDollarSign size={40} className="text-blue-600 dark:text-blue-400" />,
      title: 'Register & Fund',
      description: 'Create your account and choose from our range of trading challenges based on your experience and goals.'
    },
    {
      id: 2,
      icon: <LineChart size={40} className="text-blue-600 dark:text-blue-400" />,
      title: 'Pass Evaluation',
      description: 'Demonstrate your trading skills by meeting our profit targets while adhering to risk management rules.'
    },
    {
      id: 3,
      icon: <Trophy size={40} className="text-blue-600 dark:text-blue-400" />,
      title: 'Receive Funding',
      description: 'Once qualified, gain access to our capital and keep up to 90% of your trading profits with scaled accounts.'
    }
  ];

  return (
    <section 
      id="how-it-works" 
      className="py-24 bg-white dark:bg-slate-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our streamlined process gets you trading with professional capital in three simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-1/2 top-24 bottom-24 w-0.5 bg-blue-200 dark:bg-blue-900 transform -translate-x-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="relative bg-gray-50 dark:bg-slate-800 p-8 rounded-lg shadow-sm
                          transform transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-100 dark:bg-slate-700 rounded-full">
                    {step.icon}
                  </div>
                </div>
                <div className="absolute top-4 right-4 md:top-0 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:-translate-y-1/2">
                  <span className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-blue-600 dark:bg-blue-500 rounded-full">
                    {step.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}