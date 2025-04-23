'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:1337/api/auth/local/register', {
        username,
        email,
        password,
      })

      const { jwt, user } = res.data
      localStorage.setItem('token', jwt)
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/dashboard')
    } catch (err: any) {
      console.error(err)
      setError('Erreur lors de l’inscription. Veuillez vérifier vos informations.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleRegister} className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>

        <input
          type="text"
          placeholder="Nom d'utilisateur"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 w-full rounded transition-colors"
        >
          S’inscrire
        </button>
      </form>
    </div>
  )
}
