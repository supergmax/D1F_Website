"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CheckLineIcon, CloseLineIcon } from "@/icons";

const personalPack = [{ name: "Unlock instantly", included: true }];

export default function PriceTableTwo() {
  const [amount, setAmount] = useState<number>(50);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleBuyTokens = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;
    if (!user) {
      setErrorMsg("Utilisateur non connecté.");
      return;
    }

    const { error } = await supabase.from("invoices").insert({
      profile_id: user.id,
      status: "pending",
      amount,
    });

    if (error) {
      setErrorMsg("Erreur lors de l'achat : " + error.message);
    } else {
      setSuccessMsg("Achat enregistré ! Les tokens seront crédités prochainement.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Token Purchase Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] xl:p-8">
        <div className="flex items-start justify-between -mb-4">
          <span className="block font-semibold text-gray-800 text-xl dark:text-white/90">
            Acheter des tokens
          </span>
        </div>

        <div className="mt-6 mb-4">
          <label className="text-sm text-gray-500 dark:text-gray-400">Montant (en $)</label>
          <input
            type="number"
            min={50}
            className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white/90"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <p className="text-xs text-gray-500 mt-1">1$ = 1WT - minimum 50$</p>
        </div>

        <ul className="mb-4 space-y-2">
          {personalPack.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400"
            >
              <CheckLineIcon className="text-success-500" />
              {item.name}
            </li>
          ))}
        </ul>

        <button
          onClick={handleBuyTokens}
          className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow hover:bg-brand-600"
        >
          Acheter {amount} WT
        </button>

        {successMsg && (
          <p className="mt-3 text-sm text-green-600">{successMsg}</p>
        )}
        {errorMsg && (
          <p className="mt-3 text-sm text-red-600">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
