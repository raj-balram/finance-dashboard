import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area } from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#6366F1', '#F43F5E', '#FBBF24', '#10B981', '#8B5CF6', '#EC4899'];

const ChartsSection = () => {
  const { transactions } = useFinance();

  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ month: format(d, 'MMM yyyy'), monthKey: `${d.getFullYear()}-${d.getMonth()}`, income: 0, expenses: 0 });
    }
    transactions.forEach(t => {
      const date = parseISO(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthData = months.find(m => m.monthKey === monthKey);
      if (monthData) {
        if (t.type === 'income') monthData.income += t.amount;
        else monthData.expenses += t.amount;
      }
    });
    return months.map(({ month, income, expenses }) => ({ month, income, expenses, balance: income - expenses }));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const categories = new Map();
    transactions.forEach(t => {
      if (t.type === 'expense') categories.set(t.category, (categories.get(t.category) || 0) + t.amount);
    });
    return Array.from(categories.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">📊 Financial Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Monthly Balance Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis tickFormatter={(val) => `$${val}`} stroke="#6B7280" />
                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#6366F1" strokeWidth={3} name="Net Balance" />
                <Area type="monotone" dataKey="income" fill="#10B981" stroke="#10B981" fillOpacity={0.2} name="Income" />
                <Area type="monotone" dataKey="expenses" fill="#F43F5E" stroke="#F43F5E" fillOpacity={0.2} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          {categoryData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-gray-400">No expense data</div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {categoryData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;