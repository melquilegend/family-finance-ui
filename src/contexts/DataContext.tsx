import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, Savings, Goal, Task, ExpenseCategory } from '../types';
import { useAuth } from './AuthContext';
import { storage, STORAGE_KEYS } from '../utils/storage';

// Default expense categories
const defaultCategories: ExpenseCategory[] = [
  { id: 'groceries', name: 'Groceries', color: '#10B981', icon: '🛒' },
  { id: 'entertainment', name: 'Entertainment', color: '#8B5CF6', icon: '🎬' },
  { id: 'bills', name: 'Bills', color: '#EF4444', icon: '📄' },
  { id: 'transport', name: 'Transport', color: '#F59E0B', icon: '🚗' },
  { id: 'health', name: 'Health', color: '#06B6D4', icon: '🏥' },
  { id: 'shopping', name: 'Shopping', color: '#EC4899', icon: '🛍️' },
  { id: 'other', name: 'Other', color: '#6B7280', icon: '📦' },
];

// API Configuration - Will be updated when backend is deployed
const API_BASE_URL = 'http://localhost:5000'; // Local development
// const API_BASE_URL = 'https://your-render-app.onrender.com'; // Production - update this later

// API Helper functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
};

interface DataContextType {
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Savings
  savings: Savings[];
  addSavings: (saving: Omit<Savings, 'id' | 'createdAt'>) => void;
  updateSavings: (id: string, updates: Partial<Savings>) => void;
  deleteSavings: (id: string) => void;
  
  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Categories
  categories: ExpenseCategory[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { auth, token } = useAuth();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savings, setSavings] = useState<Savings[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories] = useState<ExpenseCategory[]>(defaultCategories);

