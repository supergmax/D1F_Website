"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Alert from "@/components/ui/alert/Alert";

export default function SaasMetrics() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
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

      try {
        // 1. Total Revenue : invoices (en centimes → €)
        const { data: invoices, error: invoiceError } = await supabase
          .from("invoices")
          .select("amount")
          .eq("profile_id", user.id)
          .eq("status", "accepted");

        if (invoiceError) throw new Error(invoiceError.message);
        const revenueSum = invoices?.reduce((sum, inv) => sum + inv.amount, 0) ?? 0;
        setTotalRevenue(revenueSum); // conversion en euros

        // 2. Total Challenges
        const { count: challengeCount, error: challengeError } = await supabase
          .from("challenges")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", user.id);

        if (challengeError) throw new Error(challengeError.message);
        setTotalChallenges(challengeCount ?? 0);

        // 3. Total Transactions avec filtre `status = accepted`
        const { count: transactionCount, error: transactionError } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", user.id)
          .eq("status", "accepted");

        if (transactionError) throw new Error(transactionError.message);
        setTotalTransactions(transactionCount ?? 0);
      } catch (err: any) {
        setError("Erreur lors du chargement des métriques : " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <p className="p-4 text-gray-600">Chargement des métriques...</p>;
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="error" title="Erreur" message={error} />
      </div>
    );
  }

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
            {totalRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} $
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
