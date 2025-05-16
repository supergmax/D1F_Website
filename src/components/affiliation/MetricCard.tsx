// components/affiliation/MetricCard.tsx
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";

export const MetricCard = ({
  icon,
  label,
  value,
  trend,
  trendType = "up", // "up" or "down"
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendType?: "up" | "down";
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value}
          </h4>
        </div>
        <Badge color={trendType === "up" ? "success" : "error"}>
          {trendType === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {trend}
        </Badge>
      </div>
    </div>
  );
};
