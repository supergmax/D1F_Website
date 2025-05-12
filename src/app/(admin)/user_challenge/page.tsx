'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SaasMetrics from '@/components/challenges/SaasMetrics';
import SaasInvoiceTable2 from '@/components/challenges/SaasInvoiceTable';

export default function UserChallenge() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    averageProfit: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const userId = user.id;

    // 🔹 Fetch challenges
    const { data: challenges, error: challengeErr } = await supabase
      .from('challenges')
      .select('id, profit, status')
      .eq('profile_id', userId);

    // 🔹 Compute metrics
    const totalRevenue = challenges?.reduce((acc, c) => acc + (c.profit || 0), 0) || 0;
    const totalChallenges = challenges?.length || 0;
    const activeChallenges = challenges?.filter(c => c.status === 'active').length || 0;
    const averageProfit = totalChallenges ? totalRevenue / totalChallenges : 0;

    // 🔹 Fetch transactions
    const { data: txns, error: txnErr } = await supabase
      .from('invoices')
      .select('id, created_at, amount, status')
      .eq('profile_id', userId);

    // Format transactions for table
    const formattedTxns = (txns || []).map(txn => ({
      id: txn.id,
      date: new Date(txn.created_at).toLocaleDateString(),
      user: user.email,
      amount: `${txn.amount / 100} €`,
      status:
        txn.status === 'paid'
          ? 'Complete'
          : txn.status === 'pending'
          ? 'Pending'
          : 'Cancelled',
    }));

    setMetrics({ totalRevenue, totalChallenges, activeChallenges, averageProfit });
    setTransactions(formattedTxns);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-center py-10">Chargement...</p>;

  return (
    <div className="space-y-6 w-full">
      <SaasMetrics {...metrics} />
      <SaasInvoiceTable2 transactions={transactions} />
    </div>
  );
}
