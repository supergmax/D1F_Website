'use client';

// Removed useEffect, useState, supabase
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminInvoicesPage } from '../../../../hooks/useAdminInvoicesPage'; // Adjusted path
import { InvoiceStatus } from '../../../../services/adminService'; // Adjusted path

// Removed local type definitions

export default function AdminInvoicesPage() {
  const { 
    invoices, 
    loading, 
    updatingId, 
    handleUpdateInvoiceStatus, 
    error 
    // fetchData // Can be used for a manual refresh button if desired
  } = useAdminInvoicesPage();

  // Define the statuses available for actions, mapping to InvoiceStatus type
  const actionStatuses: { label: string; value: InvoiceStatus }[] = [
    { label: 'Pending Payment', value: 'pending_payment' }, // Assuming 'pending' maps to 'pending_payment'
    { label: 'Done', value: 'done' },
    { label: 'Failed', value: 'failed' },
    { label: 'Cancelled', value: 'cancelled'},
    { label: 'Requested', value: 'requested'}
  ];

  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8"> {/* Consider layout consistency */}
      <h1 className="text-xl font-semibold mb-6">Gestion des Factures</h1>

      {loading && <p>Chargement des factures...</p>}

      {error && !loading && (
        <div className="p-4 my-4 text-red-700 bg-red-100 border border-red-300 rounded">
          Erreur: {error}. Veuillez réessayer.
        </div>
      )}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>ID Facture</TableCell>
              <TableCell isHeader>Utilisateur</TableCell>
              <TableCell isHeader>Montant</TableCell>
              <TableCell isHeader>Statut</TableCell>
              <TableCell isHeader>Date Création</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="text-sm text-gray-800 dark:text-white truncate max-w-xs">
                  {inv.id}
                </TableCell>

                <TableCell className="text-sm text-gray-800 dark:text-white">
                  <div className="font-semibold">
                    {inv.profile_last_name} {inv.profile_first_name}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{inv.profile_id}</div>
                </TableCell>

                <TableCell>
                  {/* Assuming inv.amount is in cents */}
                  {(inv.amount / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </TableCell>

                <TableCell className="capitalize">{inv.status.replace('_', ' ')}</TableCell>

                <TableCell>
                  {new Date(inv.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {actionStatuses.map((action) => (
                      <button
                        key={action.value}
                        disabled={updatingId === inv.id || inv.status === action.value}
                        onClick={() => handleUpdateInvoiceStatus(inv.id, action.value)}
                        className={`px-2 py-1 text-white text-xs rounded ${
                          updatingId === inv.id ? 'bg-gray-400' :
                          action.value === 'done' ? 'bg-green-600 hover:bg-green-700' :
                          action.value === 'failed' ? 'bg-red-600 hover:bg-red-700' :
                          action.value === 'cancelled' ? 'bg-orange-500 hover:bg-orange-600' :
                          action.value === 'pending_payment' ? 'bg-yellow-500 hover:bg-yellow-600' :
                          'bg-blue-500 hover:bg-blue-600' // Default for 'requested'
                        } ${inv.status === action.value ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {action.label}
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
