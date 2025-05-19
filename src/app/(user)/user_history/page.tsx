'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SaasInvoiceTable from '@/components/history/SaasInvoiceTable';
import SaasMetrics from '@/components/history/SaasMetrics';

interface MonthlyRow {
  month: string;
  total_invoices: number;
  total_payouts: number;
}

export default function UserHistoryPage() {
  const [data, setData] = useState<MonthlyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
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

      const userId = user.id;

      const { data: invoices } = await supabase
        .from("invoices")
        .select("amount, created_at")
        .eq("profile_id", userId)
        .eq("status", "accepted");

      const { data: payouts } = await supabase
        .from("payouts")
        .select("amount_tokens, processed_at")
        .eq("profile_id", userId)
        .eq("status", "accepted");

      const monthMap: Record<string, MonthlyRow> = {};

      for (const inv of invoices || []) {
        const date = new Date(inv.created_at);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { month: monthKey, total_invoices: 0, total_payouts: 0 };
        }

        monthMap[monthKey].total_invoices += inv.amount;
      }

      for (const po of payouts || []) {
        const date = new Date(po.processed_at);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { month: monthKey, total_invoices: 0, total_payouts: 0 };
        }

        monthMap[monthKey].total_payouts += po.amount_tokens;
      }

      const monthlyData = Object.values(monthMap).sort((a, b) =>
        a.month > b.month ? -1 : 1
      );

      setData(monthlyData);
      setLoading(false);
    }

    fetchData();
  }, []);

  const totalIn = data.reduce((acc, row) => acc + row.total_invoices, 0);
  const totalOut = data.reduce((acc, row) => acc + row.total_payouts, 0);
  const netAverage = data.length > 0 ? Math.round((totalIn - totalOut) / data.length) : 0;

  return (
    <div className="space-y-6 w-full">
      {error && (
        <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}

      <SaasMetrics totalRevenue={totalIn} averageProfit={netAverage} />
      <SaasInvoiceTable data={data} loading={loading} />
    </div>
  );
}
