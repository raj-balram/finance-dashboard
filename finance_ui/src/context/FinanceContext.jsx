import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initialTransactions } from '../data/mockData';

const ACTIONS = {
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  EDIT_TRANSACTION: 'EDIT_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_ROLE: 'SET_ROLE'
};

function financeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TRANSACTION:
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case ACTIONS.EDIT_TRANSACTION:
      return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) };
    case ACTIONS.DELETE_TRANSACTION:
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case ACTIONS.SET_ROLE:
      return { ...state, role: action.payload };
    default:
      return state;
  }
}

const loadStoredData = () => {
  const stored = localStorage.getItem('finance_transactions');
  return stored ? JSON.parse(stored) : initialTransactions;
};

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, {
    transactions: loadStoredData(),
    role: 'viewer'
  });

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  const addTransaction = (transaction) => dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: transaction });
  const editTransaction = (transaction) => dispatch({ type: ACTIONS.EDIT_TRANSACTION, payload: transaction });
  const deleteTransaction = (id) => dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
  const setRole = (role) => dispatch({ type: ACTIONS.SET_ROLE, payload: role });

  return (
    <FinanceContext.Provider value={{ transactions: state.transactions, role: state.role, addTransaction, editTransaction, deleteTransaction, setRole }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}