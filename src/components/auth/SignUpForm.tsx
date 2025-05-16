'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import CGUModal from "@/components/modal/CGUModal"; // Tu peux adapter le nom selon ton projet

export default function SignUpForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showCorporation, setShowCorporation] = useState(false);
  const [acceptedCGU, setAcceptedCGU] = useState(false);
  const [showCGUModal, setShowCGUModal] = useState(false);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    id_phone: '',
    phone: '',
    address: '',
    billing_address: '',
    country: '',
    language: 'fr',
    affiliate_code: '',
    corp_name: '',
    corp_address: '',
    corp_vat: '',
    corp_country: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const generateAffiliateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptedCGU) {
      setError("Veuillez accepter les CGU pour continuer.");
      return;
    }

    const affiliate_id = generateAffiliateId();
    let corpId: string | null = null;

    // Vérifie code de parrainage
    const { data: godfather, error: godfatherErr } = await supabase
      .from("profiles")
      .select("affiliate_id")
      .eq("affiliate_id", form.affiliate_code)
      .single();

    if (!godfather || godfatherErr) {
      setError("Code de parrainage invalide.");
      return;
    }

    if (showCorporation && form.corp_name.trim() !== "") {
      corpId = uuidv4(); // on génère l'ID dès maintenant
    }

    // Création utilisateur
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          corp_id: corpId
        }
      }
    });

    if (signUpError || !signUpData.user?.id) {
      setError(signUpError?.message || "Erreur lors de la création de l'utilisateur.");
      return;
    }

    const userId = signUpData.user.id;

    // Insertion dans profiles
    const { error: profileErr } = await supabase.from("profiles").insert({
      id: userId,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      id_phone: form.id_phone,
      phone: form.phone,
      address: form.address || null,
      billing_address: form.billing_address || null,
      country: form.country || null,
      language: form.language,
      affiliate_id,
      godfather_id: form.affiliate_code,
      role: "user",
      corp_id: corpId // peut être null
    });

    if (profileErr) {
      setError("Erreur lors de l'insertion dans les profils.");
      return;
    }

    // Si société à créer
    if (showCorporation && corpId) {
      const { error: corpErr } = await supabase.from("corporations").insert({
        id: corpId,
        profile_id: userId,
        corp_name: form.corp_name,
        address: form.corp_address || null,
        vat_number: form.corp_vat || null,
        country: form.corp_country || null
      });

      if (corpErr) {
        setError("Profil créé, mais erreur à la création de la société.");
        return;
      }
    }

    router.push('/user_profile');
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Création de compte
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label>First Name*</Label>
              <Input name="first_name" required value={form.first_name} onChange={handleChange} />
            </div>
            <div>
              <Label>Last Name*</Label>
              <Input name="last_name" required value={form.last_name} onChange={handleChange} />
            </div>
          </div>

          <Label>Email*</Label>
          <Input type="email" name="email" required value={form.email} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label>Phone ID*</Label>
              <Input name="id_phone" required placeholder="+33" value={form.id_phone} onChange={handleChange} />
            </div>
            <div>
              <Label>Phone*</Label>
              <Input name="phone" required value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <Label>Password*</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
            />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer">
              {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
            </span>
          </div>

          <Label>Address</Label>
          <Input name="address" value={form.address} onChange={handleChange} />

          <Label>Billing Address</Label>
          <Input name="billing_address" value={form.billing_address} onChange={handleChange} />

          <Label>Country</Label>
          <Input name="country" value={form.country} onChange={handleChange} />

          <Label>Language*</Label>
          <select name="language" className="w-full border rounded-lg p-2" value={form.language} onChange={handleChange}>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>

          <div className="mt-4">
            <Checkbox checked={showCorporation} onChange={() => setShowCorporation(!showCorporation)} />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Add a corporation?</span>
          </div>

          {showCorporation && (
            <div className="space-y-4 border-t pt-5 mt-4">
              <Label>Corporation Name*</Label>
              <Input name="corp_name" required value={form.corp_name} onChange={handleChange} />

              <Label>Corporation Address</Label>
              <Input name="corp_address" value={form.corp_address} onChange={handleChange} />

              <Label>VAT Number</Label>
              <Input name="corp_vat" value={form.corp_vat} onChange={handleChange} />

              <Label>Corporation Country</Label>
              <Input name="corp_country" value={form.corp_country} onChange={handleChange} />
            </div>
          )}

          <Label>Affiliate Code*</Label>
          <Input name="affiliate_code" required value={form.affiliate_code} onChange={handleChange} />

          <div className="flex items-start gap-3">
            <Checkbox checked={acceptedCGU} onChange={setAcceptedCGU} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              I accept the{" "}
              <button
                type="button"
                className="text-brand-500 underline hover:text-brand-600 dark:text-brand-400"
                onClick={() => setShowCGUModal(true)}
              >
                read the CGU
              </button>
            </p>
          </div>

          {!acceptedCGU && (
            <p className="text-sm text-red-500">
              You must accept the CGU to create an account.
            </p>
          )}

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Already have an account ?{" "}
            <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
              Sign In
            </Link>
          </p>
        </div>

        <CGUModal isOpen={showCGUModal} onClose={() => setShowCGUModal(false)} />
      </div>
    </div>
  );
}
