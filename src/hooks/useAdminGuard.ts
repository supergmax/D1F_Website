// hooks/useAdminGuard.ts
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function useAdminGuard() {
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/auth/signin')

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error || data?.role !== 'admin') {
        router.push('/')
      }
    }
    checkAdmin()
  }, [router])
}
