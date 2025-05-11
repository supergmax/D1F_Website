'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignInTestPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setMessage('Connexion...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(`Erreur : ${error.message}`);
    } else {
      setMessage(`Succes!`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Connexion</h1>
      <input className="input input-bordered w-full mb-2" placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} />
      <input className="input input-bordered w-full mb-2" type="password" placeholder="Mot de passe"
        onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary w-full" onClick={handleLogin}>Se connecter</button>
      <p className="mt-2">{message}</p>
    </div>
  );
}
