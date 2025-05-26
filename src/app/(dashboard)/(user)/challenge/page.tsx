'use client';

import SaasMetrics from '@/components/challenges/SaasMetrics';
import ChallengeDetailsTable from '@/components/challenges/ChallengeDetailsTable';
import ChallengeResultsTable from '@/components/challenges/ChallengeResultsTable';
import { useUserChallengesPage } from '@/hooks/useUserChallengesPage';

export default function UserChallenge() {
  const { metrics, challengeData, challengeResults, loading } = useUserChallengesPage();

  if (loading) return <p className="text-center py-10">Chargement des données...</p>;

  return (
    <div className="space-y-6 w-full">
      <SaasMetrics {...metrics} />
      <ChallengeDetailsTable challenges={challengeData} />
      <ChallengeResultsTable results={challengeResults} />
    </div>
  );
}
