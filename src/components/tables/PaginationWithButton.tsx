'use client';

import React from 'react';

interface Props {
  totalPages: number;
  initialPage: number;
  onPageChange: (page: number) => void;
}

export default function PaginationWithButton({
  totalPages,
  initialPage,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex gap-2 justify-center">
      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        const isActive = page === initialPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded border text-sm ${
              isActive
                ? 'bg-brand-500 text-white border-brand-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700'
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
