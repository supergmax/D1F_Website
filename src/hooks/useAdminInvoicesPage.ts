'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  AdminInvoice,
  AdminProfileLite,
  InvoiceStatus,
  getAllInvoices,
  getAllProfilesLite,
  updateInvoiceStatus as updateInvoiceStatusService, // Renamed to avoid conflict
} from '@/services/adminService'; // Adjusted path

// Define CombinedInvoice type
export interface CombinedInvoice extends AdminInvoice {
  profile_first_name?: string | null;
  profile_last_name?: string | null;
}

export const useAdminInvoicesPage = () => {
  const [invoices, setInvoices] = useState<CombinedInvoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const invoicesResult = await getAllInvoices();
    const profilesResult = await getAllProfilesLite();

    if (invoicesResult.error || profilesResult.error) {
      console.error('Error fetching data for admin invoices page:', invoicesResult.error || profilesResult.error);
      setError(invoicesResult.error?.message || profilesResult.error?.message || 'Failed to fetch data');
      setLoading(false);
      return;
    }

    const profilesMap = new Map<string, AdminProfileLite>();
    if (profilesResult.data) {
      profilesResult.data.forEach(profile => profilesMap.set(profile.id, profile));
    }

    const combinedData: CombinedInvoice[] = invoicesResult.data
      ? invoicesResult.data.map(invoice => {
          const profile = profilesMap.get(invoice.profile_id);
          return {
            ...invoice,
            profile_first_name: profile?.first_name,
            profile_last_name: profile?.last_name,
          };
        })
      : [];

    setInvoices(combinedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateInvoiceStatus = async (invoiceId: string, newStatus: InvoiceStatus) => {
    setUpdatingId(invoiceId);
    setError(null);

    const { error: updateError } = await updateInvoiceStatusService(invoiceId, newStatus);

    if (updateError) {
      console.error(`Error updating invoice ${invoiceId}:`, updateError);
      setError(updateError.message || `Failed to update status for invoice ${invoiceId}`);
    }
    
    // Refetch data regardless of update success/failure to ensure UI consistency
    await fetchData(); 
    setUpdatingId(null);
  };

  return { invoices, loading, updatingId, handleUpdateInvoiceStatus, error, fetchData };
};
