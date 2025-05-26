'use client';

// Removed useEffect, useState, supabase
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminPurchasesPage } from '@/hooks/useAdminPurchasesPage'; // Adjusted path
import { PurchaseStatus } from '@/services/adminService'; // Adjusted path

// Removed local type definitions

export default function AdminPurchasesPage() {
  const { 
    purchases, 
    loading, 
    updatingId, 
    handleUpdatePurchaseStatus, 
    error 
    // fetchData // Can be used for a manual refresh button if desired
  } = useAdminPurchasesPage();

  // Define the statuses available for actions, mapping to PurchaseStatus type
  // Prompt specified 'pending', 'done', 'failed'.
  // PurchaseStatus includes: 'requested' | 'pending_payment' | 'payment_failed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded' | string;
  const actionStatuses: { label: string; value: PurchaseStatus }[] = [
    { label: 'Pending Payment', value: 'pending_payment' }, // 'pending' likely maps to 'pending_payment'
    { label: 'Completed', value: 'completed' },       // 'done' maps to 'completed'
    { label: 'Failed', value: 'failed' },             // 'failed' can map to 'failed' or 'payment_failed'
    // Optional: Add more based on PurchaseStatus if needed by admin
    // { label: 'Processing', value: 'processing'},
    // { label: 'Shipped', value: 'shipped' },
    // { label: 'Delivered', value: 'delivered' },
    // { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8"> {/* Consider layout consistency */}
      <h1 className="text-xl font-semibold mb-6">Gestion des Achats</h1> {/* Title updated */}

      {loading && <p>Chargement des achats...</p>}

      {error && !loading && (
        <div className="p-4 my-4 text-red-700 bg-red-100 border border-red-300 rounded">
          Erreur: {error}. Veuillez réessayer.
        </div>
      )}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>ID Achat</TableCell>
              <TableCell isHeader>Utilisateur</TableCell>
              <TableCell isHeader>Produit ID</TableCell>
              <TableCell isHeader>Quantité</TableCell>
              <TableCell isHeader>Montant</TableCell>
              <TableCell isHeader>Statut</TableCell>
              <TableCell isHeader>Date Création</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="text-sm text-gray-800 dark:text-white truncate max-w-[100px]">
                  {purchase.id}
                </TableCell>

                <TableCell className="text-sm text-gray-800 dark:text-white">
                  <div className="font-semibold">
                    {purchase.profile_last_name} {purchase.profile_first_name}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[100px]">{purchase.profile_id}</div>
                </TableCell>
                
                <TableCell className="truncate max-w-[100px]">{purchase.product_id}</TableCell>
                <TableCell>{purchase.quantity}</TableCell>
                <TableCell>{purchase.amount} tokens</TableCell> {/* Assuming amount is in tokens as per original JSX */}
                
                <TableCell className="capitalize">{purchase.status.replace('_', ' ')}</TableCell>
                <TableCell>{new Date(purchase.created_at).toLocaleDateString()}</TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {actionStatuses.map((action) => (
                      <button
                        key={action.value}
                        disabled={updatingId === purchase.id || purchase.status === action.value}
                        onClick={() => handleUpdatePurchaseStatus(purchase.id, action.value)}
                        className={`px-2 py-1 text-white text-xs rounded ${
                          updatingId === purchase.id ? 'bg-gray-400' :
                          action.value === 'completed' ? 'bg-green-600 hover:bg-green-700' :
                          action.value === 'failed' || action.value === 'payment_failed' ? 'bg-red-600 hover:bg-red-700' :
                          action.value === 'pending_payment' ? 'bg-yellow-500 hover:bg-yellow-600' :
                          // Add more colors for other statuses if included
                          // action.value === 'processing' ? 'bg-blue-500 hover:bg-blue-600' :
                          // action.value === 'shipped' ? 'bg-sky-500 hover:bg-sky-600' :
                          // action.value === 'delivered' ? 'bg-teal-500 hover:bg-teal-600' :
                          // action.value === 'cancelled' ? 'bg-gray-500 hover:bg-gray-600' :
                          'bg-indigo-500 hover:bg-indigo-600' // Default for other statuses
                        } ${purchase.status === action.value ? 'opacity-50 cursor-not-allowed' : ''}`}
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
