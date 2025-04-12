import { uploadChallengeBannerImage } from "@/lib/api/challenge";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadChallengeBannerImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["upload-Challenge-banner-image"],
    mutationFn: ({ file, userId }) =>
      uploadChallengeBannerImage({ file, userId }),
    onMutate: async (data) => {
      await queryClient.cancelQueries(["challenges"]);
      const previousFeed = queryClient.getQueryData(["challenges"]);

      queryClient.setQueryData(["challenges"], (oldData) => ({
        ...oldData,
        tempPostImage: URL.createObjectURL(data.file),
      }));
      return { previousFeed };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["challenges"]);
    },
    onError: (error, variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(["challenges"], context.previousFeed);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["challenges"]);
    },
  });
};
