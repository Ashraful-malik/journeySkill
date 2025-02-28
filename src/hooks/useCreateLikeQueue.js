// hooks/useLikeQueue.js
import { useCallback, useEffect, useRef } from "react";

const DEBOUNCE_TIME = 1000; // 1 second

export const useLikeQueue = (userId) => {
  const queue = useRef([]);
  const timeout = useRef(null);

  const processQueue = useCallback(async () => {
    if (queue.current.length === 0) return;

    const actionsToSend = [...queue.current];
    queue.current = [];

    try {
    } catch (error) {
      // Retry logic or error handling
      console.error("Batch like failed:", error);
      queue.current.unshift(...actionsToSend); // Requeue failed actions
    }
  });

  const addToQueue = useCallback(
    (action) => {
      queue.current.push(action);

      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(processQueue, DEBOUNCE_TIME);
    },
    [processQueue]
  );

  // Process remaining queue on unmount
  useEffect(() => {
    return () => {
      if (queue.current.length > 0) {
        processQueue();
      }
    };
  }, [processQueue]);

  return { addToQueue };
};
