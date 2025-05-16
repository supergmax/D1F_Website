interface MetricsProps {
  totalRevenue: number;
  totalChallenges: number;
  activeChallenges: number;
  averageProfit: number;
  totalGainFromResults: number;
  totalLossFromResults: number;
  netResultFromResults: number;
}

export default function SaasMetrics({
  totalRevenue,
  totalChallenges,
  activeChallenges,
  averageProfit,
  totalGainFromResults,
  totalLossFromResults,
  netResultFromResults,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Challenges</span>
          <h4 className="mt-2 font-bold text-lg text-gray-800 dark:text-white/90">{totalChallenges}</h4>
        </div>

        <div className="p-4 border rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">Challenges actifs</span>
          <h4 className="mt-2 font-bold text-lg text-gray-800 dark:text-white/90">{activeChallenges}</h4>
        </div>

        <div className="p-4 border rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">Profit total (challenges)</span>
          <h4 className="mt-2 font-bold text-green-600 dark:text-green-400">{formatCurrency(totalRevenue)}</h4>
        </div>

        <div className="p-4 border rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">Profit moyen / challenge</span>
          <h4 className="mt-2 font-bold text-gray-800 dark:text-white/90">{formatCurrency(averageProfit)}</h4>
        </div>

        <div className="p-4 border rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">Gains cumulés (journaliers)</span>
          <h4 className="mt-2 font-bold text-green-600 dark:text-green-400">{formatCurrency(totalGainFromResults)}</h4>
        </div>

        <div className="p-4 border rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">Pertes cumulées (journalières)</span>
          <h4 className="mt-2 font-bold text-red-600 dark:text-red-400">{formatCurrency(totalLossFromResults)}</h4>
        </div>

        <div className="p-4 border rounded-lg col-span-full">
          <span className="text-sm text-gray-500 dark:text-gray-400">Résultat net (journaliers)</span>
          <h4 className={`mt-2 font-bold text-lg ${
            netResultFromResults >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(netResultFromResults)}
          </h4>
        </div>
      </div>
    </div>
  );
}
