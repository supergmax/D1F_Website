"use client";

import React from "react";

interface ChallengeResult {
  id: string;
  challenge_id: string;
  date: string;
  daily_gain: number;
  daily_loss: number;
  label?: string;
  challenge?: {
    status: string;
  };
}

interface Props {
  results: ChallengeResult[];
}

export default function ChallengeResultsTable({ results }: Props) {
  const formatMonthYear = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  const getShortId = (uuid: string) => {
    return "CH" + uuid.slice(0, 3).toUpperCase(); // exemple : CH001
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Détail des performances par challenge
        </h3>
      </div>
      <div className="custom-scrollbar overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Challenge</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Gain</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">DrawDown</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {results.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 font-mono font-medium text-brand-600 dark:text-brand-400">
                  {getShortId(r.challenge_id)}
                </td>
                <td className="px-6 py-4">{formatMonthYear(r.date)}</td>
                <td className="px-6 py-4 text-green-600 font-semibold">{r.daily_gain}</td>
                <td className="px-6 py-4 text-red-600 font-semibold">
                  {r.daily_loss}/{r.daily_loss}
                </td>
                <td className="px-6 py-4 capitalize text-sm font-medium text-gray-700 dark:text-white">
                  {r.challenge?.status || "–"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
