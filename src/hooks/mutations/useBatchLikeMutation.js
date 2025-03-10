import { createLike } from "@/lib/api/like";
import { generateLikeQueryKey } from "@/lib/utils/consistentLikeQueryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

const BATCH_DELAY = 1000;
const MAX_BATCH_SIZE = 100;

export const useBatchLikeMutation = () => {
  const queryClient = useQueryClient();
  const batchQueue = useRef([]);
  const timeoutRef = useRef(null);

  // Mutation for sending batched likes to the server
  const mutation = useMutation({
    mutationKey: ["batchLike"],
    mutationFn: async (batchActions) => createLike({ actions: batchActions }),

    onMutate: async (batchActions) => {
      const previousStates = new Map();

      batchActions.forEach(({ targetId, postIds, userId, operation }) => {
        const queryKey = generateLikeQueryKey(postIds, userId);
        const previousData = queryClient.getQueryData(queryKey);

        previousStates.set(queryKey, previousData);

        queryClient.setQueryData(queryKey, (oldData) => {
          if (!oldData) return {};

          const updatedData = { ...oldData };

          if (updatedData[targetId]) {
            const postData = updatedData[targetId];

            postData.count =
              operation === "like"
                ? postData.count + 1
                : Math.max(postData.count - 1, 0);
            postData.isLiked = operation === "like";
          }

          return updatedData;
        });
      });

      return { previousStates };
    },

    onError: (error, batchActions, context) => {
      // Roll back using the stored states
      context.previousStates.forEach((previousData, queryKey) => {
        queryClient.setQueryData(queryKey, previousData);
      });
    },

    onSettled: (data, error, batchActions) => {
      batchActions.forEach(({ postIds, userId }) => {
        const queryKey = generateLikeQueryKey(postIds, userId);
        queryClient.invalidateQueries(queryKey);
      });
    },
  });

  // Process batch of likes
  const processBatch = useCallback(async () => {
    if (batchQueue.current.length === 0) return;

    const currentBatch = batchQueue.current.slice(0, MAX_BATCH_SIZE);
    batchQueue.current = batchQueue.current.slice(MAX_BATCH_SIZE);
    mutation.mutate(currentBatch);

    if (batchQueue.current.length > 0) {
      timeoutRef.current = setTimeout(processBatch, BATCH_DELAY);
    } else {
      timeoutRef.current = null;
    }
  }, [mutation]);

  // Function to add likes to the batch queue
  const addToBatch = useCallback(
    (action) => {
      batchQueue.current.push(action);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(processBatch, BATCH_DELAY);
    },
    [processBatch]
  );

  // Cleanup: Process remaining likes on unmount
  useEffect(() => {
    return () => {
      if (batchQueue.current.length > 0) {
        processBatch();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [processBatch]);

  return { addToBatch };
};
