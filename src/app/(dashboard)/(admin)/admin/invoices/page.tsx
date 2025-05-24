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

type InvoiceStatus = 'requested' | 'pending' | 'done' | 'failed';
type ActionStatus = 'pending' | 'done' | 'failed';

type Invoice = {
  id: string;
  profile_id: string;
  amount: number;
  status: InvoiceStatus;
  created_at: string;
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
};

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<(Invoice & Profile)[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name');

    if (invoiceError || profileError) {
      console.error('Erreur lors du chargement des données.');
      setLoading(false);
      return;
    }

    const profileMap = new Map<string, Profile>();
    profileData?.forEach((p) => profileMap.set(p.id, p));

    const combined = invoiceData?.map((inv) => {
      const profile = profileMap.get(inv.profile_id);
      return {
        ...inv,
        first_name: profile?.first_name ?? '',
        last_name: profile?.last_name ?? '',
      };
    });

    setInvoices(combined || []);
    setLoading(false);
  };

  const updateStatus = async (
    invoiceId: string,
    newStatus: ActionStatus
  ) => {
    setUpdatingId(invoiceId);
    const { error } = await supabase
      .from('invoices')
      .update({ status: newStatus })
      .eq('id', invoiceId);

    if (error) {
      console.error('Erreur lors de la mise à jour :', error.message);
    }

    await fetchData();
    setUpdatingId(null);
  };

  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8">
      <h1 className="text-xl font-semibold mb-6">Gestion des Factures</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>ID Facture</TableCell>
              <TableCell isHeader>Utilisateur</TableCell>
              <TableCell isHeader>Montant</TableCell>
              <TableCell isHeader>Statut</TableCell>
              <TableCell isHeader>Date</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="text-sm text-gray-800 dark:text-white">
                  {inv.id}
                </TableCell>

                <TableCell className="text-sm text-gray-800 dark:text-white">
                  <div className="font-semibold">
                    {inv.last_name} {inv.first_name}
                  </div>
                  <div className="text-xs text-gray-500">{inv.profile_id}</div>
                </TableCell>

                <TableCell>{inv.amount} $</TableCell>

                <TableCell className="capitalize">{inv.status}</TableCell>

                <TableCell>
                  {new Date(inv.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    {(['pending', 'done', 'failed'] as const).map((status) => (
                      <button
                        key={status}
                        disabled={updatingId === inv.id}
                        onClick={() => updateStatus(inv.id, status)}
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
