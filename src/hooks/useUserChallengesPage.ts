'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  getUserChallengeDetails,
  getUserChallengeResults,
  UserChallengeDetail,
  UserChallengeResult,
} from '@/services/userService';

export interface ChallengePageMetrics {
  totalRevenue: number;
  totalChallenges: number;
  activeChallenges: number;
  averageProfit: number;
  totalGainFromResults: number;
  totalLossFromResults: number;
  netResultFromResults: number;
}

export const useUserChallengesPage = () => {
  const [metrics, setMetrics] = useState<ChallengePageMetrics>({
    totalRevenue: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    averageProfit: 0,
    totalGainFromResults: 0,
    totalLossFromResults: 0,
    netResultFromResults: 0,
  });
  const [challengeData, setChallengeData] = useState<UserChallengeDetail[]>([]);
  const [challengeResults, setChallengeResults] = useState<UserChallengeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.error('Session error or no session:', sessionError);
        setLoading(false);
        return;
      }

      const user = sessionData.session.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const userId = user.id;

      const fetchedChallengeDetails = await getUserChallengeDetails(userId);
      setChallengeData(fetchedChallengeDetails);

      let fetchedChallengeResults: UserChallengeResult[] = [];
      if (fetchedChallengeDetails.length > 0) {
        const challengeIds = fetchedChallengeDetails.map(c => c.id);
        fetchedChallengeResults = await getUserChallengeResults(challengeIds);
        setChallengeResults(fetchedChallengeResults);
      }

      // Calculate metrics
      const totalRevenue = fetchedChallengeDetails.reduce((acc, c) => acc + (c.profit || 0), 0);
      const totalChallenges = fetchedChallengeDetails.length;
      const activeChallenges = fetchedChallengeDetails.filter(c => c.status === 'active').length;
      const averageProfit = totalChallenges > 0 ? totalRevenue / totalChallenges : 0;

      let totalGainFromResults = 0;
      let totalLossFromResults = 0;

      fetchedChallengeResults.forEach(result => {
        // Assuming metric_value stores profit as positive and loss as negative
        // and is_passed might indicate if it's a final result entry for profit/loss
        // This logic might need adjustment based on actual data structure of 'metric_value' and 'metric_name'
        const value = parseFloat(result.metric_value);
        if (!isNaN(value)) {
          if (result.metric_name === 'profit_target_achieved' && result.is_passed) { // Example condition
             totalGainFromResults += value;
          } else if (result.metric_name === 'overall_drawdown_limit_breached' && !result.is_passed) { // Example condition
             // Or if metric_value itself is negative for losses
             // totalLossFromResults += Math.abs(value); // if value is negative
          }
          // Simplified: if metric_value can be positive or negative representing gain/loss
          if (value > 0) {
            // This is a placeholder logic, actual logic will depend on how gains/losses are stored.
            // For now, let's assume 'profit' like values are gains, and others might be losses or neutral.
            // This part needs clarification on how to interpret 'metric_value' for gains/losses from results.
            // For demonstration, let's assume a metric_name like 'trade_profit' or 'final_profit'
            if(result.metric_name === 'trade_profit' || result.metric_name === 'profit_share') {
                totalGainFromResults += value;
            }
          } else if (value < 0) {
            // if(result.metric_name === 'trade_loss') {
                totalLossFromResults += Math.abs(value);
            // }
          }
        }
      });
      // For now, using challenge profit for totalGain/Loss as challenge_results interpretation is unclear
      // This is a placeholder until the structure of challenge_results is clarified for gains/losses
      totalGainFromResults = fetchedChallengeDetails.filter(c => c.profit && c.profit > 0).reduce((acc, c) => acc + (c.profit || 0), 0);
      totalLossFromResults = fetchedChallengeDetails.filter(c => c.profit && c.profit < 0).reduce((acc, c) => acc + Math.abs(c.profit || 0), 0);


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

      setLoading(false);
    };

    fetchData();
  }, []);

  return { metrics, challengeData, challengeResults, loading };
};
