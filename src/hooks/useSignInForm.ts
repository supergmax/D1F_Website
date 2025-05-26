'use client'; // Required for Next.js App Router hooks

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '../services/authService'; // Adjusted path

export const useSignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Connexion...');

    if (!email || !password) {
      setMessage('Veuillez entrer votre email et votre mot de passe.');
      setIsLoading(false);
      return;
    }

    const { user, profile, error } = await signInWithEmail(email, password);

    if (error || !user || !profile) {
      let errorMessage = 'Erreur de connexion. Veuillez vérifier vos identifiants.';
      if (error) {
        // More specific error messages from Supabase can be helpful
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter.';
        } else {
          errorMessage = `Erreur: ${error.message}`;
        }
      } else if (!user) {
        errorMessage = 'Utilisateur non trouvé après la connexion.';
      } else if (!profile) {
        errorMessage = 'Profil utilisateur non trouvé.';
      }
      setMessage(errorMessage);
      setIsLoading(false);
      return;
    }

    // Successful login
    setMessage('Connexion réussie!');
    
    // Redirect based on profile role
    // Assuming 'profile' object has a 'role' property
    if (profile.role === 'admin') {
      router.push('/admin'); // Default admin dashboard path
    } else {
      router.push('/profile'); // Default user profile path
    }
    
    // No need to set isLoading to false here if redirecting,
    // as the component will unmount or re-render.
    // However, if there were further actions on this page post-login, you would.
    // For safety, setting it if no immediate redirect happens or for non-redirect cases.
    // setIsLoading(false); // Generally, redirect makes this less critical.
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    message,
    isLoading,
    handleLogin,
  };
};
