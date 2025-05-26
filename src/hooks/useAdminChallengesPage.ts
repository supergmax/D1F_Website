'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  AdminChallenge,
  AdminProfileLite,
  ChallengeStatus,
  getAllChallenges,
  getAllProfilesLite,
  updateChallengeStatus as updateChallengeStatusService, // Renamed to avoid conflict
} from '@/services/adminService'; // Adjusted path

// Define CombinedChallenge type
export interface CombinedChallenge extends AdminChallenge {
  profile_first_name?: string | null;
  profile_last_name?: string | null;
}

export const useAdminChallengesPage = () => {
  const [challenges, setChallenges] = useState<CombinedChallenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Added error state

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error on new fetch

    const challengesResult = await getAllChallenges();
    const profilesResult = await getAllProfilesLite();

    if (challengesResult.error || profilesResult.error) {
      console.error('Error fetching data:', challengesResult.error || profilesResult.error);
      setError(challengesResult.error?.message || profilesResult.error?.message || 'Failed to fetch data');
      setLoading(false);
      return;
    }

    const profilesMap = new Map<string, AdminProfileLite>();
    if (profilesResult.data) {
      profilesResult.data.forEach(profile => profilesMap.set(profile.id, profile));
    }

    const combinedData: CombinedChallenge[] = challengesResult.data
      ? challengesResult.data.map(challenge => {
          const profile = profilesMap.get(challenge.profile_id);
          return {
            ...challenge,
            profile_first_name: profile?.first_name,
            profile_last_name: profile?.last_name,
          };
        })
      : [];

    setChallenges(combinedData);
    setLoading(false);
  }, []); // useCallback to memoize fetchData

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData is now a dependency

  const handleUpdateStatus = async (challengeId: string, newStatus: ChallengeStatus) => {
    setUpdatingId(challengeId);
    setError(null); // Reset error before update

    const { error: updateError } = await updateChallengeStatusService(challengeId, newStatus);

    if (updateError) {
      console.error(`Error updating challenge ${challengeId}:`, updateError);
      setError(updateError.message || `Failed to update status for challenge ${challengeId}`);
      // Optionally, you might want to refetch data even if update fails to get latest state
      // or handle this more gracefully depending on requirements.
    }
    
    // Refetch data regardless of update success/failure to ensure UI consistency
    // If the backend automatically updates `updated_at` and sorts by it, this will reflect changes.
    await fetchData(); 
    setUpdatingId(null);
  };

  return { challenges, loading, updatingId, handleUpdateStatus, error, fetchData }; // Also return error and fetchData for potential manual refresh
};
