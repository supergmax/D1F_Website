// hooks/useAuthGuard.ts
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function useAuthGuard(redirectIfUnauthenticated = '/auth/signin') {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push(redirectIfUnauthenticated)
      }
    }
    checkAuth()
  }, [router, redirectIfUnauthenticated])
}
