'use client';

import ChurnRateChart from '@/components/dashboard/ChurnRate';
import ChurnRateChart2 from '@/components/dashboard/ChurnRate2';
import ChurnRateChart3 from '@/components/dashboard/ChurnRate3';
import ChurnRateChart4 from '@/components/dashboard/ChurnRate4';
import ProductPerformanceTab from '@/components/dashboard/ProductPerformanceTab';
import SaasInvoiceTable from '@/components/dashboard/SaasInvoiceTable';
import SaasMetrics from '@/components/dashboard/SaasMetrics';
import { useUserDashboard } from '@/hooks/useUserDashboard';

export default function UserDashboard() {
  const { metrics, transactions, loading } = useUserDashboard();

  if (loading) return <div className="text-center py-10">Chargement du tableau de bord...</div>;

  return (
    <div className="space-y-6">
      <SaasMetrics {...metrics} />

      <div className="flex w-full gap-4">
        <div className="flex-1"><ChurnRateChart /></div>
        <div className="flex-1"><ChurnRateChart2 /></div>
        <div className="flex-1"><ChurnRateChart3 /></div>
      </div>

      <div className="gap-6 space-y-5 sm:space-y-6 xl:grid xl:grid-cols-12 xl:space-y-0">
        <div className="xl:col-span-7 2xl:col-span-8">
          <div className="space-y-5 sm:space-y-6">
            <ChurnRateChart4 />
            <SaasInvoiceTable transactions={transactions} />
          </div>
        </div>
        <div className="space-y-5 sm:space-y-6 xl:col-span-5 2xl:col-span-4">
          <ProductPerformanceTab />
        </div>
      </div>
    </div>
  );
}
