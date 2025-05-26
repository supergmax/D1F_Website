'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  AdminPayout,
  AdminProfileLite,
  PayoutStatus,
  getAllPayouts,
  getAllProfilesLite,
  updatePayoutStatus as updatePayoutStatusService, // Renamed to avoid conflict
} from '../services/adminService'; // Adjusted path

// Define CombinedPayout type
export interface CombinedPayout extends AdminPayout {
  profile_first_name?: string | null;
  profile_last_name?: string | null;
}

export const useAdminPayoutsPage = () => {
  const [payouts, setPayouts] = useState<CombinedPayout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const payoutsResult = await getAllPayouts();
    const profilesResult = await getAllProfilesLite();

    if (payoutsResult.error || profilesResult.error) {
      console.error('Error fetching data for admin payouts page:', payoutsResult.error || profilesResult.error);
      setError(payoutsResult.error?.message || profilesResult.error?.message || 'Failed to fetch data');
      setLoading(false);
      return;
    }

    const profilesMap = new Map<string, AdminProfileLite>();
    if (profilesResult.data) {
      profilesResult.data.forEach(profile => profilesMap.set(profile.id, profile));
    }

    const combinedData: CombinedPayout[] = payoutsResult.data
      ? payoutsResult.data.map(payout => {
          const profile = profilesMap.get(payout.profile_id);
          return {
            ...payout,
            profile_first_name: profile?.first_name,
            profile_last_name: profile?.last_name,
          };
        })
      : [];

    setPayouts(combinedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdatePayoutStatus = async (payoutId: string, newStatus: PayoutStatus) => {
    setUpdatingId(payoutId);
    setError(null);

    const { error: updateError } = await updatePayoutStatusService(payoutId, newStatus);

    if (updateError) {
      console.error(`Error updating payout ${payoutId}:`, updateError);
      setError(updateError.message || `Failed to update status for payout ${payoutId}`);
    }
    
    // Refetch data regardless of update success/failure to ensure UI consistency
    await fetchData(); 
    setUpdatingId(null);
  };

  return { payouts, loading, updatingId, handleUpdatePayoutStatus, error, fetchData };
};
