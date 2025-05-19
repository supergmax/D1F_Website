'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SaasMetrics from '@/components/challenges/SaasMetrics';
import ChallengeResultsTable from '@/components/challenges/ChallengeResultsTable';

interface Challenge {
  id: string;
  name: string;
  status: string;
  profit: number;
  initial_balance: number;
  start_date: string | null;
}

interface ChallengeResult {
  id: string;
  challenge_id: string;
  date: string;
  daily_gain: number;
  daily_loss: number;
}

export default function UserChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [results, setResults] = useState<ChallengeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;

      const { data: challengesData } = await supabase
        .from('challenges')
        .select('id, name, profit, status, initial_balance, start_date')
        .eq('profile_id', user.id);

      const challengeIds = challengesData?.map((c) => c.id) || [];

      const { data: resultsData } = await supabase
        .from('challenge_results')
        .select('id, challenge_id, date, daily_gain, daily_loss')
        .in('challenge_id', challengeIds);

      setChallenges(challengesData || []);
      setResults(resultsData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center py-10">Chargement...</p>;

  const totalChallenges = challenges.length;
  const activeChallenges = challenges.filter(c => c.status === 'active').length;
  const totalRevenue = challenges.reduce((acc, c) => acc + (c.profit || 0), 0);
  const averageProfit = totalChallenges > 0 ? totalRevenue / totalChallenges : 0;

  const totalGain = results.reduce((sum, r) => sum + (r.daily_gain || 0), 0);
  const totalLoss = results.reduce((sum, r) => sum + (r.daily_loss || 0), 0);
  const netResult = totalGain - totalLoss;

  return (
    <div className="space-y-6 w-full">
      <SaasMetrics
        totalRevenue={totalRevenue}
        totalChallenges={totalChallenges}
        activeChallenges={activeChallenges}
        averageProfit={averageProfit}
        totalGainFromResults={totalGain}
        totalLossFromResults={totalLoss}
        netResultFromResults={netResult}
      />
      <ChallengeResultsTable challenges={challenges} results={results} />
    </div>
  );
}
