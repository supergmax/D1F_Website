interface MetricsProps {
  totalRevenue: number;
  totalChallenges: number;
  activeChallenges: number;
  averageProfit: number;
}

export default function SaasMetrics({
  totalRevenue,
  totalChallenges,
  activeChallenges,
  averageProfit,
}: MetricsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(value || 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Aperçu de vos performances</h3>
      </div>
      <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Profit total</span>
          <div className="mt-2 flex items-end gap-3">
            <h4 className="text-title-xs font-bold text-gray-800 dark:text-white/90">
              {formatCurrency(totalRevenue)}
            </h4>
          </div>
        </div>
        <div className="border-b border-gray-200 px-6 py-5 xl:border-r xl:border-b-0 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Challenges actifs</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {activeChallenges}
          </h4>
        </div>
        <div className="border-b border-gray-200 px-6 py-5 sm:border-r sm:border-b-0 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total de challenges</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {totalChallenges}
          </h4>
        </div>
        <div className="px-6 py-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Profit moyen par challenge</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {formatCurrency(averageProfit)}
          </h4>
        </div>
      </div>
    </div>
  );
}
