import { uploadPostImage } from "@/lib/api/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadPostImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["upload-post-image"],
    mutationFn: ({ file, userId }) => uploadPostImage({ file, userId }),
    onMutate: async (data) => {
      await queryClient.cancelQueries(["feed"]);
      const previousFeed = queryClient.getQueryData(["feed"]);

      queryClient.setQueryData(["feed"], (oldData) => ({
        ...oldData,
        tempPostImage: URL.createObjectURL(data.file),
      }));
      return { previousFeed };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
    },
    onError: (error, variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(["feed"], context.previousFeed);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["feed"]);
    },
  });
};
