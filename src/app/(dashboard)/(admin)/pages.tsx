// app/(admin)/page.tsx
export default function AdminHome() {
  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Bienvenue sur le Dashboard Admin</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Utilisez le menu à gauche pour accéder aux outils de gestion. Vous pouvez voir les factures,
        suivre les transactions ou gérer les utilisateurs.
      </p>
    </div>
  );
}
