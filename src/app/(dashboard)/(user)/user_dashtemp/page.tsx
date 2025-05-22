import ActivitiesCard from "@/components/saas/ActivitiesCard";
import ChurnRateChart from "@/components/saas/ChurnRate";
import FunnelChart from "@/components/saas/FunnelChart";
import GrowthChart from "@/components/saas/GrowthRate";
import ProductPerformanceTab from "@/components/saas/ProductPerformanceTab";
import SaasInvoiceTable from "@/components/saas/SaasInvoiceTable";
import SaasMetrics from "@/components/saas/SaasMetrics";
import AnalyticsBarChart from "@/components/dashtemp/AnalyticsBarChart";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Next.js SaaS Dashboard | TailAdmin - Next.js Admin Dashboard Template",
  description:
    "This is Next.js SaaS Dashboard page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function SaaS() {
  return (
    <div className="space-y-6">
      <SaasMetrics />
      
      <div className="col-span-12">
        <AnalyticsBarChart />
      </div>
      <div className="py-3">
        {/* Table */}
        <SaasInvoiceTable />
      </div>
       
      </div>
  );
}
