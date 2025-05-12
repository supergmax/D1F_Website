'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SaasInvoiceTable from '@/components/history/SaasInvoiceTable';
import SaasMetrics from '@/components/history/SaasMetrics';

interface HistoryRow {
  month: string;
  total_gain: number;
  total_loss: number;
  token_balance_snapshot: number;
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
        const parsed = historyData.map((row) => ({
          month: row.month,
          total_gain: Number(row.total_gain) || 0,
          total_loss: Number(row.total_loss) || 0,
          token_balance_snapshot: Number(row.token_balance_snapshot) || 0,
        }));
        setData(parsed);
      }

      setLoading(false);
    }

    fetchHistory();
  }, []);

  const totalGain = data.reduce((acc, row) => acc + row.total_gain, 0);
  const totalLoss = data.reduce((acc, row) => acc + row.total_loss, 0);
  const averageProfit = data.length > 0 ? Math.round((totalGain - totalLoss) / data.length) : 0;

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
        <SaasInvoiceTable data={data} loading={loading} />
      </div>
    </div>
  );
}
