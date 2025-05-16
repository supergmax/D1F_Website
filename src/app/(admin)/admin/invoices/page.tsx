'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur de chargement des factures :", error);
    } else {
      setInvoices(data);
    }

    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: 'open' | 'paid' | 'failed') => {
    const { error } = await supabase
      .from('invoices')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } else {
      fetchInvoices(); // Refresh
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8">
      <h1 className="text-xl font-semibold mb-6">Gestion des Factures</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Montant</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-left">Créé le</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2">{inv.id}</td>
                <td className="px-4 py-2">{inv.amount} €</td>
                <td className="px-4 py-2 capitalize">{inv.status}</td>
                <td className="px-4 py-2">{new Date(inv.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => updateStatus(inv.id, 'open')}
                    className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => updateStatus(inv.id, 'paid')}
                    className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => updateStatus(inv.id, 'failed')}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
