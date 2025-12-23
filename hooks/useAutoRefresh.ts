// hooks/useAutoRefresh.ts
import { useEffect, useRef } from "react";

export function useAutoRefresh(
  callback: () => void,
  intervalMs: number,
  enabled: boolean = true
) {
  const savedCallback = useRef(callback);

  // Always keep latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}
