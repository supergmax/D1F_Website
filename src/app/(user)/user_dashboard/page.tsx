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

interface Metrics {
  totalRevenue: number;
  totalChallenges: number;
  activeChallenges: number;
  averageProfit: number;
}

interface Transaction {
  id: string;
  date: string;
  user: string;
  amount: string;
  status: 'Complete' | 'Pending' | 'Cancelled';
}

export default function UserDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    averageProfit: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        router.push('/signin');
        return;
      }

      const profileId = user.id;

      // 🔸 Fetch challenges (pour calculer les métriques)
      const { data: challenges } = await supabase
        .from('challenges')
        .select('profit, status')
        .eq('profile_id', profileId);

      const totalRevenue = challenges?.reduce((acc, c) => acc + (c.profit || 0), 0) || 0;
      const totalChallenges = challenges?.length || 0;
      const activeChallenges = challenges?.filter(c => c.status === 'active').length || 0;
      const averageProfit = totalChallenges > 0 ? totalRevenue / totalChallenges : 0;

      setMetrics({
        totalRevenue,
        totalChallenges,
        activeChallenges,
        averageProfit,
      });

      // 🔸 Fetch invoices (pour la table)
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id, created_at, amount, status')
        .eq('profile_id', profileId);

      // 🔸 Fetch user profile (pour afficher le nom)
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', profileId)
        .single();

      const formattedTx = (invoices || []).map((inv): Transaction => ({
        id: inv.id,
        date: new Date(inv.created_at).toLocaleDateString('fr-FR'),
        user: `${profile?.first_name || 'Utilisateur'} ${profile?.last_name || ''}`,
        amount: `${(inv.amount / 100).toFixed(2)} €`,
        status:
          inv.status === 'paid'
            ? 'Complete'
            : inv.status === 'pending'
            ? 'Pending'
            : 'Cancelled',
      }));

      setTransactions(formattedTx);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="text-center py-10">Chargement du tableau de bord...</div>;

  return (
    <div className="space-y-6">
      <SaasMetrics {...metrics} />

      <div className="flex w-full gap-4">
        <div className="flex-1"><ChurnRateChart /></div>
        <div className="flex-1"><ChurnRateChart2 /></div>
        <div className="flex-1"><ChurnRateChart3 /></div>
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
