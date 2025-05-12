"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SaasMetricsProps {
  profileId: string;
}

export default function SaasMetrics({ profileId }: SaasMetricsProps) {

  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [activeChallenges, setActiveChallenges] = useState(0);
  const [averageProfit, setAverageProfit] = useState(0);

  useEffect(() => {
    async function fetchMetrics() {
      let gain = 0;
      let total = 0;
      let active = 0;

      // 1. Total des gains (table: history)
      const { data: gainData, error: gainError } = await supabase
        .from("history")
        .select("total_gain")
        .eq("profile_id", profileId);

      if (!gainError && gainData) {
        gain = gainData.reduce((sum, item) => sum + (item.total_gain || 0), 0);
      }

      // 2. Challenges (table: challenges)
      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .select("status")
        .eq("profile_id", profileId);

      if (!challengeError && challengeData) {
        total = challengeData.length;
        active = challengeData.filter((c) => c.status === "active").length;
      }

      setTotalRevenue(gain);
      setTotalChallenges(total);
      setActiveChallenges(active);
      setAverageProfit(total > 0 ? Math.round(gain / total) : 0);
      setLoading(false);
    }

    fetchMetrics();
  }, [profileId, supabase]);

  if (loading) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-300">
        Chargement des métriques...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Vue d'ensemble
        </h3>
      </div>
      <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Profit Total</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {totalRevenue.toLocaleString()} €
          </h4>
        </div>
        <div className="border-b border-gray-200 px-6 py-5 xl:border-r xl:border-b-0 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Challenges Actifs</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {activeChallenges}
          </h4>
        </div>
        <div className="border-b border-gray-200 px-6 py-5 sm:border-r sm:border-b-0 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Challenges Total</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {totalChallenges}
          </h4>
        </div>
        <div className="px-6 py-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">Profit Moyen / Challenge</span>
          <h4 className="mt-2 text-title-xs font-bold text-gray-800 dark:text-white/90">
            {averageProfit.toLocaleString()} €
          </h4>
        </div>
      </div>
    </div>
  );
}
