"use client";

import React, { useEffect, useState } from "react";
import { CheckLineIcon } from "@/icons";
import { supabase } from "@/lib/supabaseClient";
import RefillModal from "./RefillModal";
import RefillAlert from "./RefillAlert";
import ChallengeModal from "./ChallengeModal";

export default function PriceTable() {
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [dollarBalance, setDollarBalance] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [refillResult, setRefillResult] = useState<{ success: string; error: string }>({ success: "", error: "" });
  const [challengeMsg, setChallengeMsg] = useState({ success: "", error: "" });
  const [showModal, setShowModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

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
            setResult={setRefillResult}
          />
        </div>

        {/* Achat de challenges */}
        <div className="w-full lg:w-1/2 rounded-2xl border-2 border-brand-500 bg-white p-6 dark:border-brand-500 dark:bg-white/[0.03]">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Challenge US 3k</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">3000 WT — Débloquez un nouveau challenge</p>

          <ul className="mb-6 space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
              <CheckLineIcon className="text-success-500" /> Challenge activé immédiatement
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
              <CheckLineIcon className="text-success-500" /> Achat multiple de challenges possible
            </li>
          </ul>

          <button
            onClick={() => setShowChallengeModal(true)}
            className="w-full rounded-lg bg-brand-500 hover:bg-brand-600 text-white py-2 text-sm"
          >
            Acheter un challenge
          </button>

          <ChallengeModal
            isOpen={showChallengeModal}
            onClose={() => setShowChallengeModal(false)}
            userId={userId}
            tokenBalance={tokenBalance ?? 0}
            dollarBalance={dollarBalance ?? 0}
          />


          <ChallengeModal
            isOpen={showChallengeModal}
            onClose={() => setShowChallengeModal(false)}
            userId={userId}
            tokenBalance={tokenBalance ?? 0}
            dollarBalance={dollarBalance ?? 0}
            onSuccess={(msg) => {
              setShowChallengeModal(false);
              setChallengeMsg({ success: msg, error: "" });
            }}
            onError={(msg) => {
              setShowChallengeModal(false);
              setChallengeMsg({ success: "", error: msg });
            }}
          />
        </div>
      </div>
    </div>
  );
}
