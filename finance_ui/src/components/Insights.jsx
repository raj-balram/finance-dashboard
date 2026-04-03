import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, Award, AlertCircle, Zap } from 'lucide-react';

const Insights = () => {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    if (transactions.length === 0) return [];

    const categorySpending = {};
    transactions.forEach(t => { if (t.type === 'expense') categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount; });
    let highestCategory = { name: 'None', amount: 0 };
    for (const [cat, amt] of Object.entries(categorySpending)) if (amt > highestCategory.amount) highestCategory = { name: cat, amount: amt };

    const now = new Date();
    const currentMonth = now.getMonth(), currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    let currentExpenses = 0, lastExpenses = 0;
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const date = new Date(t.date);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) currentExpenses += t.amount;
        if (date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear) lastExpenses += t.amount;
      }
    });
    const percentChange = lastExpenses === 0 ? (currentExpenses > 0 ? 100 : 0) : ((currentExpenses - lastExpenses) / lastExpenses) * 100;
    const isHigher = percentChange > 0;

    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const avgExpense = expenseTransactions.length ? expenseTransactions.reduce((s, t) => s + t.amount, 0) / expenseTransactions.length : 0;

    const tip = highestCategory.name !== 'None' ? `Highest spend: ${highestCategory.name} ($${highestCategory.amount.toLocaleString()}). Set a budget.` : 'Add expenses for insights!';

    return [
      { title: 'Highest Spending', value: highestCategory.name, sub: `$${highestCategory.amount.toLocaleString()}`, icon: Award, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
      { title: 'Monthly Change', value: `${Math.abs(percentChange).toFixed(1)}%`, sub: isHigher ? 'Higher than last month' : 'Lower than last month', icon: isHigher ? TrendingUp : TrendingDown, color: isHigher ? 'text-rose-500 bg-rose-50' : 'text-emerald-500 bg-emerald-50' },
      { title: 'Avg. Expense', value: `$${avgExpense.toFixed(2)}`, sub: 'per transaction', icon: Zap, color: 'text-indigo-500 bg-indigo-50' },
      { title: 'Smart Tip', value: tip.length > 40 ? tip.slice(0, 45) + '...' : tip, sub: 'Pro insight', icon: AlertCircle, color: 'text-purple-500 bg-purple-50' }
    ];
  }, [transactions]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">💡 Smart Insights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">{insight.title}</p>
                <p className="text-xl font-bold mt-1">{insight.value}</p>
                <p className="text-xs text-gray-500 mt-1">{insight.sub}</p>
              </div>
              <div className={`p-2 rounded-lg ${insight.color}`}><insight.icon size={20} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;