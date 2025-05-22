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

type ChallengeStatus = 'pending' | 'open' | 'active' | 'close' | 'issue';

type Challenge = {
  id: string;
  profile_id: string;
  challenge_num: number;
  status: ChallengeStatus;
  created_at: string;
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
};

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<(Challenge & Profile)[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name');

    if (challengeError || profileError) {
      console.error('Erreur lors du chargement des données.');
      setLoading(false);
      return;
    }

    const profileMap = new Map<string, Profile>();
    profileData?.forEach((p) => profileMap.set(p.id, p));

    const combined = challengeData?.map((c) => {
      const profile = profileMap.get(c.profile_id);
      return {
        ...c,
        first_name: profile?.first_name ?? '',
        last_name: profile?.last_name ?? '',
      };
    });

    setChallenges(combined || []);
    setLoading(false);
  };

  const updateStatus = async (
    challengeId: string,
    newStatus: ChallengeStatus
  ) => {
    setUpdatingId(challengeId);
    const { error } = await supabase
      .from('challenges')
      .update({ status: newStatus })
      .eq('id', challengeId);

    if (error) {
      console.error('Erreur lors de la mise à jour :', error.message);
    }

    await fetchData();
    setUpdatingId(null);
  };

  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8">
      <h1 className="text-xl font-semibold mb-6">Gestion des Challenges</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>ID Challenge</TableCell>
              <TableCell isHeader>Utilisateur</TableCell>
              <TableCell isHeader>Numéro</TableCell>
              <TableCell isHeader>Statut</TableCell>
              <TableCell isHeader>Date</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {challenges.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-sm text-gray-800 dark:text-white">
                  {c.id}
                </TableCell>

                <TableCell className="text-sm text-gray-800 dark:text-white">
                  <div className="font-semibold">
                    {c.last_name} {c.first_name}
                  </div>
                  <div className="text-xs text-gray-500">{c.profile_id}</div>
                </TableCell>

                <TableCell>#{c.challenge_num}</TableCell>

                <TableCell className="capitalize">{c.status}</TableCell>

                <TableCell>
                  {new Date(c.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    {(['pending', 'open', 'active', 'close', 'issue'] as const).map((status) => (
                      <button
                        key={status}
                        disabled={updatingId === c.id}
                        onClick={() => updateStatus(c.id, status)}
                        className={`px-2 py-1 text-white text-xs rounded ${
                          status === 'active'
                            ? 'bg-green-600'
                            : status === 'close'
                            ? 'bg-gray-600'
                            : status === 'issue'
                            ? 'bg-red-600'
                            : status === 'open'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
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
