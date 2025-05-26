'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  getFullUserProfile,
  getUserChallenges,
  UserChallenge,
  FullUserProfile as UserServiceUserProfile, // Renaming to avoid conflict if a local UserProfile is defined
} from '../services/userService';

// Define UserProfile based on expected structure for the profile page
// This might be similar to what's in profile/page.tsx or a shared types file
export interface UserProfile extends UserServiceUserProfile {
  // Add any additional fields specific to the profile page view if necessary
  // For now, it will inherit all fields from FullUserProfile
}

export interface Metrics {
  totalRevenue: number;
  totalChallenges: number;
  activeChallenges: number;
  averageProfit: number;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    averageProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isPasswordModalRequested, setIsPasswordModalRequested] = useState(false);

  const togglePasswordModal = () => {
    setIsPasswordModalRequested(prev => !prev);
  };

  useEffect(() => {
    const fetchUserProfileData = async () => {
      setLoading(true);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.error('Session error or no session:', sessionError);
        setLoading(false);
        return;
      }

      const user = sessionData.session.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const userId = user.id;

      const userProfileData = await getFullUserProfile(userId);
      if (userProfileData) {
        setProfile(userProfileData);
      }

      const userChallengesData = await getUserChallenges(userId);

      const totalRevenue = userChallengesData.reduce((acc, c) => acc + (c.profit || 0), 0);
      const totalChallenges = userChallengesData.length;
      const activeChallenges = userChallengesData.filter(c => c.status === 'active').length;
      const averageProfit = totalChallenges > 0 ? totalRevenue / totalChallenges : 0;

      setMetrics({
        totalRevenue,
        totalChallenges,
        activeChallenges,
        averageProfit,
      });

      setLoading(false);
    };

    fetchUserProfileData();
  }, []);

  return { profile, metrics, loading, isPasswordModalRequested, togglePasswordModal };
};
