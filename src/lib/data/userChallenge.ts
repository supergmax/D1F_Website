// lib/data/userChallenge.ts
import { supabase } from "@/lib/supabaseClient";

export async function fetchUserChallengeOverview(userId: string) {
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("initial_balance, profit, status")
    .eq("profile_id", userId);

  if (error) throw error;

  const totalRevenue = challenges.reduce((sum, c) => sum + c.profit, 0);
  const totalChallenges = challenges.length;
  const activeChallenges = challenges.filter((c) => c.status === "active").length;
  const averageProfit = challenges.length > 0 ? totalRevenue / totalChallenges : 0;

  return {
    totalRevenue,
    totalChallenges,
    activeChallenges,
    averageProfit,
  };
}

export async function fetchUserInvoices(userId: string) {
  const { data, error } = await supabase
    .from("invoices")
    .select("id, stripe_invoice_id, amount, status, created_at")
    .eq("profile_id", userId);

  if (error) throw error;

  return data.map((invoice) => ({
    id: invoice.stripe_invoice_id,
    date: new Date(invoice.created_at).toLocaleDateString("fr-FR"),
    user: userId,
    amount: `${(invoice.amount / 100).toFixed(2)}€`,
    status:
      invoice.status === "paid"
        ? "Complete"
        : invoice.status === "pending"
        ? "Pending"
        : "Cancelled",
  }));
}
