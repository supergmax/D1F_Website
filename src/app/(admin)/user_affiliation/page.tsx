'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
//import EcommerceMetrics from "@/components/affiliation/EcommerceMetrics";
//import MonthlyTarget from "@/components/affiliation/MonthlyTarget";
import MonthlySalesChart from "@/components/affiliation/MonthlySalesChart";
import StatisticsChart from "@/components/affiliation/StatisticsChart";
import { MetricCard } from "@/components/affiliation/MetricCard";
import { CopyCard } from "@/components/affiliation/CopyCard";
import { GroupIcon, BoxIconLine } from "@/icons";

export default function Ecommerce() {
  const [lvl1, setLvl1] = useState(0);
  const [lvl2, setLvl2] = useState(0);
  const [total, setTotal] = useState(0);
  const [monthlyCounts, setMonthlyCounts] = useState<number[]>(Array(12).fill(0));
  const [dailyData, setDailyData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    const fetchAffiliations = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const profileId = userData?.user?.id;
      if (!profileId) return;

      // Level 1
      const { count: lvl1Count } = await supabase
        .from("affiliations")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", profileId)
        .eq("level", 1);

      // Level 2
      const { count: lvl2Count } = await supabase
        .from("affiliations")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", profileId)
        .eq("level", 2);

      // Total
      const { count: totalCount } = await supabase
        .from("affiliations")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", profileId);

      // Affiliés mensuels
      const currentYear = new Date().getFullYear();
      const { data: rawData } = await supabase
        .from("affiliations")
        .select("created_at")
        .eq("profile_id", profileId)
        .gte("created_at", `${currentYear}-01-01`)
        .lte("created_at", `${currentYear}-12-31`);

      const monthlyCountsArr = Array(12).fill(0);
      rawData?.forEach((row) => {
        const month = new Date(row.created_at).getMonth(); // 0 = Janvier
        monthlyCountsArr[month]++;
      });

      // Affiliés quotidiens
      const grouped: { [key: string]: number } = {};
      rawData?.forEach((row) => {
        const date = new Date(row.created_at).toISOString().split("T")[0];
        grouped[date] = (grouped[date] || 0) + 1;
      });

      const formatted = Object.entries(grouped).map(([date, count]) => ({ date, count }));

      // Set state
      setLvl1(lvl1Count || 0);
      setLvl2(lvl2Count || 0);
      setTotal(totalCount || 0);
      setMonthlyCounts(monthlyCountsArr);
      setDailyData(formatted);
    };

    fetchAffiliations();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 flex w-full">
  <div className="w-1/3 px-2">
        <MetricCard
          icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
          label="Affiliés niveau 1"
          value={lvl1.toString()}
          trend="+1"
          trendType="up"
        />
      </div>
      <div className="w-1/3 px-2">
        <MetricCard
          icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
          label="Affiliés niveau 2"
          value={lvl2.toString()}
          trend="+2"
          trendType="up"
        />
      </div>
      <div className="w-1/3 px-2">
        <CopyCard icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
          id="XB132347"
          label="ID Utilisateur"
        />
      </div>
    </div>

      <div className="col-span-12">
        <div className="py-3">
          <MonthlySalesChart monthlyCounts={monthlyCounts} />
        </div>
        <StatisticsChart data={dailyData} />
      </div>
    </div>
  );
}
