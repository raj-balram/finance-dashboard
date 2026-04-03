import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Shield, Eye } from 'lucide-react';

const RoleSelector = () => {
  const { role, setRole } = useFinance();
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
      <button onClick={() => setRole('viewer')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${role === 'viewer' ? 'bg-white dark:bg-gray-800 shadow text-gray-900' : 'text-gray-600 hover:bg-gray-200'}`}>
        <Eye size={16} /> Viewer
      </button>
      <button onClick={() => setRole('admin')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${role === 'admin' ? 'bg-white dark:bg-gray-800 shadow text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}>
        <Shield size={16} /> Admin
      </button>
    </div>
  );
};

export default RoleSelector;