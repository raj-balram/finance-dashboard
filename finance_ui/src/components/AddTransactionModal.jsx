import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Salary', 'Other'];

const AddTransactionModal = ({ isOpen, onClose, editData }) => {
  const { addTransaction, editTransaction, role } = useFinance();
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], amount: '', category: 'Food', type: 'expense', description: '' });

  useEffect(() => {
    if (editData) setFormData({ date: editData.date.split('T')[0], amount: editData.amount, category: editData.category, type: editData.type, description: editData.description });
    else setFormData({ date: new Date().toISOString().split('T')[0], amount: '', category: 'Food', type: 'expense', description: '' });
  }, [editData]);

  if (!isOpen || role !== 'admin') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return alert('Enter valid amount');
    const transaction = {
      id: editData ? editData.id : Date.now().toString(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description || `${formData.type} transaction`
    };
    editData ? editTransaction(transaction) : addTransaction(transaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{editData ? 'Edit Transaction' : 'Add New Transaction'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium">Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="mt-1 w-full border rounded-lg p-2 dark:bg-gray-900" required /></div>
          <div><label className="block text-sm font-medium">Amount ($)</label><input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="mt-1 w-full border rounded-lg p-2 dark:bg-gray-900" required /></div>
          <div><label className="block text-sm font-medium">Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="mt-1 w-full border rounded-lg p-2 dark:bg-gray-900">{categories.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium">Type</label><div className="flex gap-4 mt-1"><label><input type="radio" value="income" checked={formData.type === 'income'} onChange={() => setFormData({...formData, type: 'income'})} /> Income</label><label><input type="radio" value="expense" checked={formData.type === 'expense'} onChange={() => setFormData({...formData, type: 'expense'})} /> Expense</label></div></div>
          <div><label className="block text-sm font-medium">Description (optional)</label><input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="mt-1 w-full border rounded-lg p-2 dark:bg-gray-900" /></div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl">Save Transaction</button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;