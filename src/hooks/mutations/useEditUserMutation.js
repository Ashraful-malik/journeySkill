import { updateUser } from "@/lib/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useEditUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-user"],
    mutationFn: ({ userId, updatedData }) => updateUser(userId, updatedData),
    onMutate: async ({ userId, updatedData }) => {
      // Cancel any ongoing fetches for the user
      await queryClient.cancelQueries(["user", userId]);

      // Get the current cached user data
      const previousUser = queryClient.getQueriesData(["user", userId]);

      // Optimistically update the user data in the cache
      queryClient.setQueryData(["user", userId], (oldData) => ({
        ...updatedData,
        ...oldData,
      }));
      return { previousUser };
    },

    onError: (error, variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(
          ["user", variables.userId],
          context.previousUser
        );
      }
    },

    onSettled: (userId) => {
      // Refetch the user data after the mutation settles
      queryClient.invalidateQueries(["user", userId]);
    },
  });
};
