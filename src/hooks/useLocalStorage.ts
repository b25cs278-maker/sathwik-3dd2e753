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
  progress: number;
  milestones: { id: string; title: string; completed: boolean }[];
  category: 'career' | 'health' | 'wealth' | 'relationships' | 'personal';
  createdAt: string;
}

export interface LifeMetrics {
  lifeScore: number;
  energy: number;
  focus: number;
  discipline: number;
  lastUpdated: string;
  history: { date: string; lifeScore: number; energy: number; focus: number; discipline: number }[];
}

export interface AIPlanning {
  suggestions: string[];
  lastGenerated: string;
}
