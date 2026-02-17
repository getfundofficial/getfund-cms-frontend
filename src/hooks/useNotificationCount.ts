import { useState, useEffect, useCallback, useRef } from 'react';
import notificationService, { NotificationCounts } from '../services/notificationService';

const DEFAULT_POLL_INTERVAL = 60000; // 60 seconds

interface UseNotificationCountOptions {
  enabled?: boolean;
  pollInterval?: number;
}

interface UseNotificationCountReturn {
  counts: NotificationCounts;
  totalCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useNotificationCount({
  enabled = true,
  pollInterval = DEFAULT_POLL_INTERVAL,
}: UseNotificationCountOptions = {}): UseNotificationCountReturn {
  const [counts, setCounts] = useState<NotificationCounts>({
    passwordResetRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCounts = useCallback(async () => {
    if (!enabled) return;
    try {
      const data = await notificationService.getCounts();
      setCounts(data);
    } catch {
      // Silently fail — non-critical polling
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    fetchCounts();

    const startPolling = () => {
      intervalRef.current = setInterval(fetchCounts, pollInterval);
    };

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCounts();
        startPolling();
      } else {
        stopPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, pollInterval, fetchCounts]);

  const totalCount = counts.passwordResetRequests;

  return { counts, totalCount, isLoading, refresh };
}
