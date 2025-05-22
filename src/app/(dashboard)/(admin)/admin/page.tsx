'use client';

import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Administrateur</h1>

      <p className="text-gray-600 dark:text-gray-400">
        Bienvenue sur votre interface d'administration. Utilisez le menu ou les liens ci-dessous pour accéder aux outils de gestion.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <Link href="/admin/invoices">
          <div className="p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">Gestion des Factures</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Consultez, modifiez ou suivez le statut des factures utilisateurs.
            </p>
          </div>
        </Link>

        <Link href="/admin/transactions">
          <div className="p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">Transactions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Suivez l’ensemble des flux : achats, factures, retraits, etc.
            </p>
          </div>
        </Link>

        <Link href="/admin/users">
          <div className="p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">Utilisateurs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visualisez et gérez les comptes utilisateurs du système.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
