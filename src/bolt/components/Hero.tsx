import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden
                 bg-gradient-to-br from-white to-gray-100 
                 dark:from-slate-900 dark:to-slate-800"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-teal-100 dark:bg-teal-900/20 rounded-full opacity-50 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            <span className="block">Trade with Confidence</span>
            <span className="block mt-2">
              <span className="text-blue-600 dark:text-blue-400">Our Capital,</span> Your Expertise
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Day One Funding gives skilled traders access to professional capital. Scale your trading career with our industry-leading prop firm.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
          
          <div className="mt-12 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 opacity-75 blur"></div>
              <div className="relative px-6 py-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trusted by over 5,000+ traders worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}