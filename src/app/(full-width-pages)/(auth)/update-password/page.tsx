'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Mot de passe mis à jour avec succès. Redirection en cours...')
      setTimeout(() => router.push('/auth/signin'), 2500)
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full max-w-md mx-auto py-10">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Réinitialiser votre mot de passe
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Entrez un nouveau mot de passe pour votre compte.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Mot de passe</Label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nouveau mot de passe"
          />
        </div>
        <div>
          <Label>Confirmation</Label>
          <Input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmez le mot de passe"
          />
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {success && <p className="text-sm text-green-600 text-center">{success}</p>}

        <button
          type="submit"
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-lg"
        >
          Mettre à jour le mot de passe
        </button>
      </form>
    </div>
  )
}
