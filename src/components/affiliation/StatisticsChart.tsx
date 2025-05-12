"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import { supabase } from "@/lib/supabaseClient";
import ChartTab from "../common/ChartTab";

// Chargement dynamique du graphique
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StatisticsChart() {
  const [series, setSeries] = useState([
    {
      name: "Affiliés",
      data: [],
    },
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchAffiliationsStats = async () => {
      const { data, error } = await supabase
        .from("affiliations")
        .select("created_at");

      if (error) {
        console.error("Erreur récupération affiliations :", error);
        return;
      }

      const countsByDay: Record<string, number> = {};

      data?.forEach((entry) => {
        const day = new Date(entry.created_at).toISOString().slice(0, 10); // format YYYY-MM-DD
        countsByDay[day] = (countsByDay[day] || 0) + 1;
      });

      const sortedDays = Object.keys(countsByDay).sort(); // tri chronologique
      const counts = sortedDays.map((day) => countsByDay[day]);

      setCategories(sortedDays);
      setSeries([{ name: "Affiliés / jour", data: counts }]);
    };

    fetchAffiliationsStats();
  }, []);

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: [2] },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { format: "yyyy-MM-dd" },
    },
    xaxis: {
      type: "category",
      categories,
      labels: {
        rotate: -45,
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Affiliés par jour
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Nombre d’affiliés créés chaque jour
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
