'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MetricCard } from "@/components/affiliation/MetricCard";
import { CopyCard } from "@/components/affiliation/CopyCard";
import AffiliationLineChart from "@/components/affiliation/AffiliationLineChart";
import { GroupIcon } from "@/icons";

export default function UserAffiliationPage() {
  const [affiliateCount, setAffiliateCount] = useState(0);
  const [challengesCount, setChallengesCount] = useState(0);
  const [dailyChartData, setDailyChartData] = useState<
    { date: string; affiliateCount: number; challengeCount: number }[]
  >([]);

  useEffect(() => {
    const fetchAffiliationsData = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData?.user?.id;
      if (!userId) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("affiliate_id")
        .eq("id", userId)
        .single();

      if (!profile?.affiliate_id) return;
      const affId = profile.affiliate_id;

      const { data: affiliates } = await supabase
        .from("profiles")
        .select("id, created_at")
        .eq("godfather_id", affId);

      const affiliateIds = affiliates?.map((a) => a.id) || [];

      const affiliateMap: { [date: string]: number } = {};
      affiliates?.forEach((a) => {
        const date = a.created_at.split("T")[0];
        affiliateMap[date] = (affiliateMap[date] || 0) + 1;
      });

      const { data: challenges } = await supabase
        .from("challenges")
        .select("created_at, profile_id")
        .in("profile_id", affiliateIds);

      const challengeMap: { [date: string]: number } = {};
      challenges?.forEach((c) => {
        const date = c.created_at.split("T")[0];
        challengeMap[date] = (challengeMap[date] || 0) + 1;
      });

      const allDates = Array.from(new Set([...Object.keys(affiliateMap), ...Object.keys(challengeMap)])).sort();

      const final = allDates.map((date) => ({
        date,
        affiliateCount: affiliateMap[date] || 0,
        challengeCount: challengeMap[date] || 0,
      }));

      setAffiliateCount(affiliateIds.length);
      setChallengesCount(challenges?.length || 0);
      setDailyChartData(final);
    };

    fetchAffiliationsData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
          label="Total Affiliés"
          value={affiliateCount.toString()}
        />
        <MetricCard
          icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
          label="Challenges des affiliés"
          value={challengesCount.toString()}
        />
        <CopyCard
          icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
          label="Mon code affilié"
        />
      </div>

      <div className="col-span-12">
        <AffiliationLineChart data={dailyChartData} />
      </div>
    </div>
  );
}
