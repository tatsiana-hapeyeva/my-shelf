import { useCallback, useRef } from "react";

export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
) {
  const lastRunRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = delay - (now - lastRunRef.current);

      if (remaining <= 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        lastRunRef.current = now;
        return callback(...args);
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          timerRef.current = null;
          callback(...args);
        }, remaining);
      }
    },
    [callback, delay],
  );
}
