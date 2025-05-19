// components/affiliation/CopyCard.tsx
'use client';

import React, { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export function CopyCard({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  const [affiliateId, setAffiliateId] = useState<string>("—");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(affiliateId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie dans le presse-papiers", err);
    }
  };

  useEffect(() => {
    const fetchAffiliateId = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("affiliate_id")
        .eq("id", user.id)
        .single();

      if (!error && data?.affiliate_id) {
        setAffiliateId(data.affiliate_id);
      }
    };

    fetchAffiliateId();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {icon}
        </div>

        <button
          onClick={handleCopy}
          type="button"
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1" />
              Copié !
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4 mr-1" />
              Copier
            </>
          )}
        </button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</div>

      <div
        className="text-lg font-bold text-gray-800 dark:text-white truncate max-w-full"
        title={affiliateId}
      >
        {affiliateId}
      </div>
    </div>
  );
}
