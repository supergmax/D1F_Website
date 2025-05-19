'use client';
import React from 'react';

interface Challenge {
  id: string;
  profile_id: string;
  name: string;
  challenge_num: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  initial_balance: number;
  profit: number;
  note?: string | null;
  label: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  challenges: Challenge[];
}

export default function ChallengeDetailsTable({ challenges }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Mes Challenges
        </h3>
      </div>
      <div className="custom-scrollbar overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Nom</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">#</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Statut</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Profit</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Début</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Fin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {challenges.map((ch) => (
              <tr key={ch.id}>
                <td className="px-6 py-4">{ch.name}</td>
                <td className="px-6 py-4">{ch.challenge_num}</td>
                <td className="px-6 py-4 capitalize">{ch.status}</td>
                <td className="px-6 py-4 text-green-600 font-medium">{ch.profit} $</td>
                <td className="px-6 py-4">{ch.start_date || '—'}</td>
                <td className="px-6 py-4">{ch.end_date || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
