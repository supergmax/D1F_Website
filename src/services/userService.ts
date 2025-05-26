import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

export interface UserChallenge {
  profit: number | null;
  status: string | null;
}

export interface UserInvoice {
  id: string;
  created_at: string;
  amount: number;
  status: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const getUserChallenges = async (userId: string): Promise<UserChallenge[]> => {
  const { data, error } = await supabase
    .from('challenges')
    .select('profit, status')
    .eq('profile_id', userId);

  if (error) {
    console.error('Error fetching user challenges:', error);
    return [];
  }

  return data || [];
};

export const getUserTotalChallenges = async (userId: string): Promise<{ count: number; error: any }> => {
  const { count, error } = await supabase
    .from('challenges')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId);

  return { count: count ?? 0, error };
};

export const getUserTotalDoneTransactions = async (userId: string): Promise<{ count: number; error: any }> => {
  const { count, error } = await supabase
    .from('transactions') // Assuming 'transactions' is the correct table name
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId)
    .eq('status', 'done');

  return { count: count ?? 0, error };
};

export interface TransactionRow {
  type: 'invoice' | 'payout' | 'purchase' | string; // string to allow other types if any
  amount: number;
  created_at: string;
  status: string;
}

export const getLatestTransactions = async (userId: string): Promise<{ data: TransactionRow[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('view_latest_transactions') // Ensure this view exists and profile_id is available
    .select('type, amount, status, created_at')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

// Re-using UserInvoice for getUserDoneInvoices as it fits the criteria (amount, created_at)
// If a more specific/trimmed interface is needed, it can be defined as UserDoneInvoice
export const getUserDoneInvoices = async (userId: string): Promise<UserInvoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('id, created_at, amount, status') // Selecting all fields of UserInvoice for consistency
    .eq('profile_id', userId)
    .eq('status', 'done');

  if (error) {
    console.error('Error fetching user done invoices:', error);
    return [];
  }
  return data || [];
};

export interface UserPayout {
  amount_tokens: number;
  processed_at: string;
  // Add any other relevant fields from the 'payouts' table if needed
  [key: string]: any; // For flexibility
}

export const getUserDonePayouts = async (userId: string): Promise<UserPayout[]> => {
  const { data, error } = await supabase
    .from('payouts')
    .select('amount_tokens, processed_at') // Ensure these are the correct column names
    .eq('profile_id', userId)
    .eq('status', 'done');

  if (error) {
    console.error('Error fetching user done payouts:', error);
    return [];
  }
  return data || [];
};

// Interface for detailed challenge data
export interface UserChallengeDetail {
  id: string;
  created_at: string;
  profile_id: string;
  type: string; // e.g., '10k', '25k', '50k', '100k', '200k'
  status: string; // e.g., 'active', 'passed', 'failed', 'pending_payment', 'expired'
  start_date: string | null;
  end_date: string | null;
  profit: number | null;
  initial_balance: number | null;
  current_balance: number | null;
  // Add any other relevant fields from the 'challenges' table
  [key: string]: any; // For flexibility if not all fields are known/needed initially
}

// Function to get detailed challenge data for a user
export const getUserChallengeDetails = async (userId: string): Promise<UserChallengeDetail[]> => {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('profile_id', userId);

  if (error) {
    console.error('Error fetching user challenge details:', error);
    return [];
  }
  return data || [];
};

// Interface for challenge result data
export interface UserChallengeResult {
  id: string;
  created_at: string;
  challenge_id: string;
  metric_name: string; // e.g., 'daily_drawdown', 'overall_drawdown', 'profit_target'
  metric_value: string; // Value of the metric, might need parsing
  is_passed: boolean; // Whether this specific rule/metric was passed
  // Add any other relevant fields from the 'challenge_results' table
  [key: string]: any; // For flexibility
}

// Function to get challenge results for a list of challenge IDs
export const getUserChallengeResults = async (challengeIds: string[]): Promise<UserChallengeResult[]> => {
  if (!challengeIds || challengeIds.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from('challenge_results')
    .select('*')
    .in('challenge_id', challengeIds);

  if (error) {
    console.error('Error fetching user challenge results:', error);
    return [];
  }
  return data || [];
};

export interface FullUserProfile {
  id: string;
  updated_at: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  website: string | null;
  // Add other fields if known, otherwise keep it simple or use 'any' for less critical fields initially
}

export const getFullUserProfile = async (userId: string): Promise<FullUserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching full user profile:', error);
    // It's important to distinguish between a "not found" error (PostgREST P0001 or similar)
    // and other types of errors. For now, any error returns null.
    return null;
  }

  return data;
};

export const getUserInvoices = async (userId: string): Promise<UserInvoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('id, created_at, amount, status')
    .eq('profile_id', userId);

  if (error) {
    console.error('Error fetching user invoices:', error);
    return [];
  }

  return data || [];
};
