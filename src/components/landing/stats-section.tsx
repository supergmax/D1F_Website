export function StatsSection() {
  return (
    <section id="stats" className="py-16 bg-[#CABA9F]/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#4E463F] mb-2 hover:scale-105 transition-transform duration-300">
              10,000+
            </p>
            <p className="text-sm font-medium text-gray-600">Active Traders</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#4E463F] mb-2 hover:scale-105 transition-transform duration-300">
              87%
            </p>
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#4E463F] mb-2 hover:scale-105 transition-transform duration-300">
              $250M+
            </p>
            <p className="text-sm font-medium text-gray-600">Volume Traded</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#4E463F] mb-2 hover:scale-105 transition-transform duration-300">
              $1.2M
            </p>
            <p className="text-sm font-medium text-gray-600">Monthly Payouts</p>
          </div>
        </div>
      </div>
    </section>
  )
}
