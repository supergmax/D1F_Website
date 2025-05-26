import { supabase } from '@/lib/supabaseClient'; // Adjusted path

export const signInWithEmail = async (email: string, password: string): Promise<{ user: any; profile: any; error: any }> => {
  const { data: loginData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error('Authentication error:', authError);
    return { user: null, profile: null, error: authError };
  }

  if (!loginData.user) {
    console.error('No user returned after sign in.');
    // This case might be covered by authError, but good to have a specific check
    return { user: null, profile: null, error: { message: 'Login failed, no user data returned.' } };
  }

  // Fetch the user's profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*') // Select all columns
    .eq('id', loginData.user.id)
    .single(); // Assuming one profile per user

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    // Even if login was successful, if profile fetch fails, treat as an error for this function's contract
    // Log out the user to prevent partial login state if necessary, though Supabase session is already set
    // await supabase.auth.signOut(); // Optional: sign out if profile is crucial for app operation post-login
    return { user: loginData.user, profile: null, error: profileError };
  }

  if (!profileData) {
    console.error('No profile found for the user.');
    // Similar to above, handle missing profile as an error
    // await supabase.auth.signOut(); // Optional
    return { user: loginData.user, profile: null, error: { message: 'User profile not found.'} };
  }

  return { user: loginData.user, profile: profileData, error: null };
};

export interface SignUpFormData {
  first_name: string;
  last_name: string;
  email: string;
  password?: string; // Optional if using OTP or social, but required for email/pass signup
  phone_number: string;
  country: string;
  address: string;
  city: string;
  zip_code: string;
  billing_address_is_different: boolean;
  billing_address?: string;
  billing_city?: string;
  billing_zip_code?: string;
  billing_country?: string;
  corp_name?: string;
  corp_siret?: string;
  corp_vat?: string;
  affiliate_code?: string; // This is the godfather_id that the user inputs
  showCorporation?: boolean; // Helper for form logic, not directly stored
  // Add any other fields that are part of the sign-up form
}

function generateRandomPassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

