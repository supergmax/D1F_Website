"use client";

import React from "react";

interface SaasMetricsProps {
  totalRevenue: number;
  totalChallenges: number;
  activeChallenges: number;
  averageProfit: number;
  tokenBalance: number;
  dollarBalance: number;
}

export default function SaasMetrics({
  totalRevenue,
  totalChallenges,
  activeChallenges,
  averageProfit,
  tokenBalance,
  dollarBalance,
}: SaasMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Profit</h4>
        <p className="mt-2 text-2xl font-semibold text-green-600 dark:text-green-400">
          ${totalRevenue.toFixed(2)}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Challenges</h4>
        <p className="mt-2 text-2xl font-semibold text-blue-600 dark:text-blue-400">
          {activeChallenges}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Challenges</h4>
        <p className="mt-2 text-2xl font-semibold text-blue-600 dark:text-blue-400">
          {totalChallenges}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance</h4>
        <p className="mt-2 text-2xl font-semibold text-blue-600 dark:text-blue-400">
          {tokenBalance.toFixed(2)} WUT
        </p>
        <p className="mt-2 text-2xl font-semibold text-blue-600 dark:text-blue-400">
          ${dollarBalance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
