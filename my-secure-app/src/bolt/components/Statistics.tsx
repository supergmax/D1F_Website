import React from 'react';
import AnimatedCounter from './AnimatedCounter';

export default function Statistics() {
  const stats = [
    {
      id: 1,
      value: 5000,
      label: 'Active Traders',
      prefix: '',
      suffix: '+'
    },
    {
      id: 2,
      value: 25,
      label: 'Million in Funding',
      prefix: '$',
      suffix: 'M'
    },
    {
      id: 3,
      value: 98,
      label: 'Satisfaction Rate',
      prefix: '',
      suffix: '%'
    },
    {
      id: 4,
      value: 24,
      label: 'Hour Support',
      prefix: '',
      suffix: '/7'
    }
  ];

  return (
    <section 
      id="statistics" 
      className="py-24 bg-gray-50 dark:bg-slate-800"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the scale of our operations and why thousands of traders choose Day One Funding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div 
              key={stat.id} 
              className="bg-white dark:bg-slate-700 p-8 rounded-lg shadow-sm text-center
                        transform transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <AnimatedCounter
                end={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              <p className="mt-2 text-gray-600 dark:text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}