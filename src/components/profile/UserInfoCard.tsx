'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

interface UserInfoCardProps {
  id: string;
}

export default function UserInfoCard({ id }: UserInfoCardProps) {
  const [profile, setProfile] = useState<any>(null);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, id_phone, phone, country, address, billing_address, language, affiliate_id, godfather_id, deal_status, contrat_status')
        .eq('id', id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return null;

  const Info = ({ label, value, masked = false }: { label: string; value: any; masked?: boolean }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white/90">{masked && !reveal ? '***************' : value ?? 'N/A'}</span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-100 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          👤 Profile Information
        </h4>
        <button
          onClick={() => setReveal(!reveal)}
          className="text-xs px-3 py-1 border rounded-full text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-white/10"
        >
          {reveal ? 'Hide sensitive info' : 'Show sensitive info'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
        {/* Identity */}
        <Info label="First Name" value={profile.first_name} />
        <Info label="Last Name" value={profile.last_name} />
        <Info label="Email" value={profile.email} masked />
        <Info label="Phone" value={`${profile.id_phone} ${reveal ? profile.phone : '***************'}`} />

        {/* Location */}
        <Info label="Country" value={profile.country} />
        <Info label="Address" value={profile.address} masked />
        <Info label="Billing Address" value={profile.billing_address} masked />
        <Info label="Language" value={profile.language} />

        {/* Activity */}
        <Info label="Affiliate ID" value={profile.affiliate_id} />
        <Info label="Godfather ID" value={profile.godfather_id} masked />

        {/* Status */}
        <Info label="Deal Status" value={profile.deal_status ? 'Active' : 'Inactive'} />
        <Info label="Contract Status" value={profile.contrat_status ? 'Signed' : 'Not Signed'} />
      </div>
    </div>
  );
}