'use client';

// Removed useState (partially, showPassword remains local for now as hook doesn't provide toggle for it directly)
// Removed useRouter, supabase, uuidv4
import { useState } from 'react'; // Kept for showPassword, can be moved to hook if desired.
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import CGUModal from "@/components/auth/CGUModal";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import { useSignUpForm } from "@/hooks/useSignUpForm"; // Adjusted path

export default function SignUpForm() {
  // const router = useRouter(); // Removed, router is in the hook

  // Local state for showPassword, as the hook's toggleShowPassword implies it manages its own internal state for password visibility logic if needed,
  // but the actual boolean for the input type needs to be local or part of the hook's returned state.
  // The hook description indicated it returns `showPassword` state, so local one is not needed.
  // const [showPassword, setShowPassword] = useState(false); // This will be from the hook

  // Removed local form, error, showCorporation, doneCGU, showCGUModal states
  // Removed handleChange, generateAffiliateId, generateBrokerPassword, handleSubmit methods

  const {
    form,
    // setForm, // Not directly used if handleChange and specific handlers cover all cases
    error,
    isLoading,
    showPassword,
    toggleShowPassword,
    // showCorporation, // This is form.showCorporation from the hook
    toggleShowCorporation,
    doneCGU,
    toggleDoneCGU,
    showCGUModal,
    toggleShowCGUModal,
    handleChange,
    handlePhoneChange,
    handlePlaceSelect,
    handleSubmit,
  } = useSignUpForm();
  return (
    <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY!}>
      <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <h1 className="mb-8 font-semibold text-gray-800 dark:text-white text-xl">Création de compte</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div><Label>First Name*</Label><Input name="first_name" required value={form.first_name} onChange={handleChange} /></div>
              <div><Label>Last Name*</Label><Input name="last_name" required value={form.last_name} onChange={handleChange} /></div>
            </div>
            <Label>Email*</Label>
            <Input type="email" name="email" required value={form.email} onChange={handleChange} />
            <Label>Phone*</Label>
            <PhoneInput
              country={'fr'} // Default country
              value={form.phone_number} // Use phone_number from hook's form state
              inputProps={{ name: "phone_number", required: true }}
              onChange={(value, data) => handlePhoneChange(value, data)} // Use handler from hook
            />
            <Label>Password*</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} name="password" required value={form.password} onChange={handleChange} />
              <span onClick={toggleShowPassword} className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"> {/* Use toggle from hook */}
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
            <Label>Country</Label>
            <Input name="country" value={form.country} onChange={handleChange} /> {/* Assuming country is part of form state */}
            
            {/* Billing Address Fields - Assuming they are part of the form state in the hook */}
            {/* You might need a checkbox to toggle visibility of these, similar to showCorporation */}
            {/* For now, directly binding to form state based on SignUpFormData */}
            <Label>Address</Label>
            <GeoapifyGeocoderAutocomplete
              placeholder="Adresse principale"
              // Assuming place.properties.formatted is what you want to store
              placeSelect={(place) => handlePlaceSelect(place, 'address')}
            />
            
            {/* Optional: Checkbox to use different billing address */}
            {/* <div className="mt-4">
              <Checkbox name="billing_address_is_different" checked={form.billing_address_is_different} onChange={handleChange} />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Use a different billing address?</span>
            </div> */}

            {/* {form.billing_address_is_different && ( */}
              <>
                <Label>Billing Address</Label>
                <GeoapifyGeocoderAutocomplete
                  placeholder="Adresse de facturation"
                  placeSelect={(place) => handlePlaceSelect(place, 'billing_address')}
                />
                {/* Add City, Zip, Country for billing if Geoapify doesn't fill them or if they are separate fields */}
              </>
            {/* )} */}


            <div className="mt-4">
              <Checkbox name="showCorporation" checked={form.showCorporation} onChange={toggleShowCorporation} /> {/* Use toggle from hook and form.showCorporation */}
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Add a corporation?</span>
            </div>

            {form.showCorporation && (
              <div className="space-y-4 border-t pt-5 mt-4">
                <Label>Corporation Name*</Label>
                <Input name="corp_name" required={form.showCorporation} value={form.corp_name} onChange={handleChange} />
                {/* Assuming corp_siret, corp_vat are part of SignUpFormData and thus in 'form' */}
                <Label>SIRET</Label> 
                <Input name="corp_siret" value={form.corp_siret || ''} onChange={handleChange} />
                <Label>VAT Number</Label>
                <Input name="corp_vat" value={form.corp_vat || ''} onChange={handleChange} />
                <Label>Corporation Country</Label>
                <Input name="corp_country" value={form.corp_country || ''} onChange={handleChange} />
              </div>
            )}
            <Label>Affiliate Code</Label> {/* Changed to optional based on service logic */}
            <Input name="affiliate_code" value={form.affiliate_code} onChange={handleChange} />
            
            <div className="flex items-start gap-3">
              <Checkbox name="doneCGU" checked={doneCGU} onChange={toggleDoneCGU} /> {/* Use state and toggle from hook */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                I accept the{" "}
                <button type="button" className="text-brand-500 underline hover:text-brand-600 dark:text-brand-400" onClick={toggleShowCGUModal}> {/* Use toggle from hook */}
                  read the CGU
                </button>
              </p>
            </div>
            {!doneCGU && <p className="text-sm text-red-500">You must accept the CGU to create an account.</p>}
            
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            
            <button type="submit" disabled={isLoading} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-lg disabled:opacity-50">
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Already have an account ?{" "}
              <Link href="/auth/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">Sign In</Link>
            </p>
          </div>
          <CGUModal isRequested={showCGUModal} onClose={toggleShowCGUModal} /> {/* Use state and toggle from hook */}
        </div>
      </div>
    </GeoapifyContext>
  );
}
