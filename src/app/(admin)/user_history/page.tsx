"use client";

import { supabase } from "@/lib/supabaseClient";
import SaasInvoiceTable2 from "@/components/history/SaasInvoiceTable";
import SaasMetrics from "@/components/history/SaasMetrics";
import { useEffect, useState } from "react";

interface HistoryRow {
  month: string;
  total_gain: number | string;
  total_loss: number | string;
  token_balance_snapshot: number | string;
}

export default function UserHistoryPage() {
  const [data, setData] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setError("Erreur de session Supabase");
        setLoading(false);
        return;
      }

      const user = session?.user;
      if (!user) {
        setError("Utilisateur non connecté");
        setLoading(false);
        return;
      }

      const { data: historyData, error: historyError } = await supabase
        .from("history")
        .select("month, total_gain, total_loss, token_balance_snapshot")
        .eq("profile_id", user.id)
        .order("month", { ascending: false });

      if (historyError) {
        setError("Erreur lors de la récupération de l'historique.");
        console.error(historyError);
      } else if (historyData) {
        setData(historyData);
      }

      setLoading(false);
    }

    fetchHistory();
  }, [supabase]);

  // ✅ Convertir les valeurs en nombre pour éviter les NaN
  const totalGain = data.reduce(
    (acc, row) => acc + (Number(row.total_gain) || 0),
    0
  );

  const totalLoss = data.reduce(
    (acc, row) => acc + (Number(row.total_loss) || 0),
    0
  );

  const averageProfit =
    data.length > 0
      ? Math.round((totalGain - totalLoss) / data.length)
      : 0;

  return (
    <div className="space-y-6 w-full">
      {error && (
        <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}

      <SaasMetrics
        totalRevenue={totalGain}
        averageProfit={averageProfit}
      />

      <div className="w-full">
        <SaasInvoiceTable2 data={data} loading={loading} />
      </div>
    </div>
  );
}
