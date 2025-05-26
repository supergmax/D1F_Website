'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import {
  getUserProfile,
  getUserChallenges,
  getUserInvoices,
  UserProfile,
  UserChallenge,
  UserInvoice,
} from '../services/userService';

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
  status: 'done' | 'requested' | 'cancelled';
}

export const useUserDashboard = () => {
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

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        router.push('/auth/signin');
        return;
      }

      const user = sessionData.session.user;

      if (!user) {
        router.push('/auth/signin');
        return;
      }

      const profileId = user.id;

      const challenges = await getUserChallenges(profileId);
      const profile = await getUserProfile(profileId);
      const invoices = await getUserInvoices(profileId);

      const totalRevenue = challenges.reduce((acc, c) => acc + (c.profit || 0), 0);
      const totalChallenges = challenges.length;
      const activeChallenges = challenges.filter(c => c.status === 'active').length;
      const averageProfit = totalChallenges > 0 ? totalRevenue / totalChallenges : 0;

      setMetrics({
        totalRevenue,
        totalChallenges,
        activeChallenges,
        averageProfit,
      });

      const formattedTx = invoices.map((inv: UserInvoice): Transaction => ({
        id: inv.id,
        date: new Date(inv.created_at).toLocaleDateString('fr-FR'),
        user: `${profile?.first_name || 'Utilisateur'} ${profile?.last_name || ''}`,
        amount: `${(inv.amount / 100).toFixed(2)} €`,
        status:
          inv.status === 'done'
            ? 'done'
            : inv.status === 'requested'
            ? 'requested'
            : 'cancelled',
      }));

      setTransactions(formattedTx);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  return { metrics, transactions, loading };
};
