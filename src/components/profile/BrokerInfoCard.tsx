'use client';

import { useState } from 'react';

interface BrokerInfoCardProps {
  broker_id: string;
  broker_pwd: string;
}

export default function BrokerInfoCard({ broker_id, broker_pwd }: BrokerInfoCardProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Broker Info for Challenge</h4>
        <button
          onClick={() => setShow(!show)}
          className="px-3 py-1.5 rounded-full text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {show ? 'Masquer' : 'Afficher'}
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Broker ID</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {show ? broker_id : '**************'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Broker Password</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {show ? broker_pwd : '**************'}
          </p>
        </div>
      </div>
    </div>
  );
}