function generateAffiliateId(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


export const signUpUser = async (formData: SignUpFormData): Promise<{ user: any; profile: any; error: any }> => {
  let godfatherProfileId: string | null = null;

  // 1. Validate affiliate code (which is the godfather's affiliate_id)
  if (formData.affiliate_code) {
    const { data: godfatherProfile, error: godfatherError } = await supabase
      .from('profiles')
      .select('id')
      .eq('affiliate_id', formData.affiliate_code)
      .single();

    if (godfatherError || !godfatherProfile) {
      console.error('Error validating affiliate code:', godfatherError);
      return { user: null, profile: null, error: { message: 'Invalid affiliate code.' } };
    }
    godfatherProfileId = godfatherProfile.id;
  }

  let corpId: string | null = null;
  // 2. Handle corporation if applicable
  if (formData.showCorporation && formData.corp_name) {
    corpId = `corp_${generateAffiliateId(10)}`; // Generate a unique ID for the corporation
    const { error: corpError } = await supabase
      .from('corporations')
      .insert([{ 
        id: corpId, 
        name: formData.corp_name,
        siret: formData.corp_siret,
        vat_number: formData.corp_vat,
        // owner_id will be set after user creation if needed, or managed separately
      }]);

    if (corpError) {
      console.error('Error creating corporation:', corpError);
      return { user: null, profile: null, error: { message: `Corporation creation failed: ${corpError.message}` } };
    }
  }

  // 3. Generate newBrokerId
  const { data: maxBrokerIdData, error: brokerIdError } = await supabase
    .from('profiles')
    .select('broker_id')
    .like('broker_id', 'WUF-%')
    .order('broker_id', { ascending: false })
    .limit(1)
    .single();

  if (brokerIdError && brokerIdError.code !== 'PGRST116') { // PGRST116: 'query returned no rows' which is fine for the first broker
    console.error('Error fetching max broker_id:', brokerIdError);
    return { user: null, profile: null, error: { message: `Broker ID generation failed: ${brokerIdError.message}` } };
  }

  let nextBrokerNum = 1;
  if (maxBrokerIdData && maxBrokerIdData.broker_id) {
    const parts = maxBrokerIdData.broker_id.split('-');
    if (parts.length === 2 && !isNaN(parseInt(parts[1]))) {
      nextBrokerNum = parseInt(parts[1]) + 1;
    }
  }
  const newBrokerId = `WUF-${String(nextBrokerNum).padStart(6, '0')}`;

  // 4. Generate newBrokerPwd
  const newBrokerPwd = generateRandomPassword(16);

  // 5. Call supabase.auth.signUp
  const passwordToUse = formData.password || generateRandomPassword(); // Ensure password is not empty
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: passwordToUse,
    options: {
      data: { // This data is typically for user_metadata in auth.users, not directly for profiles table
        first_name: formData.first_name,
        last_name: formData.last_name,
        // corp_id: corpId, // Not standard to pass corp_id here, will be in profiles
      },
    },
  });

  if (signUpError) {
    console.error('Sign up error:', signUpError);
    return { user: null, profile: null, error: signUpError };
  }
  if (!signUpData.user) {
    return { user: null, profile: null, error: { message: 'Sign up failed, no user returned.' } };
  }
  const userId = signUpData.user.id;

  // 6. Insert into profiles table
  const ownAffiliateId = generateAffiliateId(); // User's own affiliate ID
  const profileToInsert = {
    id: userId,
    updated_at: new Date().toISOString(),
    email: formData.email,
    first_name: formData.first_name,
    last_name: formData.last_name,
    phone_number: formData.phone_number,
    address: formData.address,
    city: formData.city,
    zip_code: formData.zip_code,
    country: formData.country,
    billing_address_is_different: formData.billing_address_is_different,
    billing_address: formData.billing_address_is_different ? formData.billing_address : formData.address,
    billing_city: formData.billing_address_is_different ? formData.billing_city : formData.city,
    billing_zip_code: formData.billing_address_is_different ? formData.billing_zip_code : formData.zip_code,
    billing_country: formData.billing_address_is_different ? formData.billing_country : formData.country,
    corp_id: corpId,
    affiliate_id: ownAffiliateId,
    godfather_id: godfatherProfileId, // This is the profile_id of the godfather
    role: 'user', // Default role
    broker_id: newBrokerId,
    broker_pwd: newBrokerPwd, 
    // Other fields like avatar_url, username, website can be null or set later
  };

  const { error: profileInsertError } = await supabase
    .from('profiles')
    .insert([profileToInsert]);

  if (profileInsertError) {
    console.error('Error inserting profile:', profileInsertError);
    // Attempt to delete the auth user if profile creation fails to avoid orphaned auth user
    await supabase.auth.admin.deleteUser(userId); // Requires admin privileges
    return { user: null, profile: null, error: { message: `Profile creation failed: ${profileInsertError.message}` } };
  }
  
  // 7. Insert into affiliations table (if godfatherProfileId exists)
  if (godfatherProfileId) {
    const { error: affiliationError } = await supabase
      .from('affiliations') // Assuming 'affiliations' is the correct table name
      .insert([{ 
        godfather_id: godfatherProfileId, // User who referred
        affiliate_id: userId,          // User who was referred
        // commission_rate: 0.1, // Example default commission rate, adjust as needed
        // status: 'active'      // Example default status
      }]);

    if (affiliationError) {
      console.error('Error creating affiliation:', affiliationError);
      // This might be considered a non-critical error depending on business logic.
      // For now, let's return it but the user and profile are already created.
      // Optionally, log this and proceed or attempt to roll back previous steps (complex).
      // For simplicity, we'll return the error but acknowledge user/profile might exist.
      // return { user: signUpData.user, profile: profileToInsert, error: { message: `Affiliation creation failed: ${affiliationError.message}` } };
       console.warn(`Affiliation creation failed for user ${userId} with godfather ${godfatherProfileId}: ${affiliationError.message}. User and profile created.`);
    }
  }

  // 8. Fetch the newly created full profile (as profileToInsert might not have all DB defaults or triggers applied)
  const { data: newProfileData, error: newProfileFetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (newProfileFetchError || !newProfileData) {
    console.error('Error fetching newly created profile:', newProfileFetchError);
    // User is created, profile was inserted, but fetching it back failed.
    // This is unusual. Return the inserted profile data with a warning.
    return { user: signUpData.user, profile: profileToInsert, error: { message: `Successfully created user and inserted profile, but failed to fetch it back: ${newProfileFetchError?.message}` } };
  }
  
  return { user: signUpData.user, profile: newProfileData, error: null };
};
