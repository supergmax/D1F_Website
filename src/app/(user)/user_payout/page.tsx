//page payout
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { EcommerceMetrics } from '@/components/payout/EcommerceMetrics';
import SaasInvoiceTable from '@/components/payout/SaasInvoiceTable';
import PayoutModal from '@/components/payout/PayoutModal';

interface Payout {
  id: string;
  amount_tokens: number;
  status: 'pending' | 'accepted' | 'canceled' | 'accepted';
  created_at: string;
}

export default function UserPayout() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ id: string; dollar_balance: number } | null>(null);

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
      
          // Set the profile from session user (dollar_balance is set to 0 as a placeholder)
          setProfile({ id: session.user.id, dollar_balance: 0 });
      
          const { data, error } = await supabase
              .from('payouts')
              .select('id, amount_tokens, status, created_at')
              .eq('profile_id', session.user.id)
              .order('created_at', { ascending: false });
      
          if (!error && data) {
              setPayouts(data);
          }
      
          setLoading(false);
      }
      
      fetchPayouts();
  }, []);

  const totalaccepted = payouts
    .filter((p) => p.status === 'accepted')
    .reduce((acc, p) => acc + Number(p.amount_tokens || 0), 0);
    
      
  return (
    <div className="flex flex-col w-full min-h-screen px-4 py-6 space-y-6">
      <EcommerceMetrics totalaccepted={totalaccepted} payoutCount={payouts.length} />
      <PayoutModal profileId={profile ? profile.id : ''} dollarBalance={profile ? profile.dollar_balance : 0} onSuccess={() => window.location.reload()} />

      <SaasInvoiceTable data={payouts} loading={loading} />
    </div>
  );
}
