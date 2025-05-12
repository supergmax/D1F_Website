'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import EcommerceMetrics from "@/components/affiliation/EcommerceMetrics";
import MonthlyTarget from "@/components/affiliation/MonthlyTarget";
import MonthlySalesChart from "@/components/affiliation/MonthlySalesChart";
import StatisticsChart from "@/components/affiliation/StatisticsChart";

export default function Ecommerce() {
  const [lvl1, setLvl1] = useState(0);
  const [lvl2, setLvl2] = useState(0);
  const [total, setTotal] = useState(0);
  const [dailyData, setDailyData] = useState<{ date: string, count: number }[]>([]);

  useEffect(() => {
    const fetchAffiliations = async () => {
      const user = await supabase.auth.getUser();
      const profileId = user.data.user?.id;
      if (!profileId) return;

      // Level 1
      const { count: lvl1Count } = await supabase
        .from('affiliations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .eq('level', 1);

      // Level 2
      const { count: lvl2Count } = await supabase
        .from('affiliations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .eq('level', 2);

      // Total
      const { count: totalCount } = await supabase
        .from('affiliations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId);

      // Affiliés par jour
      const { data: rawData, error } = await supabase
        .from('affiliations')
        .select('created_at')
        .eq('profile_id', profileId);

      const grouped: { [key: string]: number } = {};
      rawData?.forEach((row) => {
        const date = new Date(row.created_at).toISOString().split('T')[0];
        grouped[date] = (grouped[date] || 0) + 1;
      });

      const formatted = Object.entries(grouped).map(([date, count]) => ({ date, count }));

      setLvl1(lvl1Count || 0);
      setLvl2(lvl2Count || 0);
      setTotal(totalCount || 0);
      setDailyData(formatted);
    };

    fetchAffiliations();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics count={lvl1} />
        <MonthlySalesChart total={total} />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget count={lvl2} />
      </div>

      <div className="col-span-12">
        <StatisticsChart data={dailyData} />
      </div>
    </div>
  );
}
