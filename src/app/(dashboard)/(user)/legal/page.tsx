import type { Metadata } from "next";
import FaqsCGU from "@/components/faqs/FaqsCGU"
import React from "react";


export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div >
      <FaqsCGU></FaqsCGU>
    </div>
  );
}
