'use client';

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
// Removed useRouter, supabase
import { useSignInForm } from "@/hooks/useSignInForm"; // Adjusted path

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  // Removed email, password, message, router states and handleLogin method
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    message, 
    isLoading, 
    handleLogin 
  } = useSignInForm();

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Connexion
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez votre email et mot de passe
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="info@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Mot de passe *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/auth/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {message && (
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                {message}
              </p>
            )}

            <Button type="submit" className="w-full" size="sm">
              Se connecter
            </Button>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Pas encore inscrit ?{" "}
                <Link
                  href="/auth/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
