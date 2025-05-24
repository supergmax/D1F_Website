'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type PayoutStatus = 'requested' | 'pending' | 'done' | 'failed';
type ActionStatus = 'pending' | 'done' | 'failed';

type Payout = {
  id: string;
  profile_id: string;
  amount: number;
  status: PayoutStatus;
  created_at: string;
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
};

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<(Payout & Profile)[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: payoutData, error: payoutError } = await supabase
      .from('payouts')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name');

    if (payoutError || profileError) {
      console.error('Erreur lors du chargement des données.');
      setLoading(false);
      return;
    }

    const profileMap = new Map<string, Profile>();
    profileData?.forEach((p) => profileMap.set(p.id, p));

    const combined = payoutData?.map((payout) => {
      const profile = profileMap.get(payout.profile_id);
      return {
        ...payout,
        first_name: profile?.first_name ?? '',
        last_name: profile?.last_name ?? '',
      };
    });

    setPayouts(combined || []);
    setLoading(false);
  };

  const updateStatus = async (
    payoutId: string,
    newStatus: ActionStatus
  ) => {
    setUpdatingId(payoutId);
    const { error } = await supabase
      .from('payouts')
      .update({ status: newStatus })
      .eq('id', payoutId);

    if (error) {
      console.error('Erreur lors de la mise à jour :', error.message);
    }

    await fetchData();
    setUpdatingId(null);
  };

  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8">
      <h1 className="text-xl font-semibold mb-6">Gestion des Retraits</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>ID Retrait</TableCell>
              <TableCell isHeader>Utilisateur</TableCell>
              <TableCell isHeader>Montant</TableCell>
              <TableCell isHeader>Statut</TableCell>
              <TableCell isHeader>Date</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell className="text-sm text-gray-800 dark:text-white">
                  {payout.id}
                </TableCell>

                <TableCell className="text-sm text-gray-800 dark:text-white">
                  <div className="font-semibold">
                    {payout.last_name} {payout.first_name}
                  </div>
                  <div className="text-xs text-gray-500">{payout.profile_id}</div>
                </TableCell>

                <TableCell>{payout.amount} $</TableCell>

                <TableCell className="capitalize">{payout.status}</TableCell>

                <TableCell>
                  {new Date(payout.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    {(['pending', 'done', 'failed'] as const).map((status) => (
                      <button
                        key={status}
                        disabled={updatingId === payout.id}
                        onClick={() => updateStatus(payout.id, status)}
                        className={`px-2 py-1 text-white text-xs rounded ${
                          status === 'done'
                            ? 'bg-green-600'
                            : status === 'failed'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
