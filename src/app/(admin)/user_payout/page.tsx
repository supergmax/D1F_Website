import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics2";
import React from "react";
import SaasInvoiceTable2 from "@/components/saas/SaasInvoiceTable2";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="flex flex-col w-full min-h-screen px-4 py-6 space-y-6">
      <EcommerceMetrics />
      <SaasInvoiceTable2 />
    </div>
  );
}
