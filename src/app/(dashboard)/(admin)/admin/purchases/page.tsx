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

type PurchaseStatus = 'requested' | 'pending' | 'done' | 'failed';
type ActionStatus = 'pending' | 'done' | 'failed';

type Purchase = {
  id: string;
  profile_id: string;
  product_id: string;
  quantity: number;
  amount: number;
  status: PurchaseStatus;
  created_at: string;
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
};

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<(Purchase & Profile)[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name');

    if (purchaseError || profileError) {
      console.error('Erreur lors du chargement des données.');
      setLoading(false);
      return;
    }

    const profileMap = new Map<string, Profile>();
    profileData?.forEach((p) => profileMap.set(p.id, p));

    const combined = purchaseData?.map((p) => {
      const profile = profileMap.get(p.profile_id);
      return {
        ...p,
        first_name: profile?.first_name ?? '',
        last_name: profile?.last_name ?? '',
      };
    });

    setPurchases(combined || []);
    setLoading(false);
  };

  const updateStatus = async (
    purchaseId: string,
    newStatus: ActionStatus
  ) => {
    setUpdatingId(purchaseId);
    const { error } = await supabase
      .from('purchases')
      .update({ status: newStatus })
      .eq('id', purchaseId);

    if (error) {
      console.error('Erreur lors de la mise à jour :', error.message);
    }

    await fetchData();
    setUpdatingId(null);
  };

  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8">
      <h1 className="text-xl font-semibold mb-6">Validation des Challenges</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>ID Achat</TableCell>
              <TableCell isHeader>Utilisateur</TableCell>
              <TableCell isHeader>Quantité</TableCell>
              <TableCell isHeader>Montant</TableCell>
              <TableCell isHeader>Statut</TableCell>
              <TableCell isHeader>Date</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="text-sm text-gray-800 dark:text-white">
                  {purchase.id}
                </TableCell>

                <TableCell className="text-sm text-gray-800 dark:text-white">
                  <div className="font-semibold">
                    {purchase.last_name} {purchase.first_name}
                  </div>
                  <div className="text-xs text-gray-500">{purchase.profile_id}</div>
                </TableCell>

                <TableCell>{purchase.quantity}</TableCell>
                <TableCell>{purchase.amount} tokens</TableCell>
                <TableCell className="capitalize">{purchase.status}</TableCell>
                <TableCell>{new Date(purchase.created_at).toLocaleDateString()}</TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    {(['pending', 'done', 'failed'] as const).map((status) => (
                      <button
                        key={status}
                        disabled={updatingId === purchase.id}
                        onClick={() => updateStatus(purchase.id, status)}
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
