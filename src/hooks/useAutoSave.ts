import { useEffect, useRef, useState, useCallback } from 'react';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number; // Debounce delay in milliseconds (default: 2000)
  enabled?: boolean; // Whether auto-save is enabled (default: true)
  localStorageKey?: string; // Key for localStorage backup
}

interface UseAutoSaveReturn {
  status: AutoSaveStatus;
  lastSaved: Date | null;
  error: string | null;
  manualSave: () => Promise<void>;
}

/**
 * Custom hook for auto-saving data with debouncing
 *
 * @param options Configuration options
 * @returns Auto-save status and manual save function
 *
 * @example
 * const { status, lastSaved, manualSave } = useAutoSave({
 *   data: formData,
 *   onSave: async (data) => await contentService.update(id, data),
 *   delay: 3000,
 *   localStorageKey: `draft-${id}`
 * });
 */
export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
  localStorageKey,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);
  const isSavingRef = useRef(false);

  // Save to localStorage for backup
  const saveToLocalStorage = useCallback(() => {
    if (localStorageKey) {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify({
          data,
          timestamp: new Date().toISOString(),
        }));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
    }
  }, [data, localStorageKey]);

  // Perform the actual save
  const performSave = useCallback(async () => {
    if (isSavingRef.current) return;

    isSavingRef.current = true;
    setStatus('saving');
    setError(null);

    try {
      await onSave(data);
      setStatus('saved');
      setLastSaved(new Date());
      previousDataRef.current = data;

      // Clear localStorage backup after successful save
      if (localStorageKey) {
        try {
          localStorage.removeItem(localStorageKey);
        } catch (err) {
          console.error('Failed to clear localStorage:', err);
        }
      }

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (err: any) {
      console.error('Auto-save error:', err);
      setStatus('error');
      setError(err.message || 'Failed to save');

      // Keep backup in localStorage on error
      saveToLocalStorage();
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, localStorageKey, saveToLocalStorage]);

  // Manual save function
  const manualSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    await performSave();
  }, [performSave]);

  // Auto-save effect with debouncing
  useEffect(() => {
    if (!enabled) return;

    // Check if data has actually changed
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
    if (!hasChanged) return;

    // Save to localStorage immediately (for backup)
    saveToLocalStorage();

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      performSave();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, delay, performSave, saveToLocalStorage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    status,
    lastSaved,
    error,
    manualSave,
  };
}

/**
 * Hook to recover data from localStorage backup
 *
 * @param key localStorage key
 * @returns Recovered data or null
 */
export function useLocalStorageRecovery<T>(key: string | undefined): {
  data: T | null;
  timestamp: Date | null;
  clear: () => void;
} {
  const [recoveredData, setRecoveredData] = useState<{
    data: T | null;
    timestamp: Date | null;
  }>({ data: null, timestamp: null });

  useEffect(() => {
    if (!key) return;

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecoveredData({
          data: parsed.data,
          timestamp: parsed.timestamp ? new Date(parsed.timestamp) : null,
        });
      }
    } catch (err) {
      console.error('Failed to recover from localStorage:', err);
    }
  }, [key]);

  const clear = useCallback(() => {
    if (key) {
      try {
        localStorage.removeItem(key);
        setRecoveredData({ data: null, timestamp: null });
      } catch (err) {
        console.error('Failed to clear localStorage:', err);
      }
    }
  }, [key]);

  return {
    data: recoveredData.data,
    timestamp: recoveredData.timestamp,
    clear,
  };
}
