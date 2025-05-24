export function StatsSection() {
  return (
    <section id="stats" className="py-16 bg-secondary/20 dark:bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-2 hover:scale-105 transition-transform duration-300">
              10,000+
            </p>
            <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Active Traders</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-2 hover:scale-105 transition-transform duration-300">
              87%
            </p>
            <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-2 hover:scale-105 transition-transform duration-300">
              $250M+
            </p>
            <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Volume Traded</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-2 hover:scale-105 transition-transform duration-300">
              $1.2M
            </p>
            <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Monthly Payouts</p>
          </div>
        </div>
      </div>
    </section>
  )
}
