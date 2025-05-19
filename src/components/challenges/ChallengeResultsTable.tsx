interface ChallengeResultsTableProps {
  results: {
    id: string;
    challenge_id: string;
    date: string;
    daily_gain: number;
    daily_loss: number;
  }[];
}

export default function ChallengeResultsTable({ results }: ChallengeResultsTableProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90"> Listes des Challenges</h3>
      </div>
      <div className="custom-scrollbar overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Challenge</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Gain</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">DrawDown</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {results.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4">{r.challenge_id}</td>
                <td className="px-6 py-4">{new Date(r.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-6 py-4 text-green-600 font-medium">{r.daily_gain}</td>
                <td className="px-6 py-4 text-red-600 font-medium">{r.daily_loss}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
