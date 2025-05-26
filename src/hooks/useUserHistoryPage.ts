'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  getUserDoneInvoices,
  getUserDonePayouts,
  UserInvoice,
  UserPayout,
  getUserTotalChallenges,
  getUserTotalDoneTransactions,
  getLatestTransactions,
  TransactionRow, // Assuming TransactionRow is exported from userService.ts
} from '@/services/userService';

export interface MonthlyRow {
  month: string; // YYYY-MM
  total_invoices: number;
  total_payouts: number;
}

export interface OverallMetrics { // Renamed from SummaryMetrics
  totalIn: number;
  totalOut: number;
  netAverage: number;
}

export interface AdditionalMetrics {
  totalUserChallenges: number;
  totalUserDoneTransactions: number;
}

export const useUserHistoryPage = () => {
  const [monthlySummaryData, setMonthlySummaryData] = useState<MonthlyRow[]>([]); // Renamed from data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallMetrics, setOverallMetrics] = useState<OverallMetrics>({ // Renamed from summaryMetrics
    totalIn: 0,
    totalOut: 0,
    netAverage: 0,
  });
  const [additionalMetrics, setAdditionalMetrics] = useState<AdditionalMetrics>({
    totalUserChallenges: 0,
    totalUserDoneTransactions: 0,
  });
  const [latestTransactionsData, setLatestTransactionsData] = useState<TransactionRow[]>([]);

  useEffect(() => {
    const fetchDataAndProcess = async () => {
      setLoading(true);
      setError(null);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        setError(sessionError?.message || 'User not authenticated.');
        setLoading(false);
        return;
      }

      const user = sessionData.session.user;
      if (!user) {
        setError('User not found.');
        setLoading(false);
        return;
      }

      const userId = user.id;

      try {
        // Fetch all data concurrently
        const [
          invoices, 
          payouts, 
          challengesCountResult, 
          doneTransactionsCountResult, 
          latestTransactionsResult
        ] = await Promise.all([
          getUserDoneInvoices(userId),
          getUserDonePayouts(userId),
          getUserTotalChallenges(userId),
          getUserTotalDoneTransactions(userId),
          getLatestTransactions(userId),
        ]);

        // Process invoices and payouts for monthly summary
        const monthlyDataMap = new Map<string, { total_invoices: number; total_payouts: number }>();

        invoices.forEach(invoice => {
          const month = invoice.created_at.substring(0, 7); // YYYY-MM
          const current = monthlyDataMap.get(month) || { total_invoices: 0, total_payouts: 0 };
          current.total_invoices += invoice.amount; 
          monthlyDataMap.set(month, current);
        });

        payouts.forEach(payout => {
          const month = payout.processed_at.substring(0, 7); // YYYY-MM
          const current = monthlyDataMap.get(month) || { total_invoices: 0, total_payouts: 0 };
          current.total_payouts += payout.amount_tokens;
          monthlyDataMap.set(month, current);
        });

        const processedMonthlyData: MonthlyRow[] = Array.from(monthlyDataMap.entries()).map(
          ([month, totals]) => ({
            month,
            ...totals,
          })
        );
        processedMonthlyData.sort((a, b) => b.month.localeCompare(a.month));
        setMonthlySummaryData(processedMonthlyData);

        // Calculate overall metrics
        let totalIn = 0;
        let totalOut = 0;
        processedMonthlyData.forEach(row => {
          totalIn += row.total_invoices;
          totalOut += row.total_payouts;
        });
        const netAverage = processedMonthlyData.length > 0 ? (totalIn - totalOut) / processedMonthlyData.length : 0;
        setOverallMetrics({
          totalIn,
          totalOut,
          netAverage,
        });

        // Set additional metrics
        if (challengesCountResult.error) console.error('Error fetching total challenges:', challengesCountResult.error);
        if (doneTransactionsCountResult.error) console.error('Error fetching total done transactions:', doneTransactionsCountResult.error);
        setAdditionalMetrics({
          totalUserChallenges: challengesCountResult.count ?? 0,
          totalUserDoneTransactions: doneTransactionsCountResult.count ?? 0,
        });

        // Set latest transactions data
        if (latestTransactionsResult.error) console.error('Error fetching latest transactions:', latestTransactionsResult.error);
        setLatestTransactionsData(latestTransactionsResult.data || []);

      } catch (e: any) {
        console.error('Error fetching or processing history data:', e);
        setError(e.message || 'Failed to fetch history data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndProcess();
  }, []);

  return { monthlySummaryData, overallMetrics, additionalMetrics, latestTransactionsData, loading, error };
};
