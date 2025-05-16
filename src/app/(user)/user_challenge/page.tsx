'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SaasMetrics from '@/components/challenges/SaasMetrics';
import ChallengeResultsTable from '@/components/challenges/ChallengeResultsTable';

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

export default function UserChallenge() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    averageProfit: 0,
    totalGainFromResults: 0,
    totalLossFromResults: 0,
    netResultFromResults: 0,
  });

  const [results, setResults] = useState<ChallengeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const userId = user.id;

      const { data: challenges } = await supabase
        .from('challenges')
        .select('id, profit, status')
        .eq('profile_id', userId);

      const totalRevenue = challenges?.reduce((acc, c) => acc + (c.profit || 0), 0) || 0;
      const totalChallenges = challenges?.length || 0;
      const activeChallenges = challenges?.filter(c => c.status === 'active').length || 0;
      const averageProfit = totalChallenges > 0 ? totalRevenue / totalChallenges : 0;

      const { data: challengeResults } = await supabase
        .from('challenge_results')
        .select('id, challenge_id, date, daily_gain, daily_loss')
        .in('challenge_id', challenges?.map(c => c.id) || []);

      const totalGainFromResults =
        challengeResults?.reduce((acc, res) => acc + (res.daily_gain || 0), 0) || 0;
      const totalLossFromResults =
        challengeResults?.reduce((acc, res) => acc + (res.daily_loss || 0), 0) || 0;
      const netResultFromResults = totalGainFromResults - totalLossFromResults;

      setMetrics({
        totalRevenue,
        totalChallenges,
        activeChallenges,
        averageProfit,
        totalGainFromResults,
        totalLossFromResults,
        netResultFromResults,
      });

      setResults(challengeResults || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center py-10">Chargement...</p>;

  return (
    <div className="space-y-6 w-full">
      <SaasMetrics
        totalRevenue={metrics.totalRevenue}
        totalChallenges={metrics.totalChallenges}
        activeChallenges={metrics.activeChallenges}
        averageProfit={metrics.averageProfit}
        totalGainFromResults={metrics.totalGainFromResults}
        totalLossFromResults={metrics.totalLossFromResults}
        netResultFromResults={metrics.netResultFromResults}
      />
      <ChallengeResultsTable results={results} />
    </div>
  );
}
