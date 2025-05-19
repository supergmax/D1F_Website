'use client';

import React from 'react';
import Badge from '../ui/badge/Badge';

type TransactionStatus = 'accepted' | 'pending' | 'cancelled';

interface Transaction {
  id: string;
  date: string;
  user: string;
  amount: string;
  status: TransactionStatus;
}

interface Props {
  transactions: Transaction[];
}

export default function SaasInvoiceTable({ transactions }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Invoices
        </h3>
      </div>
      <div className="custom-scrollbar overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                Serial No:
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                Close Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                User
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-700 dark:text-gray-400">
                  {transaction.id}
                </td>
                <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-700 dark:text-gray-400">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-700 dark:text-gray-400">
                  {transaction.user}
                </td>
                <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-700 dark:text-gray-400">
                  {transaction.amount}
                </td>
                <td className="px-6 py-4 text-left">
                  <Badge
                    size="sm"
                    color={
                      transaction.status === 'accepted'
                        ? 'success'
                        : transaction.status === 'pending'
                        ? 'warning'
                        : 'error'
                    }
                  >
                    {transaction.status}
                  </Badge>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Aucune facture récente trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
