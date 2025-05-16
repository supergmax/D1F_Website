interface MetricsProps {
  totalRevenue: number;
  averageProfit: number;
}

export default function SaasMetrics({ totalRevenue, averageProfit }: MetricsProps) {
  const safeRevenue = Number.isFinite(totalRevenue) ? totalRevenue : 0;
  const safeAverage = Number.isFinite(averageProfit) ? averageProfit : 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Vue d'ensemble</h3>
      </div>
      <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-5 sm:border-r dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Rechargé (€)</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {(safeRevenue / 100).toLocaleString("fr-FR")} €
          </h4>
        </div>
        <div className="px-6 py-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Profit net moyen (€)</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {(safeAverage / 100).toLocaleString("fr-FR")} €
          </h4>
        </div>
      </div>
    </div>
  );
}
