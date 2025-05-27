"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface UserMetaCardProps {
  role: string;
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  facebook_url: string;
  x_url: string;
  linkedin_url: string;
  instagram_url: string;
}

export default function UserMetaCard({
  role,
  id,
  first_name,
  last_name,
}: UserMetaCardProps) {
  const [fields, setFields] = useState({
    role,
    first_name,
    last_name,
    country: "",
    deal_status: false,
    contrat_status: false,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("country, deal_status, contrat_status")
        .eq("id", id)
        .single();

      if (!error && data) {
        setFields((prev) => ({
          ...prev,
          country: data.country || "",
          deal_status: data.deal_status,
          contrat_status: data.contrat_status,
        }));
      }
    };

    fetchProfileData();
  }, [id]);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800">
      <div className="flex justify-between items-start flex-col xl:flex-row xl:items-center">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <Image
              width={80}
              height={80}
              src="/images/user/vert-gold.png"
              alt="user"
            />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {first_name} {last_name}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {fields.country || "Non renseigné"}
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${fields.deal_status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                {fields.deal_status ? "Active Deel" : "Inactive Deel"}
              </span>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${fields.contrat_status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                {fields.contrat_status ? "Contract signed" : "Contract not signed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
