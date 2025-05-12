'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import ChurnRateChart from '@/components/dashboard/ChurnRate';
import ChurnRateChart2 from '@/components/dashboard/ChurnRate2';
import ChurnRateChart3 from '@/components/dashboard/ChurnRate3';
import ChurnRateChart4 from '@/components/dashboard/ChurnRate4';

import ProductPerformanceTab from '@/components/dashboard/ProductPerformanceTab';
import SaasInvoiceTable from '@/components/dashboard/SaasInvoiceTable';
import SaasMetrics from '@/components/dashboard/SaasMetrics';

export default function UserDashboard() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    averageProfit: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/signin');
        return;
      }

      const user_id = session.user.id;

      // 🔸 Metrics (table: challenges)
      const { data: challenges } = await supabase
        .from('challenges')
        .select('initial_balance, profit, status')
        .eq('profile_id', user_id);

      const totalRevenue = challenges?.reduce((acc, c) => acc + (c.profit || 0), 0);
      const totalChallenges = challenges?.length || 0;
      const activeChallenges = challenges?.filter(c => c.status === 'active').length || 0;
      const averageProfit = totalChallenges > 0 ? totalRevenue / totalChallenges : 0;

      setMetrics({ totalRevenue, totalChallenges, activeChallenges, averageProfit });

      // 🔸 Transactions (table: invoices)
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id, created_at, amount, status')
        .eq('profile_id', user_id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user_id)
        .single();

      const formattedTx = (invoices || []).map((inv: any) => ({
        id: inv.id,
        date: new Date(inv.created_at).toLocaleDateString(),
        amount: `${(inv.amount / 100).toFixed(2)} €`,
        user: `${profile?.first_name || 'User'} ${profile?.last_name || ''}`,
        status:
          inv.status === 'paid'
            ? 'Complete'
            : inv.status === 'open'
            ? 'Pending'
            : 'Cancelled',
      }));

      setTransactions(formattedTx);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <SaasMetrics {...metrics} />

      <div className="flex w-full gap-4">
        <div className="flex-1">
          <ChurnRateChart />
        </div>
        <div className="flex-1">
          <ChurnRateChart2 />
        </div>
        <div className="flex-1">
          <ChurnRateChart3 />
        </div>
      </div>

      <div className="gap-6 space-y-5 sm:space-y-6 xl:grid xl:grid-cols-12 xl:space-y-0">
        <div className="xl:col-span-7 2xl:col-span-8">
          <div className="space-y-5 sm:space-y-6">
            <ChurnRateChart4 />
            <SaasInvoiceTable transactions={transactions} />
          </div>
        </div>
        <div className="space-y-5 sm:space-y-6 xl:col-span-5 2xl:col-span-4">
          <ProductPerformanceTab />
        </div>
      </div>
    </div>
  );
}
