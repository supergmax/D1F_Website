'use client';

import SaasInvoiceTable from '@/components/history/SaasInvoiceTable';
import SaasMetrics from '@/components/history/SaasMetrics';
import { useUserHistoryPage } from '../../../hooks/useUserHistoryPage';

export default function UserHistoryPage() {
  const { 
    // monthlySummaryData, // Not directly used by SaasInvoiceTable which now takes latestTransactionsData
    overallMetrics, 
    additionalMetrics, 
    latestTransactionsData, 
    loading, 
    error 
  } = useUserHistoryPage();

  // The main page loading state can be used if there's other content,
  // or removed if SaasInvoiceTable handles its own loading state adequately.
  // For this refactor, we'll let SaasInvoiceTable use the 'loading' prop.
  // A general error for the page can still be useful.

  return (
    <div className="space-y-6 w-full">
      {/* Display general error from the hook if not specifically handled by child components */}
      {error && !loading && ( // Only show general error if not loading and error exists
        <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded">
          Erreur de chargement de la page d'historique: {error}
        </div>
      )}

      <SaasMetrics 
        totalRevenue={overallMetrics.totalIn}
        totalChallenges={additionalMetrics.totalUserChallenges}
        totalTransactions={additionalMetrics.totalUserDoneTransactions}
      />

      <SaasInvoiceTable 
        transactions={latestTransactionsData}
        isLoading={loading}
        errorMessage={error} // Pass the general error; table will display it if relevant
      />
    </div>
  );
}
