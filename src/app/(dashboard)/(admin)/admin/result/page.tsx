// app/(dashboard)/(admin)/admin/challenges-results/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  label: 'none' | 'low' | 'medium' | 'high';
  godfather_id: string | null;
  dollar_balance: number;
}

interface Challenge {
  id: string;
  profile_id: string;
  challenge_num: number;
  profit: number;
  initial_balance: number;
  status: string;
  created_at: string;
}

export default function AdminChallengeResultsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [search, setSearch] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [resultDate, setResultDate] = useState('');
  const [gain, setGain] = useState('');
  const [loss, setLoss] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: profilesData }, { data: challengesData }] = await Promise.all([
        supabase.from('profiles').select('id, first_name, last_name, label, godfather_id, dollar_balance'),
        supabase.from('challenges').select('*').eq('status', 'active'),
      ]);

      setProfiles(profilesData || []);
      setChallenges(challengesData || []);
    };

    fetchData();
  }, []);

  const filteredProfiles = profiles.filter((user) =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUserExpand = (userId: string) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  const toggleChallengeSelection = (challengeId: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(challengeId) ? prev.filter((id) => id !== challengeId) : [...prev, challengeId]
    );
  };

  const toggleSelectAll = (userId: string) => {
    const userChallengeIds = challenges.filter((c) => c.profile_id === userId).map((c) => c.id);
    const allSelected = userChallengeIds.every((id) => selectedChallenges.includes(id));
    setSelectedChallenges((prev) =>
      allSelected ? prev.filter((id) => !userChallengeIds.includes(id)) : [...prev, ...userChallengeIds.filter((id) => !prev.includes(id))]
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setResultDate('');
    setGain('');
    setLoss('');
  };

const handleApplyResults = async () => {
  const gainValue = Number(gain) || 0;
  const lossValue = Number(loss) || 0;
  const notifications: string[] = [];

  for (const challengeId of selectedChallenges) {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) continue;

    const profile = profiles.find((p) => p.id === challenge.profile_id);
    if (!profile) continue;

    const isOG = profile.label === 'high';

    // GAIN
    const maxToInitial = Math.max(0, 3000 - challenge.initial_balance);
    const toInitial = Math.min(gainValue, maxToInitial);
    const toProfit = gainValue - toInitial;

    // LOSS
    const afterGainInitial = challenge.initial_balance + toInitial;
    const effectiveLoss = Math.min(lossValue, afterGainInitial);
    const finalInitialBalance = afterGainInitial - effectiveLoss;

    const updatedProfit = challenge.profit + toProfit;

    // 1. Insert result
    const { error: insertResultError } = await supabase.from('challenge_results').insert({
      challenge_id: challenge.id,
      date: resultDate,
      daily_gain: gainValue,
      daily_loss: effectiveLoss,
      status: 'active'
    });
    if (insertResultError) {
      console.error('Erreur insert result:', insertResultError.message);
      continue;
    }

    // 2. Update challenge
    const { error: updateChallengeError } = await supabase.from('challenges').update({
      initial_balance: finalInitialBalance,
      profit: updatedProfit
    }).eq('id', challenge.id);
    if (updateChallengeError) {
      console.error('Erreur update challenge:', updateChallengeError.message);
      continue;
    }

    // 3. Gain distribution
    if (toProfit > 0) {
      if (isOG) {
        const { error } = await supabase.from('profiles').update({
          dollar_balance: profile.dollar_balance + toProfit
        }).eq('id', profile.id);
        if (error) console.error('Erreur crédit OG:', error.message);
      } else {
        const userPart = Math.floor(toProfit * 0.8);
        const godfatherPart = Math.floor(toProfit * 0.08);
        const adminPart = toProfit - userPart - godfatherPart;

        // Crédit utilisateur
        const { error: userError } = await supabase.from('profiles').update({
          dollar_balance: profile.dollar_balance + userPart
        }).eq('id', profile.id);
        if (userError) console.error('Erreur crédit utilisateur:', userError.message);

        // Crédit godfather (si existe)
        if (profile.godfather_id) {
          const { error: godfatherError } = await supabase.from('wallet_wut').insert({
            user_id: profile.godfather_id,
            amount: godfatherPart,
            reason: 'Parrainage gain challenge'
          });
          if (godfatherError) console.error('Erreur parrain:', godfatherError.message);
        }

        // Crédit admin
        const { data: adminData, error: adminQueryError } = await supabase
          .from('platform_balance')
          .select('dollar')
          .eq('id', 'admin')
          .single();

        if (!adminQueryError) {
          const currentAdmin = adminData?.dollar || 0;
          const { error: adminUpdateError } = await supabase.from('platform_balance').upsert({
            id: 'admin',
            dollar: currentAdmin + adminPart
          });
          if (adminUpdateError) console.error('Erreur update admin:', adminUpdateError.message);
        } else {
          console.error('Erreur lecture admin:', adminQueryError.message);
        }
      }
    }

    notifications.push(`Résultat appliqué au challenge #${challenge.challenge_num}`);
  }

  setMessage(
    notifications.length > 0
      ? notifications.join('\n')
      : 'Aucune mise à jour effectuée. Vérifiez les erreurs dans la console.'
  );
  closeModal();
};


  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8">
      <h1 className="text-xl font-semibold mb-6">Résultats Challenges</h1>

      {message && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded whitespace-pre-wrap">
          {message}
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
  <input
    type="text"
    placeholder="Rechercher un utilisateur..."
    className="border px-3 py-2 rounded w-full md:w-80"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
        <div className="flex items-center gap-2 ml-4">
            <label className="flex items-center gap-1 text-sm text-gray-700">
            <input
                type="checkbox"
                checked={
                selectedChallenges.length > 0 &&
                challenges.every((ch) => selectedChallenges.includes(ch.id))
                }
                onChange={() => {
                if (challenges.every((ch) => selectedChallenges.includes(ch.id))) {
                    setSelectedChallenges([]);
                } else {
                    setSelectedChallenges(challenges.map((ch) => ch.id));
                }
                }}
            />
            Tout sélectionner
            </label>
            <button
            onClick={() => setShowModal(true)}
            disabled={selectedChallenges.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
            Ajouter un résultat
            </button>
        </div>
        </div>


      <ul className="border rounded divide-y">
        {filteredProfiles.map((user) => {
          const userChallenges = challenges.filter((c) => c.profile_id === user.id);
          return (
            <li key={user.id}>
              <div
                className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100"
                onClick={() => toggleUserExpand(user.id)}
              >
                <span>
                  {user.first_name} {user.last_name} ({user.label})
                </span>
                <span className="text-sm text-gray-500">
                  {userChallenges.length} actif(s)
                </span>
              </div>
              {expandedUserId === user.id && (
                <div className="bg-gray-50 px-4 pb-4">
                  <label className="inline-flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={userChallenges.every((c) =>
                        selectedChallenges.includes(c.id)
                      )}
                      onChange={() => toggleSelectAll(user.id)}
                      className="mr-2"
                    />
                    Tout sélectionner
                  </label>
                  <ul className="divide-y">
                    {userChallenges.map((ch) => (
                      <li
                        key={ch.id}
                        className="py-2 flex justify-between items-center"
                      >
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedChallenges.includes(ch.id)}
                            onChange={() => toggleChallengeSelection(ch.id)}
                          />
                          <span>Challenge #{ch.challenge_num}</span>
                        </label>
                        <div className="text-xs text-right text-gray-500">
                          <div>Initial: {ch.initial_balance}</div>
                          <div>Profit: {ch.profit}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Ajouter un résultat</h2>
            <input
              type="date"
              value={resultDate}
              onChange={(e) => setResultDate(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="number"
              value={gain}
              onChange={(e) => setGain(e.target.value)}
              placeholder="Gain"
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="number"
              value={loss}
              onChange={(e) => setLoss(e.target.value)}
              placeholder="Perte"
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-200 text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyResults}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}