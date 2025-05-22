"use client";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function EstimatedRevenue() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  // ApexCharts configuration
  const options: ApexOptions = {
  colors: ["#465FFF"],
  chart: {
    fontFamily: "Outfit, sans-serif",
    type: "radialBar",
    height: 360,
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -85,
      endAngle: 85,
      hollow: {
        size: "80%",
      },
      track: {
        background: "#FFFFFF", // Blanc ou identique au fond
        strokeWidth: "0%", // Pas de bord
        margin: 0,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          fontSize: "36px",
          fontWeight: "600",
          offsetY: -25,
          color: "#1D2939",
          formatter: function (val) {
            return "$" + val;
          },
        },
      },
    },
  },
  fill: {
    type: "solid",
    colors: ["#FFFFFF"], // Blanc ou identique au fond
    opacity: 0, // Rendre invisible l’arc
  },
  stroke: {
    lineCap: "round",
  },
  labels: ["Total This month"],
};
  const series = [39999];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Current Month Revenue
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            details of your profits
          </p>
        </div>
      </div>

      <div className="relative">
        <div id="chartDarkStyle">
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={360}
          />
        </div>
        <span className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-[60%] text-xs font-normal text-gray-500 dark:text-gray-400">
          Total This month
        </span>
      </div>

      <div className="pt-6 mt-6 space-y-5 border-t border-gary-200 dark:border-gray-800">
        <div>
          <p className="mb-2 text-gray-500 text-theme-sm dark:text-gray-400">
            From your Challenges
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-base font-semibold text-gray-800 dark:text-white/90">
                  $30,569.00
                </p>
              </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div className="absolute left-0 top-0 flex h-full w-[85%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
              </div>
              <p className="font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                85%
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-gray-500 text-theme-sm dark:text-gray-400">
           From Affiliation
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-base font-semibold text-gray-800 dark:text-white/90">
                  $9,430.00
                </p>
              </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div className="absolute left-0 top-0 flex h-full w-[15%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
              </div>
              <p className="font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                15%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
