import { createChallengeApi, deleteChallenge } from "@/lib/api/challenge";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-challenge"],
    mutationFn: ({ allChallengeData }) => createChallengeApi(allChallengeData),
    onMutate: async ({ challengeData }) => {
      await queryClient.cancelQueries(["challenges"]);
      const previousChallenges = queryClient.getQueryData(["challenges"]);
      queryClient.setQueryData(["challenges"], (old) => {
        if (!old) return { pages: [{ allChallenges: [] }] };
        const pages = old.pages ? old.pages : [{ allChallenges: [] }];
        return {
          ...old,
          pages: pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  allChallenges: [
                    {
                      ...challengeData,
                      optimisticId: Date.now(),
                      optimistic: true,
                    },
                    ...(page.allChallenges || []),
                  ],
                }
              : page
          ),
        };
      });
      return { previousChallenges };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["challenges"]);
    },
    onError: (error, variables, context) => {
      if (context?.previousChallenges) {
        queryClient.setQueryData(["challenges"], context.previousChallenges);
      }
    },
  });
};

// delete challenge
export const useDeleteChallengeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-challenge"],
    mutationFn: ({ challengeId }) => deleteChallenge(challengeId),
    onMutate: async ({ challengeId }) => {
      await queryClient.cancelQueries(["challenges"]);
      // Get previous user data for rollback
      const previousPosts = queryClient.getQueryData(["challenges"]);

      queryClient.setQueryData(["challenges"], (old) => {
        if (!old || !old.pages || !Array.isArray(old.pages)) return old;

        const updatedPages = old.pages.flatMap((innerPages) =>
          innerPages.map((page) => ({
            ...page,
            allChallenges: page.allChallenges.map((challenge) =>
              challenge?._id === challengeId
                ? { ...challenge, isDeleting: true }
                : challenge
            ),
          }))
        );
        return {
          ...old,
          pages: [updatedPages],
        };
      });
      return { previousPosts };
    },
    onError: (error, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["challenges"], context.previousPosts);
      }
    },
    onSuccess: (variables, context) => {
      queryClient.setQueryData(["challenges"], (old) => {
        if (!old || !old.pages) return old;
        const updatedPages = old.pages.flatMap((innerPages) =>
          innerPages.map((page) => ({
            ...page,
            allChallenges: page.allChallenges.filter(
              (challenge) => challenge._id !== variables.challengeId // Remove the challenge entirely
            ),
          }))
        );
        return {
          ...old,
          pages: [updatedPages],
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["challenges"]);
    },
  });
};
