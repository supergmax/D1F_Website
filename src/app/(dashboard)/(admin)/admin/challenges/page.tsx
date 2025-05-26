'use client';

// Removed useEffect, useState, supabase
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminChallengesPage } from '@/hooks/useAdminChallengesPage'; // Adjusted path
import { ChallengeStatus } from '@/services/adminService'; // Adjusted path

// Removed local type definitions for ChallengeStatus, Challenge, Profile

export default function AdminChallengesPage() {
  const { 
    challenges, 
    loading, 
    updatingId, 
    handleUpdateStatus, 
    error,
    // fetchData // if manual refresh is desired, can be used
  } = useAdminChallengesPage();

  // Define the statuses available for actions. This can be adjusted.
  const availableStatuses: ChallengeStatus[] = ['requested', 'pending_payment', 'active', 'passed', 'failed', 'expired', 'cancelled'];

  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8"> {/* Consider making layout consistent if these margins are common */}
      <h1 className="text-xl font-semibold mb-6">Gestion des Challenges</h1>

      {loading && <p>Chargement des challenges...</p>}
      
      {error && !loading && (
        <div className="p-4 my-4 text-red-700 bg-red-100 border border-red-300 rounded">
          Erreur: {error}. Veuillez réessayer. {/* Consider adding a retry button that calls fetchData */}
        </div>
      )}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>ID Challenge</TableCell>
              <TableCell isHeader>Utilisateur</TableCell>
              <TableCell isHeader>Numéro</TableCell>
              <TableCell isHeader>Type</TableCell>
              <TableCell isHeader>Statut</TableCell>
              <TableCell isHeader>Date Création</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {challenges.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-sm text-gray-800 dark:text-white truncate max-w-xs">
                  {c.id}
                </TableCell>

                <TableCell className="text-sm text-gray-800 dark:text-white">
                  <div className="font-semibold">
                    {c.profile_last_name} {c.profile_first_name}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{c.profile_id}</div>
                </TableCell>

                <TableCell>#{c.challenge_num}</TableCell>
                <TableCell>{c.type}</TableCell> {/* Added challenge type */}

                <TableCell className="capitalize">{c.status}</TableCell>

                <TableCell>
                  {new Date(c.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1"> {/* Use flex-wrap for smaller screens */}
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        disabled={updatingId === c.id || c.status === status} // Disable if already this status
                        onClick={() => handleUpdateStatus(c.id, status)}
                        className={`px-2 py-1 text-white text-xs rounded ${
                          updatingId === c.id ? 'bg-gray-400' : // Indicate loading for this specific row
                          status === 'active' ? 'bg-green-600 hover:bg-green-700' :
                          status === 'passed' ? 'bg-blue-600 hover:bg-blue-700' :
                          status === 'failed' ? 'bg-red-600 hover:bg-red-700' :
                          status === 'expired' ? 'bg-yellow-600 hover:bg-yellow-700' :
                          status === 'cancelled' ? 'bg-gray-500 hover:bg-gray-600' :
                          status === 'pending_payment' ? 'bg-purple-600 hover:bg-purple-700' :
                          'bg-sky-500 hover:bg-sky-600' // Default for 'requested' or other custom statuses
                        } ${c.status === status ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {status.replace('_', ' ')} {/* Nicer display for statuses with underscores */}
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
