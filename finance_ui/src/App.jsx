import React, { useState, useEffect } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import SummaryCards from './components/SummaryCards';
import ChartsSection from './components/ChartsSection';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import RoleSelector from './components/RoleSelector';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <FinanceProvider>
      <div className="min-h-screen transition-colors duration-300">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FinanceFlow
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Smart spending insights</p>
              </div>
              <div className="flex items-center gap-4">
                <RoleSelector />
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <SummaryCards />
          <ChartsSection />
          <Insights />
          <Transactions />
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-800 mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Finance Dashboard — Track, analyze, and optimize your spending habits.</p>
        </footer>
      </div>
    </FinanceProvider>
  );
}

export default App;