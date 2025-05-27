'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import Pagination from '@/components/admin/Pagination';
import { supabase } from '@/lib/supabaseClient';

type User = {
  id: string;
  first_name: string;
  last_name: string;
  affiliate_id: string;
  godfather_id: string | null;
  deal_status: boolean;
  contrat_status: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, first_name, last_name, affiliate_id, godfather_id, deal_status, contrat_status'
      );

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error.message);
    } else {
      setUsers(data || []);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleToggle = async (
    id: string,
    field: 'deal_status' | 'contrat_status',
    value: boolean
  ) => {
    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour de ${field} :`, error.message);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
      );
    }
  };

  const exportCSV = (usersToExport: User[]) => {
    const header = [
      'ID',
      'Prénom',
      'Nom',
      'Affiliate ID',
      'Godfather ID',
      'Deal Status',
      'Contrat Status',
    ];

    const rows = usersToExport.map((user) => [
      user.id,
      user.first_name,
      user.last_name,
      user.affiliate_id,
      user.godfather_id ?? '',
      user.deal_status ? 'Oui' : 'Non',
      user.contrat_status ? 'Oui' : 'Non',
    ]);

    const csvContent = [header, ...rows]
      .map((e) => e.join(';'))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'utilisateurs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="ml-[90px] lg:ml-[290px] px-6 py-8">
      <h1 className="text-xl font-semibold mb-6">Gestion des utilisateurs</h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom..."
          className="border px-3 py-2 rounded w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => exportCSV(filteredUsers)}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          Exporter CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-white">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Prénom</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Affiliate ID</th>
              <th className="px-4 py-3">Godfather ID</th>
              <th className="px-4 py-3">Deal</th>
              <th className="px-4 py-3">Contrat</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.first_name}</td>
                <td className="px-4 py-2">{user.last_name}</td>
                <td className="px-4 py-2">{user.affiliate_id}</td>
                <td className="px-4 py-2">{user.godfather_id || '-'}</td>
                <td className="px-4 py-2">
                  <Switch
                    checked={user.deal_status}
                    onChange={(val) =>
                      handleToggle(user.id, 'deal_status', val)
                    }
                    className={`${
                      user.deal_status ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Toggle Deal</span>
                    <span
                      className={`${
                        user.deal_status ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </td>
                <td className="px-4 py-2">
                  <Switch
                    checked={user.contrat_status}
                    onChange={(val) =>
                      handleToggle(user.id, 'contrat_status', val)
                    }
                    className={`${
                      user.contrat_status ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Toggle Contrat</span>
                    <span
                      className={`${
                        user.contrat_status ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredUsers.length / rowsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
