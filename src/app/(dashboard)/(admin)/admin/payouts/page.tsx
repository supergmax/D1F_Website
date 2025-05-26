'use client';

// Removed useEffect, useState, supabase
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminPayoutsPage } from '@/hooks/useAdminPayoutsPage'; // Adjusted path
import { PayoutStatus } from '@/services/adminService'; // Adjusted path

// Removed local type definitions

export default function AdminPayoutsPage() {
  const { 
    payouts, 
    loading, 
    updatingId, 
    handleUpdatePayoutStatus, 
    error 
    // fetchData // Can be used for a manual refresh button if desired
  } = useAdminPayoutsPage();

  // Define the statuses available for actions, mapping to PayoutStatus type
  // The prompt specified 'pending', 'done', 'failed'.
  // PayoutStatus from service includes: 'requested' | 'pending' | 'processing' | 'done' | 'failed' | 'cancelled' | string;
  const actionStatuses: { label: string; value: PayoutStatus }[] = [
    { label: 'Pending', value: 'pending' }, 
    { label: 'Done', value: 'done' },
    { label: 'Failed', value: 'failed' },
    // Optional: Add more based on PayoutStatus if needed by admin, e.g., 'processing', 'cancelled'
    // { label: 'Processing', value: 'processing'},
    // { label: 'Cancelled', value: 'cancelled'},
  ];

  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8"> {/* Consider layout consistency */}
      <h1 className="text-xl font-semibold mb-6">Gestion des Retraits</h1>

      {loading && <p>Chargement des demandes de retrait...</p>}

      {error && !loading && (
        <div className="p-4 my-4 text-red-700 bg-red-100 border border-red-300 rounded">
          Erreur: {error}. Veuillez réessayer.
        </div>
      )}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>ID Retrait</TableCell>
              <TableCell isHeader>Utilisateur</TableCell>
              <TableCell isHeader>Montant</TableCell>
              <TableCell isHeader>Statut</TableCell>
              <TableCell isHeader>Date Création</TableCell>
              <TableCell isHeader>Date Traitement</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell className="text-sm text-gray-800 dark:text-white truncate max-w-xs">
                  {payout.id}
                </TableCell>

                <TableCell className="text-sm text-gray-800 dark:text-white">
                  <div className="font-semibold">
                    {payout.profile_last_name} {payout.profile_first_name}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{payout.profile_id}</div>
                </TableCell>

                <TableCell>
                  {/* Assuming payout.amount is in cents */}
                  {(payout.amount / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  {payout.amount_tokens && ` (${payout.amount_tokens} tokens)`}
                </TableCell>

                <TableCell className="capitalize">{payout.status.replace('_', ' ')}</TableCell>

                <TableCell>
                  {new Date(payout.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {payout.processed_at ? new Date(payout.processed_at).toLocaleDateString() : 'N/A'}
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {actionStatuses.map((action) => (
                      <button
                        key={action.value}
                        disabled={updatingId === payout.id || payout.status === action.value}
                        onClick={() => handleUpdatePayoutStatus(payout.id, action.value)}
                        className={`px-2 py-1 text-white text-xs rounded ${
                          updatingId === payout.id ? 'bg-gray-400' :
                          action.value === 'done' ? 'bg-green-600 hover:bg-green-700' :
                          action.value === 'failed' ? 'bg-red-600 hover:bg-red-700' :
                          action.value === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' :
                          // Add more colors for other statuses if included
                          // action.value === 'processing' ? 'bg-blue-500 hover:bg-blue-600' :
                          // action.value === 'cancelled' ? 'bg-gray-500 hover:bg-gray-600' :
                          'bg-sky-500 hover:bg-sky-600' // Default for other statuses like 'requested'
                        } ${payout.status === action.value ? 'opacity-50 cursor-not-allowed' : ''}`}
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
