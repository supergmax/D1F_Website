'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SaasMetrics from '@/components/challenges/SaasMetrics';
import SaasInvoiceTable2 from '@/components/challenges/SaasInvoiceTable';
import ChallengeResultsTable from '@/components/challenges/ChallengeResultsTable'; // Nouveau composant

interface Challenge {
  id: string;
  profit: number;
  status: string;
}

interface ChallengeResult {
  id: string;
  challenge_id: string;
  date: string;
  daily_gain: number;
  daily_loss: number;
}

interface Invoice {
  id: string;
  created_at: string;
  amount: number;
  status: string;
}

interface Transaction {
  id: string;
  date: string;
  user: string;
  amount: string;
  status: 'Complete' | 'Pending' | 'Cancelled';
}

export default function UserChallenge() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    averageProfit: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [results, setResults] = useState<ChallengeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const userId = user.id;

      // 🔹 Fetch challenges
      const { data: challenges } = await supabase
        .from('challenges')
        .select('id, profit, status')
        .eq('profile_id', userId);

      const totalRevenue = challenges?.reduce((acc, c) => acc + (c.profit || 0), 0) || 0;
      const totalChallenges = challenges?.length || 0;
      const activeChallenges = challenges?.filter(c => c.status === 'active').length || 0;
      const averageProfit = totalChallenges > 0 ? totalRevenue / totalChallenges : 0;

      // 🔹 Fetch invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id, created_at, amount, status')
        .eq('profile_id', userId);

      const formattedTxns: Transaction[] = (invoices || []).map(inv => ({
        id: inv.id,
        date: new Date(inv.created_at).toLocaleDateString('fr-FR'),
        user: user.email || '',
        amount: `${(inv.amount / 100).toFixed(2)} €`,
        status:
          inv.status === 'paid'
            ? 'Complete'
            : inv.status === 'pending'
            ? 'Pending'
            : 'Cancelled',
      }));

      // 🔹 Fetch challenge_results
      const { data: challengeResults } = await supabase
        .from('challenge_results')
        .select('id, challenge_id, date, daily_gain, daily_loss');

      setMetrics({ totalRevenue, totalChallenges, activeChallenges, averageProfit });
      setTransactions(formattedTxns);
      setResults(challengeResults || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center py-10">Chargement...</p>;

  return (
    <div className="space-y-6 w-full">
      <SaasMetrics {...metrics} />
      <ChallengeResultsTable results={results} />
    </div>
  );
}
