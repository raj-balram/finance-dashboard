import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';

const Transactions = () => {
  const { transactions, role, deleteTransaction } = useFinance();
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (filterType !== 'all') filtered = filtered.filter(t => t.type === filterType);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => t.category.toLowerCase().includes(term) || t.description.toLowerCase().includes(term));
    }
    const [field, order] = sortBy.split('-');
    filtered.sort((a, b) => {
      if (field === 'date') return order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      if (field === 'amount') return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      return 0;
    });
    return filtered;
  }, [transactions, filterType, searchTerm, sortBy]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">📋 Transaction History</h2>
        {role === 'admin' && (
          <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md">
            <Plus size={18} /> Add Transaction
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search by category or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Type</th>
                  {role === 'admin' && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-sm">{formatDate(t.date)}</td>
                    <td className="px-6 py-4 text-sm font-medium">{t.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{t.description}</td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right ${t.type === 'income' ? 'text-green-600' : 'text-rose-600'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>{t.type}</span>
                    </td>
                    {role === 'admin' && (
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => { setEditingTransaction(t); setIsModalOpen(true); }} className="p-1 text-indigo-500 hover:bg-indigo-50 rounded"><Edit2 size={16} /></button>
                        <button onClick={() => deleteTransaction(t.id)} className="p-1 text-rose-500 hover:bg-rose-50 rounded"><Trash2 size={16} /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AddTransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} editData={editingTransaction} />
    </div>
  );
};

export default Transactions;