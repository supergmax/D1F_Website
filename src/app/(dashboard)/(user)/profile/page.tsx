'use client';

import UserAddressCard from '@/components/profile/UserAddressCard';
import UserInfoCard from '@/components/profile/UserInfoCard';
import UserMetaCard from '@/components/profile/UserMetaCard';
import SaasMetrics from '@/components/profile/SaasMetrics';
import BrokerInfoCard from '@/components/profile/BrokerInfoCard';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal';
import Button from '@/components/ui/button/Button';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function Profile() {
  const { profile, metrics, loading, isPasswordModalRequested, togglePasswordModal } = useUserProfile();

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
          totalRevenue={metrics.totalRevenue}
          totalChallenges={metrics.totalChallenges}
          activeChallenges={metrics.activeChallenges}
          averageProfit={metrics.averageProfit}
          tokenBalance={profile.token_balance ?? 0} 
        />
      </div>

      {/* Section Profil complète */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mt-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profil
        </h3>
        <div className="space-y-6">
          <UserMetaCard
            role={profile.role ?? ''}
            id={profile.id}
            first_name={profile.first_name ?? ''}
            last_name={profile.last_name ?? ''}
            bio={profile.bio ?? ''}
            avatar_url={profile.avatar_url ?? ''}
            facebook_url={profile.facebook_url ?? ''}
            x_url={profile.x_url ?? ''}
            linkedin_url={profile.linkedin_url ?? ''}
            instagram_url={profile.instagram_url ?? ''}
          />
          <BrokerInfoCard broker_id={profile.broker_id ?? ''} broker_pwd={profile.broker_pwd ?? ''} />
          <UserInfoCard
            id={profile.id}
            first_name={profile.first_name ?? ''}
            last_name={profile.last_name ?? ''}
            email={profile.email ?? ''} // Assuming email is part of FullUserProfile
            bio={profile.bio ?? ''}
          />
          <UserAddressCard 
            id={profile.id} 
            country={profile.country ?? ''} 
            address={profile.address ?? ''} // Assuming address is part of FullUserProfile
          />
        </div>
        <Button
          onClick={togglePasswordModal}
          className="mt-6 rounded-full bg-blue-600 text-white px-5 py-2 shadow hover:bg-blue-700"
        >
          🔐 Change Password
        </Button>
        <ChangePasswordModal isRequested={isPasswordModalRequested} onClose={togglePasswordModal} />
      </div>
    </div>
  );
}
