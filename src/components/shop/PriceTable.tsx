"use client";

import React, { useEffect, useState } from "react";
import { CheckLineIcon } from "@/icons";
import { supabase } from "@/lib/supabaseClient";
import RefillModal from "./RefillModal";
import RefillAlert from "./RefillAlert";

export default function PriceTable() {
  const [challengeQuantity, setChallengeQuantity] = useState(1);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [dollarBalance, setDollarBalance] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [refillResult, setRefillResult] = useState<{ success: string; error: string }>({ success: "", error: "" });
  const [showModal, setShowModal] = useState(false);
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
        .select("token_balance, dollar_balance")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setTokenBalance(data.token_balance);
        setDollarBalance(data.dollar_balance);
      }
    };

    fetchProfile();
  }, []);

  const handleBuyChallenge = async () => {
    setChallengeMsg({ success: "", error: "" });

    if (!userId) {
      setChallengeMsg({ success: "", error: "Utilisateur non connecté." });
      return;
    }

    if ((tokenBalance ?? 0) < 3000 * challengeQuantity) {
      setChallengeMsg({
        success: "",
        error: `Solde insuffisant pour acheter ${challengeQuantity} challenge(s).`,
      });
      return;
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, price")
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
      quantity: challengeQuantity,
      amount: product.price * challengeQuantity,
    });

    if (insertError) {
      setChallengeMsg({ success: "", error: "Erreur lors de l'achat du challenge : " + insertError.message });
    } else {
      setChallengeMsg({ success: "Challenge(s) acheté(s) avec succès !", error: "" });
    }
  };

  return (
    <div className="flex flex-col gap-5 xl:gap-6">
      {/* Zone Rechargement + Challenge */}
      <div className="flex flex-col lg:flex-row gap-5 xl:gap-6">
        {/* Rechargement dollar_balance via modal */}
        <div className="w-full lg:w-1/2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Rechargement du compte</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Token balance : {tokenBalance ?? "…"}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Dollar balance : {dollarBalance ?? "…"}</p>

          <ul className="mb-6 space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
              <CheckLineIcon className="text-success-500" /> Déblocage instantané
            </li>
          </ul>

          <button
            onClick={() => {
              setRefillResult({ success: "", error: "" });
              setShowModal(true);
            }}
            className="w-full rounded-lg bg-brand-500 hover:bg-brand-600 text-white py-2 text-sm"
          >
            Recharger mon compte
          </button>

          {/* Message après fermeture */}
          {(refillResult.success || refillResult.error) && (
            <div className="mt-4">
              <RefillAlert
                variant={refillResult.success ? "success" : "error"}
                title={refillResult.success ? "Succès" : "Erreur"}
                message={refillResult.success || refillResult.error}
              />
            </div>
          )}

          <RefillModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            userId={userId}
            setDollarBalance={setDollarBalance}
            setResult={setRefillResult}
          />
        </div>

        {/* Achat de challenges */}
        <div className="w-full lg:w-1/2 rounded-2xl border-2 border-brand-500 bg-white p-6 dark:border-brand-500 dark:bg-white/[0.03]">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Challenge US 3k</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">3000 WT — Débloquez un nouveau challenge</p>

          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Nombre de challenges :</label>
          <input
            type="number"
            min={1}
            step={1}
            value={challengeQuantity}
            onChange={(e) => {
              const val = Math.max(1, Math.floor(Number(e.target.value)));
              setChallengeQuantity(val);
            }}
            className="w-full p-2 mb-4 rounded border dark:bg-gray-900 dark:text-white"
          />

          <ul className="mb-6 space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
              <CheckLineIcon className="text-success-500" /> Challenge activé immédiatement
            </li>
          </ul>

          <button
            onClick={handleBuyChallenge}
            className="w-full rounded-lg bg-brand-500 hover:bg-brand-600 text-white py-2 text-sm"
          >
            Acheter {challengeQuantity} challenge{challengeQuantity > 1 ? "s" : ""}
          </button>

          {challengeMsg.success && <p className="text-green-600 mt-3 text-sm">{challengeMsg.success}</p>}
          {challengeMsg.error && <p className="text-red-600 mt-3 text-sm">{challengeMsg.error}</p>}
        </div>
      </div>
    </div>
  );
}
