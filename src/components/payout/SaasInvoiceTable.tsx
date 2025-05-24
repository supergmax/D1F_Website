interface Payout {
  id: string;
  created_at: string;
  amount_tokens: number | string;
  status: 'requested' | 'pending' | 'done' | 'failed';
}

interface InvoiceProps {
  data: Payout[];
  loading?: boolean;
}

export default function SaasInvoiceTable({
  data,
  loading = false,
}: InvoiceProps) {
  if (loading) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-300">
        Chargement des paiements...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Historique des retraits
        </h3>
      </div>
      <div className="custom-scrollbar overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Montant ($)</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Statut</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Facture</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.map((txn) => {
              const montant = Number(txn.amount_tokens);
              const montantFormate = !isNaN(montant) ? `${montant.toLocaleString('fr-FR')} WT` : '–';

              const statutLibelle = {
                done: 'Payé',
                requested: 'En attente',
                pending: 'Approuvé',
                failed: 'Refusé',
              }[txn.status];

              const statutCouleur = {
                done: 'bg-green-100 text-green-800',
                requested: 'bg-yellow-100 text-yellow-800',
                pending: 'bg-blue-100 text-blue-800',
                failed: 'bg-red-100 text-red-800',
              }[txn.status];

              return (
                <tr key={txn.id}>
                  <td className="px-6 py-4 font-mono text-sm">{txn.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4">
                    {new Date(txn.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">{montantFormate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statutCouleur}`}>
                      {statutLibelle}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
