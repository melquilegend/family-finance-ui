export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  description?: string;
  theme: 'light' | 'dark' | 'couple';
  language: 'en' | 'pt';
  currency: Currency;
  createdAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Savings {
  id: string;
  userId: string;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: Date;
  assignedTo: string[]; // user IDs
  createdBy: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo: string; // user ID
  createdBy: string;
  dueDate?: Date;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
}

export type Theme = 'light' | 'dark' | 'couple';
export type Language = 'en' | 'pt';
export type Theme = 'light' | 'dark' | 'couple' | 'ocean' | 'forest' | 'sunset' | 'purple' | 'rose' | 'midnight';
export type Currency = 'USD' | 'AOA' | 'BRL' | 'EUR';

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}