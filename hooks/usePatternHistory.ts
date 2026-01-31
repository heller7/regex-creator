"use client";

import { useState, useEffect, useCallback } from 'react';
import type { PatternHistoryEntry, FlagState } from '@/types/regex';

const STORAGE_KEY = 'regexPatternHistory';
const MAX_HISTORY_SIZE = 50;

interface UsePatternHistoryOptions {
  maxSize?: number;
}

/**
 * Hook for managing pattern history with localStorage persistence
 */
export function usePatternHistory(options: UsePatternHistoryOptions = {}) {
  const { maxSize = MAX_HISTORY_SIZE } = options;
  const [history, setHistory] = useState<PatternHistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as PatternHistoryEntry[];
          setHistory(parsed);
        }
      } catch (error) {
        console.error('Failed to load pattern history:', error);
      }
    }
    setMounted(true);
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save pattern history:', error);
      }
    }
  }, [history, mounted]);

  /**
   * Add a pattern to history
   */
  const addToHistory = useCallback(
    (pattern: string, flags?: FlagState) => {
      if (!pattern.trim()) return;

      setHistory((prev) => {
        // Check if pattern already exists in history
        const existingIndex = prev.findIndex((entry) => entry.pattern === pattern);

        if (existingIndex !== -1) {
          // Move existing entry to the top and update timestamp
          const updated = [...prev];
          const [existing] = updated.splice(existingIndex, 1);
          return [
            { ...existing, timestamp: Date.now(), flags: flags || existing.flags },
            ...updated,
          ];
        }

        // Add new entry at the beginning
        const newEntry: PatternHistoryEntry = {
          id: generateId(),
          pattern,
          timestamp: Date.now(),
          flags,
        };

        // Limit history size
        const newHistory = [newEntry, ...prev];
        if (newHistory.length > maxSize) {
          return newHistory.slice(0, maxSize);
        }

        return newHistory;
      });
    },
    [maxSize]
  );

  /**
   * Remove a pattern from history
   */
  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  /**
   * Get a specific pattern from history
   */
  const getPattern = useCallback(
    (id: string) => {
      return history.find((entry) => entry.id === id);
    },
    [history]
  );

  /**
   * Search history by pattern content
   */
  const searchHistory = useCallback(
    (query: string) => {
      if (!query.trim()) return history;
      const lowerQuery = query.toLowerCase();
      return history.filter((entry) =>
        entry.pattern.toLowerCase().includes(lowerQuery)
      );
    },
    [history]
  );

  return {
    history,
    mounted,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getPattern,
    searchHistory,
  };
}

/**
 * Generate a unique ID for history entries
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format timestamp for display
 */
export function formatHistoryTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  // Less than a minute
  if (diff < 60 * 1000) {
    return 'Just now';
  }

  // Less than an hour
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  }

  // Less than a day
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  // Less than a week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  // Format as date
  return new Date(timestamp).toLocaleDateString();
}
