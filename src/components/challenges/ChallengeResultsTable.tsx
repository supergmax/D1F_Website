"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ChallengeResult {
  id: string;
  challenge_id: string;
  date: string;
  daily_gain: number;
  daily_loss: number;
  challenge: {
    status: string;
  };
}

export default function ChallengeResultsTable() {
  const [results, setResults] = useState<ChallengeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) {
        setError("Utilisateur non connecté.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("challenge_results")
        .select("id, challenge_id, date, daily_gain, daily_loss, challenges(status)")
        .eq("challenges.profile_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        setError("Erreur de chargement : " + error.message);
      } else {
        setResults(data as ChallengeResult[]);
      }

      setLoading(false);
    };

    fetchResults();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Chargement...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Listes des Challenges
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
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {results.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4">{r.challenge_id}</td>
                <td className="px-6 py-4">{new Date(r.date).toLocaleDateString("fr-FR")}</td>
                <td className="px-6 py-4 text-green-600 font-medium">{r.daily_gain}</td>
                <td className="px-6 py-4 text-red-600 font-medium">{r.daily_loss}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-white">
                  {r.challenge?.status ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
