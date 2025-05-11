'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ManualLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error) return setMsg('❌ Identifiants incorrects');
    setMsg(`✅ Bienvenue ${data.nom}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl mb-4">Connexion manuelle</h2>
      <input className="input input-bordered w-full mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="input input-bordered w-full mb-2" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary w-full" onClick={handleLogin}>Connexion</button>
      {msg && <p className="mt-2 text-sm text-center">{msg}</p>}
    </div>
  );
}
