"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EcommerceMetrics } from "@/components/payout/EcommerceMetrics";
//import { EcommerceMetrics2 } from "@/components/payout/EcommerceMetrics2";
import SaasInvoiceTable from "@/components/payout/SaasInvoiceTable";

interface Payout {
  id: string;
  amount_tokens: number;
  status: "Paid" | "Pending" | "Failed";
  created_at: string;
}

export default function UserPayout() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayouts() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("payouts")
        .select("id, amount_tokens, status, created_at")
        .eq("profile_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPayouts(data);
      }

      setLoading(false);
    }

    fetchPayouts();
  }, []);

  // 💡 Metrics à calculer et passer à EcommerceMetrics plus tard
  const totalPaid = payouts
    .filter((p) => p.status === "Paid")
    .reduce((acc, p) => acc + Number(p.amount_tokens || 0), 0);

  return (
    <div className="flex flex-col w-full min-h-screen px-4 py-6 space-y-6">
      <EcommerceMetrics totalPaid={totalPaid} payoutCount={payouts.length} />
      <SaasInvoiceTable data={payouts} loading={loading} />
    </div>
  );
}
