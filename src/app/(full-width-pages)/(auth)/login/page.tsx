'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (loginError) {
      setError('Identifiants incorrects');
    } else {
      setError('');
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">Connexion</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="email" {...register('email')} placeholder="Email" className="input input-bordered w-full" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input type="password" {...register('password')} placeholder="Mot de passe" className="input input-bordered w-full" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        {error && <p className="text-red-500">{error}</p>}

        <button className="btn btn-primary w-full">Se connecter</button>
      </form>
    </div>
  );
}
