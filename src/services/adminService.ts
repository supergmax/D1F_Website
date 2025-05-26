import { supabase } from '../lib/supabaseClient'; // Adjusted path assuming services is one level down from src

// Define ChallengeStatus type
// Based on typical statuses seen in the project, can be expanded
export type ChallengeStatus = 'active' | 'passed' | 'failed' | 'pending_payment' | 'expired' | 'requested' | 'done' | 'cancelled' | string; // string for broader compatibility

// Interface for AdminChallenge (fields from the 'challenges' table)
export interface AdminChallenge {
  id: string;
  created_at: string;
  profile_id: string;
  type: string; // e.g., '10k', '25k', '50k', '100k', '200k'
  status: ChallengeStatus;
  start_date: string | null;
  end_date: string | null;
  profit: number | null;
  initial_balance: number | null;
  current_balance: number | null;
  name?: string; // Optional name for the challenge
  challenge_num?: number; // Optional challenge number
  note?: string | null;
  label?: string; // Optional label
  updated_at?: string;
  // Add any other fields from the 'challenges' table that might be relevant for admin view
  [key: string]: any; // For flexibility
}

// Interface for AdminProfileLite
export interface AdminProfileLite {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

// Function to get all challenges
export const getAllChallenges = async (): Promise<{ data: AdminChallenge[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false }); // Example ordering

  if (error) {
    console.error('Error fetching all challenges:', error);
  }
  return { data, error };
};

// Function to get all profiles (lite version)
export const getAllProfilesLite = async (): Promise<{ data: AdminProfileLite[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name');

  if (error) {
    console.error('Error fetching all profiles lite:', error);
  }
  return { data, error };
};

// Function to update challenge status
export const updateChallengeStatus = async (challengeId: string, newStatus: ChallengeStatus): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('challenges')
    .update({ status: newStatus, updated_at: new Date().toISOString() }) // Also update updated_at
    .eq('id', challengeId);

  if (error) {
    console.error(`Error updating challenge ${challengeId} to status ${newStatus}:`, error);
  }
  return { error };
};

// Define PurchaseStatus type
// Based on typical e-commerce statuses, can be expanded
export type PurchaseStatus = 
  | 'requested' 
  | 'pending_payment' 
  | 'payment_failed'
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'completed' // Similar to 'done' but more common for purchases
  | 'cancelled' 
  | 'refunded' 
  | string; // string for broader compatibility

// Interface for AdminPurchase (fields from the 'purchases' table)
export interface AdminPurchase {
  id: string;
  profile_id: string;
  product_id: string; // Assuming there's a product_id
  quantity: number;
  amount: number; // Total amount for the purchase
  status: PurchaseStatus;
  created_at: string;
  updated_at?: string;
  shipping_address?: Record<string, any>; // JSONB for address
  tracking_number?: string | null;
  // Add any other fields from the 'purchases' table that might be relevant for admin view
  [key: string]: any; // For flexibility
}

// Function to get all purchases
export const getAllPurchases = async (): Promise<{ data: AdminPurchase[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('purchases') // Assuming the table name is 'purchases'
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all purchases:', error);
  }
  return { data, error };
};

// Function to update purchase status
export const updatePurchaseStatus = async (purchaseId: string, newStatus: PurchaseStatus): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('purchases') // Assuming the table name is 'purchases'
    .update({ status: newStatus, updated_at: new Date().toISOString() }) // Also update updated_at
    .eq('id', purchaseId);

  if (error) {
    console.error(`Error updating purchase ${purchaseId} to status ${newStatus}:`, error);
  }
  return { error };
};

// Define PayoutStatus type
// Based on typical statuses, can be expanded
export type PayoutStatus = 'requested' | 'pending' | 'processing' | 'done' | 'failed' | 'cancelled' | string; // string for broader compatibility

// Interface for AdminPayout (fields from the 'payouts' table)
export interface AdminPayout {
  id: string;
  profile_id: string;
  amount: number; // Assuming amount is stored in a numeric format, e.g., cents or a base unit
  amount_tokens?: number; // If there's a separate token amount
  status: PayoutStatus;
  created_at: string;
  updated_at?: string;
  processed_at?: string | null; // When the payout was actually processed
  transaction_details?: Record<string, any>; // For JSONB or similar fields for payment processor info
  payout_method?: string;
  // Add any other fields from the 'payouts' table that might be relevant for admin view
  [key: string]: any; // For flexibility
}

// Function to get all payouts
export const getAllPayouts = async (): Promise<{ data: AdminPayout[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('payouts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all payouts:', error);
  }
  return { data, error };
};

// Function to update payout status
export const updatePayoutStatus = async (payoutId: string, newStatus: PayoutStatus): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('payouts')
    .update({ status: newStatus, updated_at: new Date().toISOString() }) // Also update updated_at
    .eq('id', payoutId);

  if (error) {
    console.error(`Error updating payout ${payoutId} to status ${newStatus}:`, error);
  }
  return { error };
};

// Define InvoiceStatus type
// Based on typical statuses seen in the project, can be expanded
export type InvoiceStatus = 'requested' | 'pending_payment' | 'done' | 'failed' | 'cancelled' | string; // string for broader compatibility

// Interface for AdminInvoice (fields from the 'invoices' table)
export interface AdminInvoice {
  id: string;
  profile_id: string;
  amount: number; // Assuming amount is stored in a numeric format, e.g., cents or a base unit
  status: InvoiceStatus;
  created_at: string;
  updated_at?: string;
  invoice_details?: Record<string, any>; // For JSONB or similar fields
  payment_method?: string;
  transaction_id?: string;
  // Add any other fields from the 'invoices' table that might be relevant for admin view
  [key: string]: any; // For flexibility
}

// Function to get all invoices
export const getAllInvoices = async (): Promise<{ data: AdminInvoice[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all invoices:', error);
  }
  return { data, error };
};

// Function to update invoice status
export const updateInvoiceStatus = async (invoiceId: string, newStatus: InvoiceStatus): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('invoices')
    .update({ status: newStatus, updated_at: new Date().toISOString() }) // Also update updated_at
    .eq('id', invoiceId);

  if (error) {
    console.error(`Error updating invoice ${invoiceId} to status ${newStatus}:`, error);
  }
  return { error };
};
