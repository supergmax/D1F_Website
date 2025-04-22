import React from 'react';

export default function Partners() {
  // Placeholder partner logos - in a real implementation, these would be proper logo images
  const partners = [
    { id: 1, name: 'TradeTech Solutions' },
    { id: 2, name: 'Global Markets Inc.' },
    { id: 3, name: 'FinSecure Analytics' },
    { id: 4, name: 'Quantum Trading Group' },
    { id: 5, name: 'AlphaStream Financial' },
    { id: 6, name: 'Meridian Exchange' },
    { id: 7, name: 'BlueChip Assets' },
    { id: 8, name: 'Velocity Capital' }
  ];

  return (
    <section 
      id="partners" 
      className="py-24 bg-gray-50 dark:bg-slate-800"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Partners
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We collaborate with leading financial institutions to provide you with the best trading experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {partners.map(partner => (
            <div 
              key={partner.id} 
              className="relative flex items-center justify-center p-8 bg-white dark:bg-slate-700 rounded-lg
                        grayscale hover:grayscale-0 transition-all duration-300
                        hover:shadow-md hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {partner.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}