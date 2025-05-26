"use client";

import React from "react";
// Removed Alert, useEffect, useState, supabase

interface SaasMetricsProps {
  totalRevenue: number;
  totalChallenges: number;
  totalTransactions: number;
}

export default function SaasMetrics({
  totalRevenue,
  totalChallenges,
  totalTransactions,
}: SaasMetricsProps) {
  // Loading and error handling will be managed by the parent component via the hook
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Vue d&apos;ensemble
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {/* Total Revenue */}
        <div className="border-b sm:border-b-0 sm:border-r border-gray-200 px-6 py-5 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Ajout de fonds Total</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {/* Assuming totalRevenue is in cents, converting to dollars/euros for display */}
            {(totalRevenue / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} $
          </h4>
        </div>

        {/* Total Challenges */}
        <div className="border-b lg:border-b-0 lg:border-r border-gray-200 px-6 py-5 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Challenges Achetés</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {totalChallenges}
          </h4>
        </div>

        {/* Total Transactions */}
        <div className="px-6 py-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Transactions complétées</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {totalTransactions}
          </h4>
        </div>
      </div>
    </div>
  );
}
