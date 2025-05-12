'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TestSupabasePage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const {
        data: challenges,
        error,
      } = await supabase
        .from('challenges')
        .select('id, name, challenge_num, profit, status, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        setError(error.message)
        setLoading(false)
        return
      }

      setData(challenges)
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Challenges</h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">Erreur : {error}</p>}

      {!loading && !error && (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left border">Nom</th>
              <th className="p-2 text-left border">N°</th>
              <th className="p-2 text-left border">Profit</th>
              <th className="p-2 text-left border">Statut</th>
              <th className="p-2 text-left border">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.challenge_num}</td>
                <td className="p-2 border">{item.profit}</td>
                <td className="p-2 border">{item.status}</td>
                <td className="p-2 border">{new Date(item.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
