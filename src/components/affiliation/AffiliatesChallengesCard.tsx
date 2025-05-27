'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MetricCard } from "./MetricCard";
import { GroupIcon } from "@/icons";

export const AffiliatesChallengesCard = () => {
  const [totalChallenges, setTotalChallenges] = useState(0);

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData?.user?.id;
      if (!userId) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("affiliate_id")
        .eq("id", userId)
        .single();

      if (!profile?.affiliate_id) return;

      const { data: affiliates } = await supabase
        .from("profiles")
        .select("id")
        .eq("godfather_id", profile.affiliate_id);

      const affiliateIds = affiliates?.map((a) => a.id) || [];

      if (affiliateIds.length === 0) {
        setTotalChallenges(0);
        return;
      }

      const { count } = await supabase
        .from("challenges")
        .select("*", { count: "exact", head: true })
        .in("profile_id", affiliateIds);

      setTotalChallenges(count || 0);
    };

    fetchChallenges();
  }, []);

  return (
    <MetricCard
      icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
      label="Challenges des affiliés"
      value={totalChallenges.toString()}
    />
  );
};
