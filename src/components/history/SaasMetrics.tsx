import React from "react";

interface MetricsProps {
  totalRevenue: number;
  averageProfit: number;
  activeUsers: number;
}

export default function SaasMetrics({
  totalRevenue,
  averageProfit,
  activeUsers,
}: MetricsProps) {
  const safeRevenue = Number.isFinite(totalRevenue) ? totalRevenue : 0;
  const safeAverage = Number.isFinite(averageProfit) ? averageProfit : 0;
  const safeUsers = Number.isFinite(activeUsers) ? activeUsers : 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Vue d'ensemble
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {/* Gain Total */}
        <div className="border-b sm:border-b-0 sm:border-r border-gray-200 px-6 py-5 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Ajout de fonds Total</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {safeRevenue.toLocaleString("fr-FR")} $
          </h4>
        </div>

        {/* Profit Moyen */}
        <div className="border-b lg:border-b-0 lg:border-r border-gray-200 px-6 py-5 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Nombre de Challenge Acheté</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {safeAverage.toLocaleString("fr-FR")} $
          </h4>
        </div>

        {/* Utilisateurs Actifs */}
        <div className="px-6 py-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Nombre de Transaction</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {safeUsers.toLocaleString("fr-FR")}
          </h4>
        </div>
      </div>
    </div>
  );
}

/*
utilisation

<SaasMetrics
  totalRevenue={12893.5}
  averageProfit={523.25}
  activeUsers={271}
/>
*/