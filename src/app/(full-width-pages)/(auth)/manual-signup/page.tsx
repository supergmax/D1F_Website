'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ManualSignup() {
  const [form, setForm] = useState({ email: '', password: '', nom: '', prenom: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { data, error } = await supabase.from('users').insert([form]);
    if (error) return setMsg(error.message);
    setMsg('✅ Utilisateur créé avec succès');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl mb-4">Inscription manuelle</h2>
      <input className="input input-bordered w-full mb-2" name="email" placeholder="Email" onChange={handleChange} />
      <input className="input input-bordered w-full mb-2" name="password" placeholder="Mot de passe" onChange={handleChange} />
      <input className="input input-bordered w-full mb-2" name="nom" placeholder="Nom" onChange={handleChange} />
      <input className="input input-bordered w-full mb-2" name="prenom" placeholder="Prénom" onChange={handleChange} />
      <button className="btn btn-primary w-full" onClick={handleSubmit}>Créer</button>
      {msg && <p className="mt-2 text-sm text-center">{msg}</p>}
    </div>
  );
}
