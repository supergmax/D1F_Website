//shop page
import type { Metadata } from "next";
import PriceTable from "@/components/shop/PriceTable";

import React from "react";


export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div >
      <PriceTable></PriceTable>
    </div>
  );
}
