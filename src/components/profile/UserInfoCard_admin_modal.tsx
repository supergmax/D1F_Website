'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

interface UserInfoCardProps {
  id: string;
}

export default function UserInfoCard({ id }: UserInfoCardProps) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return null;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
      <h4 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4 border-b pb-2 border-gray-100 dark:border-gray-700">
        {title}
      </h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </section>
  );

  const Info = ({ label, value }: { label: string; value: any }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white/90">{value ?? 'N/A'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <Section title="🧑 Identity">
        <Info label="First Name" value={profile.first_name} />
        <Info label="Last Name" value={profile.last_name} />
        <Info label="Email" value={profile.email} />
        <Info label="Phone" value={`${profile.id_phone} ${profile.phone}`} />
      </Section>

      <Section title="🌍 Location">
        <Info label="Country" value={profile.country} />
        <Info label="Address" value={profile.address} />
        <Info label="Billing Address" value={profile.billing_address} />
        <Info label="Language" value={profile.language} />
      </Section>

      <Section title="🏢 Activity">
        <Info label="Role" value={profile.role} />
        <Info label="Affiliate ID" value={profile.affiliate_id} />
        <Info label="Godfather ID" value={profile.godfather_id} />
      </Section>

      <Section title="💰 Balance">
        <Info label="Token Balance" value={profile.token_balance} />
        <Info label="Dollar Balance" value={profile.dollar_balance} />
      </Section>

      <Section title="📄 Status">
        <Info label="Deal Status" value={profile.deal_status ? 'Active' : 'Inactive'} />
        <Info label="Contract Status" value={profile.contrat_status ? 'Signed' : 'Not Signed'} />
        <Info label="Label" value={profile.label} />
      </Section>

      <Section title="🧠 Advanced Info">
        <Info label="Note" value={profile.note} />
        <Info label="Error Location" value={profile.error_location} />
        <Info label="Created At" value={new Date(profile.created_at).toLocaleString()} />
        <Info label="Updated At" value={new Date(profile.updated_at).toLocaleString()} />
      </Section>

      <Section title="🔐 Broker">
        <Info label="Broker ID" value={profile.broker_id} />
        <Info label="Broker Password" value="••••••••" />
      </Section>
    </div>
  );
}
