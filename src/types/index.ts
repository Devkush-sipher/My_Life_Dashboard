export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  type: 'work' | 'short-break' | 'long-break';
  duration: number;
  completedAt: string;
}

export interface SleepRecord {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  isPaid: boolean;
  date: string;
  description?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  timing: 'before-meal' | 'after-meal' | 'with-meal';
  frequency: string;
  notes?: string;
  isActive: boolean;
}