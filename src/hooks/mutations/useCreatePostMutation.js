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
        return { previousPosts }; // Return to avoid breaking the mutation
      }

      queryClient.setQueryData(["feed"], (old) => {
        const pages = old.pages || []; // Ensure `pages` exists
        return {
          ...old,
          pages: pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  posts: [
                    {
                      ...postData,
                      optimisticId: Date.now(),
                      optimistic: true,
                    },
                    ...(page.posts || []),
                  ],
                }
              : page
          ),
        };
      });

      return { previousPosts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
    },
    onError: (error, variables, context) => {
      console.log(error);
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
      // Get previous user data for rollback
      const previousPosts = queryClient.getQueryData(["feed"]);
      queryClient.setQueryData(["feed"], (old) => {
        if (!old || !old.pages) return old;
        const updatedPages = old.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) =>
            post?._id === postId ? { ...post, isDeleting: true } : post
          ),
        }));
        return {
          ...old,
          pages: updatedPages,
        };
      });
      return { previousPosts };
    },
    onError: (error, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["feed"], context.previousPosts);
      }
    },
    onSuccess: (variables, context) => {
      queryClient.setQueryData(["feed"], (old) => {
        if (!old || !old.pages) return old;
        const updatedPages = old.pages.map((page) => ({
          ...page,
          posts: page.posts.filter(
            (post) => post._id !== variables.postId // Remove the post entirely
          ),
        }));
        return {
          ...old,
          pages: updatedPages,
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["feed"]);
    },
  });
};
