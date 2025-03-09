import { createPostApi, deletePost } from "@/lib/api/post";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";

// create post
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-post"],
    mutationFn: ({ postData }) => createPostApi(postData),

    onMutate: async ({ postData }) => {
      await queryClient.cancelQueries(["feed"]);

      const previousPosts = queryClient.getQueryData(["feed"]);

      if (!previousPosts || !previousPosts.pages) {
        return { previousPosts };
      }

      queryClient.setQueryData(["feed"], (old) => {
        if (!old || !old.pages) return old;

        const updatedPages = old.pages.flatMap((innerPages, index) =>
          index === 0
            ? innerPages.map((page) => ({
                ...page,
                posts: [
                  {
                    ...postData,
                    optimisticId: `optimistic-${Date.now()}`, // Temporary optimistic ID
                    optimistic: true,
                  },
                  ...page.posts, // Keep existing posts
                ],
              }))
            : innerPages
        );

        return {
          ...old,
          pages: [updatedPages], // Maintain the original nested structure
        };
      });

      return { previousPosts };
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
    },

    onError: (error, variables, context) => {
      console.error("Error creating post:", error);
      if (context?.previousPosts) {
        queryClient.setQueryData(["feed"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["feed"]);
    },
  });
};

// delete post
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-post"],
    mutationFn: ({ postId }) => deletePost(postId),
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries(["feed"]);

      // Get previous data
      const previousPosts = queryClient.getQueryData(["feed"]);

      // Check if the pages array exists and is not empty
      queryClient.setQueryData(["feed"], (old) => {
        if (!old || !old.pages || !Array.isArray(old.pages)) return old;

        // Flatten the pages array if it's nested
        const updatedPages = old.pages.flat().map((page) => ({
          ...page,
          posts: page.posts.map((post) =>
            post._id === postId ? { ...post, isDeleting: true } : post
          ),
        }));

        return {
          ...old,
          pages: [updatedPages], // Wrap the updated pages back in an array
        };
      });

      return { previousPosts };
    },
    onError: (error, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["feed"], context.previousPosts);
      }
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(["feed"], (old) => {
        if (!old || !old.pages) return old;

        const updatedPages = old.pages.flatMap((innerPages) =>
          innerPages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post._id !== variables.postId),
          }))
        );

        return {
          ...old,
          pages: [updatedPages], // Maintain the original nested structure
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["feed"]);
    },
  });
};
