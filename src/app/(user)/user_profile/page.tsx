'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import UserAddressCard from "@/components/profile/UserAddressCard";
import UserInfoCard from "@/components/profile/UserInfoCard";
import UserMetaCard from "@/components/profile/UserMetaCard";
import SaasMetrics from "@/components/profile/SaasMetrics";

interface UserProfile {
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
  country: string | null;
  address: string | null;
  affiliate_id: string;
  godfather_id: string | null;
  created_at: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
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

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
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
      {/* SaasMetrics en haut de page */}
      <div className="space-y-6">
        <SaasMetrics profileId={profile.id} />
      </div>

      {/* Section Profil complète */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mt-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profil
        </h3>
        <div className="space-y-6">
          <UserMetaCard
            id={profile.id}
            first_name={profile.first_name}
            last_name={profile.last_name}
            bio={profile.bio ?? ""}
            facebook_url={profile.facebook_url ?? ""}
            x_url={profile.x_url ?? ""}
            linkedin_url={profile.linkedin_url ?? ""}
            instagram_url={profile.instagram_url ?? ""}
          />

          <UserInfoCard
            id={profile.id}
            first_name={profile.first_name}
            last_name={profile.last_name}
            bio={profile.bio ?? ""}
          />

          <UserAddressCard
            id={profile.id}
            country={profile.country ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
