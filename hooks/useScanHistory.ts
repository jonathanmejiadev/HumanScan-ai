import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from '@/types/analysis';

const STORAGE_KEY = 'humanscan_history';

export function useScanHistory() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      console.log('[useScanHistory] Loading history...');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AnalysisResult[];
        setHistory(parsed.sort((a, b) => b.timestamp - a.timestamp));
        console.log('[useScanHistory] Loaded', parsed.length, 'items');
      }
    } catch (error) {
      console.error('[useScanHistory] Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addToHistory = useCallback(async (result: AnalysisResult) => {
    try {
      console.log('[useScanHistory] Adding to history:', result.id);
      const newHistory = [result, ...history];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('[useScanHistory] Error saving to history:', error);
    }
  }, [history]);

  const removeFromHistory = useCallback(async (id: string) => {
    try {
      console.log('[useScanHistory] Removing from history:', id);
      const newHistory = history.filter(item => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('[useScanHistory] Error removing from history:', error);
    }
  }, [history]);

  const clearHistory = useCallback(async () => {
    try {
      console.log('[useScanHistory] Clearing history');
      await AsyncStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error('[useScanHistory] Error clearing history:', error);
    }
  }, []);

  const getById = useCallback((id: string) => {
    return history.find(item => item.id === id);
  }, [history]);

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getById,
    refresh: loadHistory,
  };
}
