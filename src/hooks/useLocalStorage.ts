import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Types for the productivity system
export interface ProductivityTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'deep-work' | 'routine' | 'quick-win' | 'learning';
  estimatedMinutes?: number;
  dueDate?: string;
  scheduledTime?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  completedDates: string[];
  createdAt: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  deadline?: string;
  progress: number;
  milestones: { id: string; title: string; completed: boolean }[];
  steps?: string[];
  category: 'career' | 'health' | 'wealth' | 'relationships' | 'personal';
  createdAt: string;
}

export interface LifeMetrics {
  lifeScore: number;
  energy: number;
  focus: number;
  discipline: number;
  body: number;
  mind: number;
  spirit: number;
  deepWorkMinutes: number;
  workoutMinutes: number;
  readingMinutes: number;
  lastUpdated: string;
  history: { date: string; lifeScore: number; energy: number; focus: number; discipline: number }[];
}

export interface DayPlan {
  id: string;
  time: string;
  activity: string;
  type: 'brain-dump' | 'deep-work' | 'routine' | 'break' | 'review';
  completed: boolean;
}

export interface ExecutionRule {
  id: string;
  rule: string;
  active: boolean;
}

export interface BehaviorRating {
  rating: 'lazy-lion' | 'average' | 'focused' | 'billionaire';
  score: number;
  lastUpdated: string;
}

export interface MoneyFlow {
  saved: number;
  invested: number;
  spent: number;
  lastUpdated: string;
}

export interface AIPlanning {
  suggestions: string[];
  dayPlan: DayPlan[];
  executionRules: ExecutionRule[];
  lastGenerated: string;
}
