interface InvoiceProps {
  transactions: {
    id: string;
    date: string;
    user: string;
    amount: string;
    status: 'Complete' | 'Pending' | 'Cancelled';
  }[];
}

export default function SaasInvoiceTable2({ transactions }: InvoiceProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">My Challenges</h3>
      </div>
      <div className="custom-scrollbar overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Serial No:</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">User</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td className="px-6 py-4">{txn.id}</td>
                <td className="px-6 py-4">{txn.date}</td>
                <td className="px-6 py-4">{txn.user}</td>
                <td className="px-6 py-4">{txn.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      txn.status === 'Complete'
                        ? 'bg-green-100 text-green-800'
                        : txn.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
