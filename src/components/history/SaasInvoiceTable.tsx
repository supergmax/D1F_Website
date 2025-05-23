"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface TransactionRow {
  type: "invoice" | "payout" | "purchase";
  amount: number;
  created_at: string;
  status: string;
}

// 🔔 Inline Alert Component
const InlineAlert = ({
  variant,
  title,
  message,
}: {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}) => {
  const variantClasses = {
    success: {
      container: "border-green-500 bg-green-50 dark:border-green-500/30 dark:bg-green-500/15",
      icon: "text-green-500",
    },
    error: {
      container: "border-red-500 bg-red-50 dark:border-red-500/30 dark:bg-red-500/15",
      icon: "text-red-500",
    },
    warning: {
      container: "border-yellow-500 bg-yellow-50 dark:border-yellow-500/30 dark:bg-yellow-500/15",
      icon: "text-yellow-500",
    },
    info: {
      container: "border-blue-500 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/15",
      icon: "text-blue-500",
    },
  };

  const icon = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  }[variant];

  return (
    <div className={`rounded-xl border p-4 ${variantClasses[variant].container}`}>
      <div className="flex items-start gap-3">
        <div className={`text-lg ${variantClasses[variant].icon}`}>{icon}</div>
        <div>
          <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default function SaasInvoiceTable() {
  const [data, setData] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setError("Erreur de session Supabase.");
        setLoading(false);
        return;
      }

      const user = session?.user;
      if (!user) {
        setError("Utilisateur non connecté.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("view_latest_transactions")
        .select("type, amount, status, created_at")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Erreur lors du chargement : " + error.message);
      } else {
        setData(data || []);
      }

      setLoading(false);
    };

    fetchTransactions();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Historique des transactions
        </h3>
      </div>

      <div className="px-6 pb-4">
        {loading && (
          <InlineAlert
            variant="info"
            title="Chargement en cours"
            message="Nous récupérons vos transactions..."
          />
        )}

        {!loading && error && (
          <InlineAlert
            variant="error"
            title="Erreur"
            message={error}
          />
        )}

        {!loading && !error && data.length === 0 && (
          <InlineAlert
            variant="info"
            title="Aucune transaction"
            message="Aucune activité n’a été détectée pour l’instant."
          />
        )}
      </div>

      {!loading && !error && data.length > 0 && (
        <div className="custom-scrollbar overflow-x-auto px-6 pb-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Montant</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Facture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {data.map((row, index) => {
                const isOut = row.type === "purchase" || row.type === "payout";
                const currency = row.type === "payout" ? "$" : "WUT";

                return (
                  <tr key={index}>
                    <td className="px-6 py-4 dark:text-gray-200">{new Date(row.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={isOut ? "text-red-600" : "text-green-600"}>
                        {isOut ? "Out" : "In"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={isOut ? "text-red-600" : "text-green-600"}>
                        {row.amount} {currency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          row.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : row.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : row.status === "canceled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
