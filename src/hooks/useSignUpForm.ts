'use client'; // Required for Next.js App Router hooks

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signUpUser, SignUpFormData } from '@/services/authService'; // Adjusted path

const initialFormData: SignUpFormData = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone_number: '',
  country: '', // Should match a value from your country select options
  address: '',
  city: '',
  zip_code: '',
  billing_address_is_different: false,
  billing_address: '',
  billing_city: '',
  billing_zip_code: '',
  billing_country: '',
  corp_name: '',
  corp_siret: '',
  corp_vat: '',
  affiliate_code: '',
  showCorporation: false, // This field is from the prompt, ensure it's part of SignUpFormData if used by form logic
};

export const useSignUpForm = () => {
  const [form, setForm] = useState<SignUpFormData>(initialFormData);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCGUModal, setShowCGUModal] = useState<boolean>(false);
  const [doneCGU, setDoneCGU] = useState<boolean>(false);
  // showCorporation is part of 'form' state as per SignUpFormData, so no separate state needed here unless it has a different lifecycle.
  // For this implementation, form.showCorporation will be used.
  const [showPassword, setShowPassword] = useState<boolean>(false); // Added as it's a common form feature

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      // Assuming the checkbox is an HTMLInputElement
      const { checked } = e.target as HTMLInputElement;
      setForm(prevForm => ({
        ...prevForm,
        [name]: checked,
      }));
    } else {
      setForm(prevForm => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  // Example for react-phone-number-2 or similar libraries
  // data: { dialCode: string } might vary based on the actual library used
  const handlePhoneChange = (value: string, data: { dialCode: string } | any) => {
    // 'value' from react-phone-number-2 usually includes the dial code.
    // 'data' object often contains country info.
    setForm(prevForm => ({
      ...prevForm,
      phone_number: value, // Store the full phone number including dial code
      // country: data.countryCode?.toUpperCase() || prevForm.country, // Optionally update country based on phone
    }));
  };
  
  // Placeholder for Google Places Autocomplete or similar
  // The 'place' object structure depends on the library used.
  const handlePlaceSelect = (place: any, fieldName: 'address' | 'billing_address') => {
    // This is highly dependent on the structure of 'place' object.
    // Typically, you'd extract address components like street, city, zip, country.
    // For simplicity, let's assume 'place.formatted_address' gives a full address string.
    // And other components are available if needed.
    
    // A more robust implementation would parse place.address_components
    // For example:
    // const streetNumber = place.address_components.find(c => c.types.includes('street_number'))?.long_name || '';
    // const route = place.address_components.find(c => c.types.includes('route'))?.long_name || '';
    // const city = place.address_components.find(c => c.types.includes('locality'))?.long_name || '';
    // const postalCode = place.address_components.find(c => c.types.includes('postal_code'))?.long_name || '';
    // const country = place.address_components.find(c => c.types.includes('country'))?.short_name || '';

    if (fieldName === 'address') {
      setForm(prevForm => ({
        ...prevForm,
        address: place.formatted_address || '', // Or construct from components
        // city: city,
        // zip_code: postalCode,
        // country: country
      }));
    } else if (fieldName === 'billing_address') {
      setForm(prevForm => ({
        ...prevForm,
        billing_address: place.formatted_address || '',
        // billing_city: city,
        // billing_zip_code: postalCode,
        // billing_country: country
      }));
    }
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const toggleShowCorporation = () => setForm(prev => ({ ...prev, showCorporation: !prev.showCorporation }));
  const toggleDoneCGU = () => setDoneCGU(prev => !prev);
  const toggleShowCGUModal = () => setShowCGUModal(prev => !prev);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!doneCGU) {
      setError('Veuillez accepter les Conditions Générales d\'Utilisation.');
      setIsLoading(false);
      return;
    }
    
    // Basic validation example (can be expanded with a library like Zod or Yup)
    if (!form.password || form.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
        setIsLoading(false);
        return;
    }


    const result = await signUpUser(form);

    if (result.error) {
      setError(result.error.message || 'Une erreur est survenue lors de l\'inscription.');
    } else {
      // Success
      // Redirect to /profile or a specific page that informs about email confirmation
      // Supabase typically sends a confirmation email if enabled in settings.
      // router.push('/auth/confirm-email'); // Example: if you have a page for this
      router.push('/profile'); // Or directly to profile if auto-confirmed or for testing
      // Consider displaying a success message or relying on the destination page for that.
    }
    setIsLoading(false);
  };

  return {
    form,
    setForm, // Exposing setForm for more complex direct manipulations if needed
    error,
    isLoading,
    showCGUModal,
    doneCGU,
    showPassword, // Expose showPassword state for the form UI
    handleChange,
    handlePhoneChange,
    handlePlaceSelect,
    toggleShowPassword,
    toggleShowCorporation,
    toggleDoneCGU,
    toggleShowCGUModal,
    handleSubmit,
  };
};
