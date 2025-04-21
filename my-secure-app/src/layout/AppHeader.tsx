"use client";
import React from "react";
import { useRouter } from "next/router";

const AppHeader = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">Dashboard Aura 🌈</h1>
        <p className="text-sm text-gray-600">Bienvenue, Tonton Max</p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded"
      >
        Se déconnecter
      </button>
    </header>
  );
};

export default AppHeader;
