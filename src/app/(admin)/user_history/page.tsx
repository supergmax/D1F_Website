//import ActivitiesCard from "@/components/saas/ActivitiesCard";
//import ChurnRateChart from "@/components/saas/ChurnRate";
//import FunnelChart from "@/components/saas/FunnelChart";
//import GrowthChart from "@/components/saas/GrowthRate";
//import ProductPerformanceTab from "@/components/saas/ProductPerformanceTab";
import SaasInvoiceTable2 from "@/components/saas/SaasInvoiceTable2";
import SaasMetrics from "@/components/saas/SaasMetrics";
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
    <div className="space-y-6 w-full">
      <SaasMetrics />

      {/* Table en pleine largeur */}
      <div className="w-full">
        <SaasInvoiceTable2 />
      </div>
    </div>
  );
}
