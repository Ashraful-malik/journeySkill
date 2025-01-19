import { createPostApi } from "@/lib/api/post";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-post"],
    mutationFn: ({ postData }) => createPostApi(postData),
    onMutate: async ({ postData }) => {
      await queryClient.cancelQueries(["feed"]);
      const previousPosts = queryClient.getQueryData(["feed"]);
      queryClient.setQueryData(["feed"], (oldData) => ({
        ...oldData,
        postData,
      }));
      return { previousPosts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
    },
    onError: (error, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["feed"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["feed"]);
    },
  });
};
