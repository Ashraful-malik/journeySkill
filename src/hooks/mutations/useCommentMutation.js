import { crateComment, deleteComment } from "@/lib/api/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCommentMutation = ({ id }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-comment"],
    mutationFn: ({ commentData }) => crateComment(commentData),

    onMutate: async ({ commentData }) => {
      // Pause ongoing fetches for the specific comment query
      await queryClient.cancelQueries(["comment", id]);

      // Get the current query cache for the specific key
      const previousCommentPages = queryClient.getQueryData(["comment", id]);

      // Optimistically update the cache
      queryClient.setQueryData(["comment", id], (old) => {
        const pages = old?.pages || [];

        return {
          ...old,
          pages: pages.map((page, index) =>
            index === 0 // Add the comment only to the first page
              ? {
                  ...page,
                  comments: [
                    {
                      ...commentData,
                      optimisticId: Date.now(),
                      optimistic: true,
                    },
                    ...(page.comments || []),
                  ],
                }
              : page
          ),
        };
      });

      return { previousCommentPages };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousCommentPages) {
        queryClient.setQueryData(["comment", id], context.previousCommentPages);
      }
    },

    onSuccess: (newComment) => {
      queryClient.setQueryData(["comment", id], (old) => {
        const pages = old?.pages || [];

        return {
          ...old,
          pages: pages.map((page) => ({
            ...page,
            comments: page.comments.map((comment) =>
              comment.optimistic &&
              comment.optimisticId === newComment.optimisticId
                ? { ...newComment, optimistic: false }
                : comment
            ),
          })),
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["comment", id]);
    },
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: ({ commentId }) => deleteComment(commentId), // Your API call for deletion
    onMutate: async ({ postId, commentId }) => {
      // Pause ongoing fetches for this query
      await queryClient.cancelQueries(["comment", postId]);

      // Get the current cached data
      const previousCommentPages = queryClient.getQueryData([
        "comment",
        postId,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(["comment", postId], (old) => {
        if (!old || !old.pages) return old; // Handle cases where there's no data

        const updatedPages = old.pages.map((page) => ({
          ...page,
          comments: page.comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, isDeleting: true } // Add the optimistic flag
              : comment
          ),
        }));
        return {
          ...old,
          pages: updatedPages,
        };
      });

      return { previousCommentPages }; // Save the previous state for rollback
    },

    onError: (_, variables, context) => {
      // Rollback to the previous state
      if (context?.previousCommentPages) {
        queryClient.setQueryData(
          ["comment", variables.postId],
          context.previousCommentPages
        );
      }
    },
    onSuccess: (_, { postId, commentId }) => {
      // Permanently remove the comment after successful deletion
      queryClient.setQueryData(["comment", postId], (old) => {
        if (!old || !old.pages) return old;

        const updatedPages = old.pages.map((page) => ({
          ...page,
          comments: page.comments.filter(
            (comment) => comment._id !== commentId // Remove the comment entirely
          ),
        }));

        return {
          ...old,
          pages: updatedPages,
        };
      });
    },
    onSettled: ({ postId }) => {
      // Refetch fresh data from the server
      queryClient.invalidateQueries(["comment", postId]);
    },
  });
};
