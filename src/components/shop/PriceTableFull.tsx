"use client";

import React, { useEffect, useState } from "react";
import { CheckLineIcon, CloseLineIcon } from "@/icons";
import { supabase } from "@/lib/supabaseClient";

const personalPack = [{ name: "Unlock instantly", included: true }];
const professionalPack = [{ name: "Challenge active instantly", included: true }];
const enterprisePack = [{ name: "will be activate next month", included: true }];

export default function PriceTableWithBackend() {
  const [amount, setAmount] = useState(50);
  const [balance, setBalance] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [tokenMsg, setTokenMsg] = useState({ success: "", error: "" });
  const [challengeMsg, setChallengeMsg] = useState({ success: "", error: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("token_balance")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setBalance(data.token_balance);
      }
    };

    fetchProfile();
  }, []);

  const handleBuyTokens = async () => {
    setTokenMsg({ success: "", error: "" });

    if (!userId) {
      setTokenMsg({ success: "", error: "Utilisateur non connecté." });
      return;
    }

    const { error } = await supabase.from("invoices").insert({
      profile_id: userId,
      status: "pending",
      amount,
    });

    if (error) {
      setTokenMsg({ success: "", error: "Erreur lors de l'achat : " + error.message });
    } else {
      setTokenMsg({ success: "Achat enregistré ! Les tokens seront crédités prochainement.", error: "" });
    }
  };

  const handleBuyChallenge = async () => {
    setChallengeMsg({ success: "", error: "" });

    if (!userId) {
      setChallengeMsg({ success: "", error: "Utilisateur non connecté." });
      return;
    }

    if ((balance ?? 0) < 3000) {
      setChallengeMsg({ success: "", error: "Solde insuffisant pour acheter un challenge." });
      return;
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, price_in_tokens")
      .eq("name", "Challenge")
      .eq("available", true)
      .single();

    if (productError || !product) {
      setChallengeMsg({ success: "", error: "Produit 'Challenge' introuvable ou indisponible." });
      return;
    }

    const { error: insertError } = await supabase.from("purchases").insert({
      profile_id: userId,
      product_id: product.id,
      quantity: 1,
      total_tokens: product.price_in_tokens,
      label: "none",
    });

    if (insertError) {
      setChallengeMsg({ success: "", error: "Erreur lors de l'achat du challenge : " + insertError.message });
    } else {
      setChallengeMsg({ success: "Challenge acheté avec succès !", error: "" });
    }
  };

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {/* Token Purchase */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Buy WithUS Token</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          1$ = 1WT — Solde actuel : <strong>{balance ?? "..."}</strong> WT
        </p>
        <input
          type="number"
          min={50}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 mb-4 rounded border dark:bg-gray-900 dark:text-white"
        />
        <ul className="mb-6 space-y-2">
          {personalPack.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
              <CheckLineIcon className="text-success-500" /> {item.name}
            </li>
          ))}
        </ul>
        <button
          onClick={handleBuyTokens}
          className="w-full rounded-lg bg-brand-500 hover:bg-brand-600 text-white py-2 text-sm"
        >
          Acheter {amount} WT
        </button>
        {tokenMsg.success && <p className="text-green-600 mt-3 text-sm">{tokenMsg.success}</p>}
        {tokenMsg.error && <p className="text-red-600 mt-3 text-sm">{tokenMsg.error}</p>}
      </div>

      {/* Challenge Purchase */}
      <div className="rounded-2xl border-2 border-brand-500 bg-white p-6 dark:border-brand-500 dark:bg-white/[0.03]">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">With US 3k Challenge</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          3000 WT — Débloquez un nouveau challenge
        </p>
        <ul className="mb-6 space-y-2">
          {professionalPack.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
              <CheckLineIcon className="text-success-500" /> {item.name}
            </li>
          ))}
        </ul>
        <button
          onClick={handleBuyChallenge}
          className="w-full rounded-lg bg-brand-500 hover:bg-brand-600 text-white py-2 text-sm"
        >
          Acheter un challenge
        </button>
        {challengeMsg.success && <p className="text-green-600 mt-3 text-sm">{challengeMsg.success}</p>}
        {challengeMsg.error && <p className="text-red-600 mt-3 text-sm">{challengeMsg.error}</p>}
      </div>

      {/* Coming Soon Placeholder */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-md">
          <span className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
            🧊 Coming soon — stay tuned!
          </span>
        </div>
        <div className="pointer-events-none opacity-60">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Safety Mattress</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">2500 WT — Be safer in your challenge</p>
          <ul className="mb-6 space-y-2">
            {enterprisePack.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
                <CheckLineIcon className="text-success-500" /> {item.name}
              </li>
            ))}
          </ul>
          <button className="w-full bg-gray-800 dark:bg-white/10 text-white py-2 rounded text-sm">
            Mattress for your Challenge
          </button>
        </div>
      </div>
    </div>
  );
}
