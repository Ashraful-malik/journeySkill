// update profile image
import { updateBannerImage, updateUserProfile } from "@/lib/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// update profile image
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-profile-image"],
    mutationFn: ({ formData }) => updateUserProfile(formData),
    onMutate: async ({ userId, formData }) => {
      // Cancel ongoing queries for this user
      await queryClient.cancelQueries(["user", userId]);

      // Get previous user data for rollback
      const previousUserData = queryClient.getQueryData(["user", userId]);
      // Optimistically update the cache
      const file = formData.get("file"); // Retrieve the file from FormData
      queryClient.setQueryData(["user", userId], (oldData) => ({
        ...oldData,
        tempProfileImage: URL.createObjectURL(file), // Temporary image preview
      }));

      return { previousUserData };
    },
    onSuccess: (data, variables) => {
      const { userId } = variables;
      // simply refetch to sync with the database
      queryClient.invalidateQueries(["user", userId]);
    },
    onError: (error, variables, context) => {
      const { userId } = variables; // Ensure userId is passed here
      console.error("Error during upload:", error);

      // Rollback to the previous user data
      queryClient.setQueryData(["user", userId], context.previousUserData);
    },
    onSettled: (data, error, variables) => {
      const { userId } = variables; // Ensure userId is passed here
      // Refetch the user data
      queryClient.invalidateQueries(["user", userId]);
    },
  });
};

// update banner image
export const useUploadBannerImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-banner-image"],
    mutationFn: ({ formData }) => updateBannerImage(formData),
    onMutate: async ({ userId, formData }) => {
      await queryClient.cancelQueries(["user", userId]);
      // Get previous user data for rollback
      const previousUserData = queryClient.getQueryData(["user", userId]);
      const file = formData.get("file");
      queryClient.setQueryData(["user", userId], (oldData) => ({
        ...oldData,
        tempBannerImage: URL.createObjectURL(file),
      }));

      return { previousUserData };
    },
    onSuccess: (data, variables) => {
      const { userId } = variables;
      // simply refetch to sync with the database
      queryClient.invalidateQueries(["user", userId]);
    },
    onError: (error, variables, context) => {
      console.error("Error during upload:", error);
      const { userId } = variables;
      // Rollback to the previous user data
      queryClient.setQueryData(["user", userId], context.previousUserData);
    },
    onSettled: (data, error, variables) => {
      const { userId } = variables;
      queryClient.invalidateQueries(["user", userId]);
    },
  });
};
