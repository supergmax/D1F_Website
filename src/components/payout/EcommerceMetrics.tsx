"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

interface EcommerceMetricsProps {
  totalPaid: number;
  payoutCount: number;
  growthRate?: number; // optionnel : évolution en %
}

export const EcommerceMetrics = ({
  totalPaid,
  payoutCount,
  growthRate = 0,
}: EcommerceMetricsProps) => {
  const hasGrowth = typeof growthRate === "number";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Paiements totaux */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total payé</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalPaid.toLocaleString()} €
            </h4>
          </div>
          {hasGrowth && (
            <Badge color={growthRate >= 0 ? "success" : "error"}>
              {growthRate >= 0 ? (
                <ArrowUpIcon />
              ) : (
                <ArrowDownIcon className="text-error-500" />
              )}
              {Math.abs(growthRate)}%
            </Badge>
          )}
        </div>
      </div>

      {/* Nombre total de paiements */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Nombre de paiements</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {payoutCount}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
