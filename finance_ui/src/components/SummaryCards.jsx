import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const SummaryCards = () => {
  const { transactions } = useFinance();

  const { totalBalance, totalIncome, totalExpenses } = useMemo(() => {
    let income = 0, expenses = 0;
    transactions.forEach(t => t.type === 'income' ? income += t.amount : expenses += t.amount);
    return { totalIncome: income, totalExpenses: expenses, totalBalance: income - expenses };
  }, [transactions]);

  const cards = [
    { title: 'Total Balance', value: totalBalance, icon: Wallet, color: 'from-emerald-500 to-teal-500', prefix: '$' },
    { title: 'Total Income', value: totalIncome, icon: TrendingUp, color: 'from-green-500 to-emerald-500', prefix: '$' },
    { title: 'Total Expenses', value: totalExpenses, icon: TrendingDown, color: 'from-rose-500 to-red-500', prefix: '$' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                  {card.prefix}{Math.abs(card.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl shadow-md`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${card.color}`}></div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;