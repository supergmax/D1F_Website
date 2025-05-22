'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MonthlySalesChart from "@/components/affiliation/MonthlySalesChart";
import StatisticsChart from "@/components/affiliation/StatisticsChart";
import { MetricCard } from "@/components/affiliation/MetricCard";
import { CopyCard } from "@/components/affiliation/CopyCard";
import { GroupIcon } from "@/icons";

export default function UserAffiliationPage() {
  const [lvl1, setLvl1] = useState(0);
  const [total, setTotal] = useState(0);
  const [monthlyCounts, setMonthlyCounts] = useState<number[]>(Array(12).fill(0));
  const [dailyData, setDailyData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    const fetchAffiliations = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData?.user?.id;
      if (!userId) return;

      // Récupère affiliate_id de l’utilisateur
      const { data: profile } = await supabase
        .from("profiles")
        .select("affiliate_id")
        .eq("id", userId)
        .single();

      if (!profile?.affiliate_id) return;
      const affId = profile.affiliate_id;

      // Récupère les affiliés directs (lvl 1)
      const { data: directAffiliates } = await supabase
        .from("affiliations")
        .select("created_at")
        .eq("affiliate_id", affId);

      const totalCount = directAffiliates?.length || 0;

      // Comptage mensuel
      const monthlyCountsArr = Array(12).fill(0);
      const grouped: { [key: string]: number } = {};

      directAffiliates?.forEach((row) => {
        const date = new Date(row.created_at);
        const month = date.getMonth();
        const isoDate = date.toISOString().split("T")[0];

        monthlyCountsArr[month]++;
        grouped[isoDate] = (grouped[isoDate] || 0) + 1;
      });

      const formatted = Object.entries(grouped).map(([date, count]) => ({ date, count }));

      setLvl1(totalCount); // niveau 1 uniquement
      setTotal(totalCount); // total identique ici (pas de niveau 2 calculé dans cette version)
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
            label="Affiliés directs"
            value={lvl1.toString()}
            trend="+1"
            trendType="up"
          />
        </div>
        <div className="w-1/3 px-2">
          <MetricCard
            icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
            label="Total Affiliés"
            value={total.toString()}
            trend="+2"
            trendType="up"
          />
        </div>
        <div className="w-1/3 px-2">
          <CopyCard
            icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
            label="Mon code affilié"
          />
        </div>
      </div>

      <div className="col-span-12">
        <div className="py-3">
          <MonthlySalesChart monthlyCounts={monthlyCounts} />
          
        </div>
        <div className="py-3">
          <MonthlySalesChart monthlyCounts={monthlyCounts} />
          {/* <StatisticsChart data={dailyData} /> */}
        </div>
      </div>
    </div>
  );
}
