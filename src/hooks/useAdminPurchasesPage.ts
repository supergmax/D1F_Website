'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  AdminPurchase,
  AdminProfileLite,
  PurchaseStatus,
  getAllPurchases,
  getAllProfilesLite,
  updatePurchaseStatus as updatePurchaseStatusService, // Renamed to avoid conflict
} from '@/services/adminService'; // Adjusted path

// Define CombinedPurchase type
export interface CombinedPurchase extends AdminPurchase {
  profile_first_name?: string | null;
  profile_last_name?: string | null;
}

export const useAdminPurchasesPage = () => {
  const [purchases, setPurchases] = useState<CombinedPurchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const purchasesResult = await getAllPurchases();
    const profilesResult = await getAllProfilesLite();

    if (purchasesResult.error || profilesResult.error) {
      console.error('Error fetching data for admin purchases page:', purchasesResult.error || profilesResult.error);
      setError(purchasesResult.error?.message || profilesResult.error?.message || 'Failed to fetch data');
      setLoading(false);
      return;
    }

    const profilesMap = new Map<string, AdminProfileLite>();
    if (profilesResult.data) {
      profilesResult.data.forEach(profile => profilesMap.set(profile.id, profile));
    }

    const combinedData: CombinedPurchase[] = purchasesResult.data
      ? purchasesResult.data.map(purchase => {
          const profile = profilesMap.get(purchase.profile_id);
          return {
            ...purchase,
            profile_first_name: profile?.first_name,
            profile_last_name: profile?.last_name,
          };
        })
      : [];

    setPurchases(combinedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdatePurchaseStatus = async (purchaseId: string, newStatus: PurchaseStatus) => {
    setUpdatingId(purchaseId);
    setError(null);

    const { error: updateError } = await updatePurchaseStatusService(purchaseId, newStatus);

    if (updateError) {
      console.error(`Error updating purchase ${purchaseId}:`, updateError);
      setError(updateError.message || `Failed to update status for purchase ${purchaseId}`);
    }
    
    // Refetch data regardless of update success/failure to ensure UI consistency
    await fetchData(); 
    setUpdatingId(null);
  };

  return { purchases, loading, updatingId, handleUpdatePurchaseStatus, error, fetchData };
};
