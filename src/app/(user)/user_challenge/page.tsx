'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SaasMetrics from '@/components/challenges/SaasMetrics';
import ChallengeDetailsTable from '@/components/challenges/ChallengeDetailsTable';
import ChallengeResultsTable from '@/components/challenges/ChallengeResultsTable';

interface Challenge {
  id: string;
  profile_id: string;
  name: string;
  challenge_num: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  initial_balance: number;
  profit: number;
  note?: string | null;
  label: string;
  created_at: string;
  updated_at: string;
}

interface ChallengeResult {
  id: string;
  challenge_id: string;
  date: string;
  daily_gain: number;
  daily_loss: number;
  note?: string | null;
  label: string;
  created_at: string;
  updated_at: string;
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

  const [challengeData, setChallengeData] = useState<Challenge[]>([]);
  const [challengeResults, setChallengeResults] = useState<ChallengeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: challenges, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('profile_id', user.id);

      if (challengeError || !challenges) {
        console.error('Erreur récupération challenges:', challengeError?.message);
        setLoading(false);
        return;
      }

      const { data: results, error: resultError } = await supabase
        .from('challenge_results')
        .select('*')
        .in('challenge_id', challenges.map((c) => c.id));

      if (resultError || !results) {
        console.error('Erreur récupération résultats:', resultError?.message);
        setLoading(false);
        return;
      }

      // Metrics
      const totalRevenue = challenges.reduce((acc, c) => acc + (c.profit || 0), 0);
      const totalChallenges = challenges.length;
      const activeChallenges = challenges.filter((c) => c.status === 'active').length;
      const averageProfit = totalChallenges > 0 ? totalRevenue / totalChallenges : 0;
      const totalGainFromResults = results.reduce((acc, r) => acc + (r.daily_gain || 0), 0);
      const totalLossFromResults = results.reduce((acc, r) => acc + (r.daily_loss || 0), 0);
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

      setChallengeData(challenges);
      setChallengeResults(results);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center py-10">Chargement des données...</p>;

  return (
    <div className="space-y-6 w-full">
      <SaasMetrics {...metrics} />
      <ChallengeDetailsTable challenges={challengeData} />
      <ChallengeResultsTable results={challengeResults} />
    </div>
  );
}
