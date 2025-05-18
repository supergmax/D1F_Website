interface MonthlyRow {
  month: string;
  total_invoices: number;
  total_payouts: number;
}

interface InvoiceProps {
  data: MonthlyRow[];
  loading: boolean;
}

export default function SaasInvoiceTable({ data, loading }: InvoiceProps) {
  if (loading) {
    return <p className="p-4 text-gray-600">Chargement de l’historique...</p>;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Historique</h3>
      </div>
      <div className="custom-scrollbar overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Mois</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">In / out</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Montant</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.map((row, index) => {
              const net = row.total_invoices - row.total_payouts;
              const status =
                net > 0 ? "Recharge" : net < 0 ? "Retrait" : "Équilibre";

              return (
                <tr key={index}>
                  <td className="px-6 py-4">{row.month}</td>
                  <td className="px-6 py-4 text-green-600">
                    {(row.total_invoices / 100).toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 text-red-600">{row.total_payouts} WT</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        status === "Recharge"
                          ? "bg-green-100 text-green-800"
                          : status === "Retrait"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {status}
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
