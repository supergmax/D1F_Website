'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

import UserAddressCard from '@/components/profile/UserAddressCard';
import UserInfoCard from '@/components/profile/UserInfoCard';
import UserMetaCard from '@/components/profile/UserMetaCard';
import SaasMetrics from '@/components/profile/SaasMetrics';
import BrokerInfoCard from '@/components/profile/BrokerInfoCard';

interface UserProfile {
  role: string;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  facebook_url: string | null;
  x_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  
  address: string | null;
  created_at: string;
  token_balance: number;

  country: string | null;
  affiliate_id: string;
  godfather_id: string | null;
  broker_id: string;
  broker_pwd: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [activeChallenges, setActiveChallenges] = useState(0);
  const [averageProfit, setAverageProfit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: challengesData } = await supabase
        .from('challenges')
        .select('id, profit, status')
        .eq('profile_id', userId);

      if (profileData) {
        setProfile(profileData);
      }

      if (challengesData) {
        const total = challengesData.reduce((acc, c) => acc + (c.profit || 0), 0);
        const totalCount = challengesData.length;
        const activeCount = challengesData.filter(c => c.status === 'active').length;
        const avg = totalCount > 0 ? total / totalCount : 0;

        setTotalRevenue(total);
        setTotalChallenges(totalCount);
        setActiveChallenges(activeCount);
        setAverageProfit(avg);
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-300">
        Chargement du profil...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-red-600">
        Profil introuvable ou utilisateur non connecté.
      </div>
    );
  }

  return (
    <div>
      {/* SaasMetrics dynamique */}
      <div className="space-y-6">
        <SaasMetrics
          totalRevenue={totalRevenue}
          totalChallenges={totalChallenges}
          activeChallenges={activeChallenges}
          averageProfit={averageProfit}
          tokenBalance={profile.token_balance}
        />
      </div>

      {/* Section Profil complète */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mt-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profil
        </h3>
        <div className="space-y-6">
          <UserMetaCard
            role={profile.role}
            id={profile.id}
            first_name={profile.first_name}
            last_name={profile.last_name}
            bio={profile.bio ?? ''}
            facebook_url={profile.facebook_url ?? ''}
            x_url={profile.x_url ?? ''}
            linkedin_url={profile.linkedin_url ?? ''}
            instagram_url={profile.instagram_url ?? ''}
          />
          <BrokerInfoCard broker_id={profile.broker_id} broker_pwd={profile.broker_pwd} />
          <UserInfoCard
            id={profile.id}
            first_name={profile.first_name}
            last_name={profile.last_name}
            bio={profile.bio ?? ''}
          />
          <UserAddressCard id={profile.id} country={profile.country ?? ''} />
        </div>
      </div>
    </div>
  );
}