  // Load data when user changes
  useEffect(() => {
    if (auth.user) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setExpenses([]);
      setSavings([]);
      setGoals([]);
      setTasks([]);
    }
  }, [auth.user]);

  const loadUserData = async () => {
    if (!auth.user) return;
    
    try {
      if (token) {
        // Load data from API (when backend is ready)
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [expensesRes, savingsRes, goalsRes, tasksRes] = await Promise.all([
          apiCall('/api/expenses', { headers }).catch(() => []),
          apiCall('/api/savings', { headers }).catch(() => []),
          apiCall('/api/goals', { headers }).catch(() => []),
          apiCall('/api/tasks', { headers }).catch(() => [])
        ]);
        
        setExpenses(expensesRes || []);
        setSavings(savingsRes || []);
        setGoals(goalsRes || []);
        setTasks(tasksRes || []);
      } else {
        // Fallback to localStorage
        const savedExpenses = storage.get<Expense[]>(`${STORAGE_KEYS.EXPENSES}_${auth.user.id}`) || [];
        const savedSavings = storage.get<Savings[]>(`${STORAGE_KEYS.SAVINGS}_${auth.user.id}`) || [];
        const savedGoals = storage.get<Goal[]>(`${STORAGE_KEYS.GOALS}_${auth.user.id}`) || [];
        const savedTasks = storage.get<Task[]>(`${STORAGE_KEYS.TASKS}_${auth.user.id}`) || [];
        
        setExpenses(savedExpenses);
        setSavings(savedSavings);
        setGoals(savedGoals);
        setTasks(savedTasks);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      // Load from localStorage as fallback
      const savedExpenses = storage.get<Expense[]>(`${STORAGE_KEYS.EXPENSES}_${auth.user.id}`) || [];
      const savedSavings = storage.get<Savings[]>(`${STORAGE_KEYS.SAVINGS}_${auth.user.id}`) || [];
      const savedGoals = storage.get<Goal[]>(`${STORAGE_KEYS.GOALS}_${auth.user.id}`) || [];
      const savedTasks = storage.get<Task[]>(`${STORAGE_KEYS.TASKS}_${auth.user.id}`) || [];
      
      setExpenses(savedExpenses);
      setSavings(savedSavings);
      setGoals(savedGoals);
      setTasks(savedTasks);
    }
  };

  // Expense methods
  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!auth.user) return;

    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    try {
      if (token) {
        await apiCall('/api/expenses', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: expense.date,
          }),
        });
        
        // Reload expenses from API
        loadUserData();
        return;
      }
    } catch (error) {
      console.error('Error adding expense via API:', error);
    }
    
    // Fallback to localStorage
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    storage.set(`${STORAGE_KEYS.EXPENSES}_${auth.user.id}`, updatedExpenses);
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    if (!auth.user) return;
    
    try {
      if (token) {
        await apiCall(`/api/expenses/${id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(updates),
        });
        
        // Reload expenses from API
        loadUserData();
        return;
      }
    } catch (error) {
      console.error('Error updating expense via API:', error);
    }
    
    // Fallback to localStorage
    const updatedExpenses = expenses.map(expense =>
      expense.id === id ? { ...expense, ...updates } : expense
    );
    setExpenses(updatedExpenses);
    storage.set(`${STORAGE_KEYS.EXPENSES}_${auth.user.id}`, updatedExpenses);
  };

  const deleteExpense = async (id: string) => {
    if (!auth.user) return;
    
    try {
      if (token) {
        await apiCall(`/api/expenses/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        // Reload expenses from API
        loadUserData();
        return;
      }
    } catch (error) {
      console.error('Error deleting expense via API:', error);
    }
    
    // Fallback to localStorage
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    storage.set(`${STORAGE_KEYS.EXPENSES}_${auth.user.id}`, updatedExpenses);
  };

  // Savings methods
  const addSavings = (saving: Omit<Savings, 'id' | 'createdAt'>) => {
    if (!auth.user) return;

    const newSaving: Savings = {
      ...saving,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updatedSavings = [newSaving, ...savings];
    setSavings(updatedSavings);
    storage.set(`${STORAGE_KEYS.SAVINGS}_${auth.user.id}`, updatedSavings);
  };

  const updateSavings = (id: string, updates: Partial<Savings>) => {
    if (!auth.user) return;
    
    const updatedSavings = savings.map(saving =>
      saving.id === id ? { ...saving, ...updates } : saving
    );
    setSavings(updatedSavings);
    storage.set(`${STORAGE_KEYS.SAVINGS}_${auth.user.id}`, updatedSavings);
  };

  const deleteSavings = (id: string) => {
    if (!auth.user) return;
    
    const updatedSavings = savings.filter(saving => saving.id !== id);
    setSavings(updatedSavings);
    storage.set(`${STORAGE_KEYS.SAVINGS}_${auth.user.id}`, updatedSavings);
  };

  // Goal methods
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    if (!auth.user) return;

    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updatedGoals = [newGoal, ...goals];
    setGoals(updatedGoals);
    storage.set(`${STORAGE_KEYS.GOALS}_${auth.user.id}`, updatedGoals);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    if (!auth.user) return;
    
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, ...updates } : goal
    );
    setGoals(updatedGoals);
    storage.set(`${STORAGE_KEYS.GOALS}_${auth.user.id}`, updatedGoals);
  };

  const deleteGoal = (id: string) => {
    if (!auth.user) return;
    
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    storage.set(`${STORAGE_KEYS.GOALS}_${auth.user.id}`, updatedGoals);
  };

  // Task methods
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!auth.user) return;

    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    storage.set(`${STORAGE_KEYS.TASKS}_${auth.user.id}`, updatedTasks);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    if (!auth.user) return;
    
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    storage.set(`${STORAGE_KEYS.TASKS}_${auth.user.id}`, updatedTasks);
  };

  const deleteTask = (id: string) => {
    if (!auth.user) return;
    
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    storage.set(`${STORAGE_KEYS.TASKS}_${auth.user.id}`, updatedTasks);
  };

  return (
    <DataContext.Provider value={{
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      savings,
      addSavings,
      updateSavings,
      deleteSavings,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      categories,
    }}>
      {children}
    </DataContext.Provider>
  );
};