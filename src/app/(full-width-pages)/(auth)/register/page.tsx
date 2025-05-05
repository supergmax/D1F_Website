'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  invite_token: z.string().min(6),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          godfather_id: data.invite_token,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setError('');
      // Redirection ou confirmation
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">Inscription</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Prénom</label>
          <input type="text" {...register('first_name')} className="input input-bordered w-full" />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
        </div>
        <div>
          <label>Nom</label>
          <input type="text" {...register('last_name')} className="input input-bordered w-full" />
          {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
        </div>
        <div>
          <label>Email</label>
          <input type="email" {...register('email')} className="input input-bordered w-full" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" {...register('password')} className="input input-bordered w-full" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <label>Token d'invitation</label>
          <input type="text" {...register('invite_token')} className="input input-bordered w-full" />
          {errors.invite_token && <p className="text-red-500 text-sm">{errors.invite_token.message}</p>}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="btn btn-primary w-full" disabled={isSubmitting}>Créer un compte</button>
      </form>
    </div>
  );
}
