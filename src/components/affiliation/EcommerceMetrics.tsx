"use client";

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, GroupIcon } from "@/icons";
import { supabase } from "@/lib/supabaseClient";

export default function EcommerceMetrics() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchLevel1Affiliations = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from("affiliations")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", user.id)
        .eq("level", 1);

      if (error) {
        console.error("Error fetching affiliations:", error.message);
        return;
      }

      setCount(data?.length ?? 0);
    };

    fetchLevel1Affiliations();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Affiliés niveau 1
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {count !== null ? count : "Chargement..."}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            +{count ?? 0}
          </Badge>
        </div>
      </div>
    </div>
  );
};
