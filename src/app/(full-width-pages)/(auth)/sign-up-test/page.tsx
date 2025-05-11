'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    address: '',
    billing_address: '',
    country: '',
  })

  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Génère un affiliate_id aléatoire
    const affiliate_id = Array(6)
      .fill(null)
      .map(() => Math.random().toString(36)[2].toUpperCase())
      .join('')

    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          address: form.address,
          billing_address: form.billing_address,
          country: form.country,
          affiliate_id, // Injecté dans raw_user_meta_data
        },
      },
    })

    if (signupError) {
      setError(signupError.message)
    } else {
      router.push('/succes/user')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">Inscription</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="first_name" placeholder="Prénom" onChange={handleChange} className="input input-bordered w-full" required />
        <input name="last_name" placeholder="Nom" onChange={handleChange} className="input input-bordered w-full" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input input-bordered w-full" required />
        <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} className="input input-bordered w-full" required />
        <input name="address" placeholder="Adresse" onChange={handleChange} className="input input-bordered w-full" />
        <input name="billing_address" placeholder="Adresse de facturation" onChange={handleChange} className="input input-bordered w-full" />
        <input name="country" placeholder="Pays" onChange={handleChange} className="input input-bordered w-full" />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="btn btn-primary w-full">S’inscrire</button>
      </form>
    </div>
  )
}
