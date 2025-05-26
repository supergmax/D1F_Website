'use client';

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useTranslation } from "@/hooks/useTranslation";

export default function SignInForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(t('auth.signIn.loggingIn', "Logging in..."));

    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // For Supabase errors, you might want to keep error.message as is,
      // or map known error messages to translation keys.
      // For simplicity here, we'll keep the direct error message for now.
      setMessage(t('auth.signIn.errorPrefix', "Error: ") + error.message);
      return;
    }

    const userId = loginData?.user?.id;

    if (!userId) {
      setMessage(t('auth.signIn.userNotFound', "Error: User not found."));
      return;
    }

    // Récupérer le rôle depuis la table profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !profile?.role) {
      setMessage(t('auth.signIn.roleFetchError', "Error fetching user role."));
      return;
    }

    // Redirection selon le rôle
    if (profile.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/profile");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t('auth.signIn.title', "Sign In")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('auth.signIn.subtitle', "Enter your email and password")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label>{t('auth.signIn.emailLabel', "Email *")}</Label>
              <Input
                type="email"
                placeholder={t('auth.signIn.emailPlaceholder', "info@example.com")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>{t('auth.signIn.passwordLabel', "Password *")}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.signIn.passwordPlaceholder', "Enter your password")}
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
                {t('auth.signIn.forgotPasswordLink', "Forgot password?")}
              </Link>
            </div>

            {message && (
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                {message} 
              </p>
            )}

            <Button type="submit" className="w-full" size="sm">
              {t('auth.signIn.button', "Sign In")}
            </Button>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {t('auth.signIn.noAccountPrompt', "Don't have an account yet?")}{" "}
                <Link
                  href="/auth/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {t('auth.signIn.createAccountLink', "Create an account")}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
