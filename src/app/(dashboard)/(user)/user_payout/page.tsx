'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { EcommerceMetrics } from '@/components/payout/EcommerceMetrics';
import SaasInvoiceTable from '@/components/payout/SaasInvoiceTable';
import PayoutModal from '@/components/payout/PayoutModal';
import RefillAlert from '@/components/payout/RefillAlert';
import Button from '@/components/ui/button/Button';
import { CheckLineIcon } from '@/icons'; // ✅ à adapter selon ton chemin exact

interface Payout {
  id: string;
  amount_tokens: number;
  status: 'requested' | 'done' | 'failed';
  created_at: string;
}

export default function UserPayout() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [dollarBalance, setDollarBalance] = useState<number>(0);

  const [payoutResult, setPayoutResult] = useState({ success: "", error: "" });
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        setLoading(false);
        return;
      }

      const user = session.user;
      setUserId(user.id);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('token_balance, dollar_balance')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setTokenBalance(profileData.token_balance);
        setDollarBalance(profileData.dollar_balance);
      }

      const { data: payoutData, error: payoutError } = await supabase
        .from('payouts')
        .select('id, amount_tokens, status, created_at')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (!payoutError && payoutData) {
        setPayouts(payoutData);
      }

      setLoading(false);
  }

    fetchData();
  }, []);

  const totaldone = payouts
    .filter((p) => p.status === 'done')
    .reduce((acc, p) => acc + Number(p.amount_tokens || 0), 0);

  return (
    <div className="flex flex-col w-full min-h-screen px-4 py-6 space-y-6">
      <EcommerceMetrics totaldone={totaldone} payoutCount={payouts.length} />

      {/* Zone retrait de fonds */}
      <div className="w-full rounded-2xl border border-blue-300 bg-white p-6 dark:border-blue-800 dark:bg-white/[0.03]">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Demande de retrait</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Disponible : <strong>{dollarBalance ?? "…"}</strong> $
        </p>

        <ul className="mb-6 space-y-2">
          <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
            <CheckLineIcon className="text-success-500" /> Minimum 50$
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
            <CheckLineIcon className="text-success-500" /> Reversé sous 72h après validation (jours ouvré)
          </li>
        </ul>

        <button
          onClick={() => {
            setPayoutResult({ success: "", error: "" });
            setShowPayoutModal(true);
          }}
          className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white py-2 text-sm"
        >
          Retirer mes fonds
        </button>

        {(payoutResult.success || payoutResult.error) && (
          <div className="mt-4">
            <RefillAlert
              variant={payoutResult.success ? "success" : "error"}
              title={payoutResult.success ? "Succès" : "Erreur"}
              message={payoutResult.success || payoutResult.error}
            />
          </div>
        )}

        <PayoutModal
          ispending={showPayoutModal}
          onfailed={() => setShowPayoutModal(false)}
          userId={userId}
          dollarBalance={dollarBalance}
          setResult={setPayoutResult}
        />
      </div>

      <SaasInvoiceTable data={payouts} loading={loading} />
    </div>
  );
}
