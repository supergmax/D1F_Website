"use client";
import React, { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

export function CopyCard({
  icon,
  id,
  label,
}: {
  icon: React.ReactNode;
  id: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie dans le presse-papiers", err);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full h-full">
      {/* Icone à gauche + bouton à droite */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {icon}
        </div>

        <button
          onClick={handleCopy}
          type="button"
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1" />
              Copié !
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4 mr-1" />
              Copier l'ID
            </>
          )}
        </button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</div>

      <div
        className="text-lg font-bold text-gray-800 dark:text-white truncate max-w-full"
        title={id} // info-bulle complète si on survole
      >
        {id}
      </div>
    </div>
  );
}
