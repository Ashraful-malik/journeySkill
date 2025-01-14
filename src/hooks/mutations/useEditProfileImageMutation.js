// update profile image
import { updateUserProfile } from "@/lib/api/user";
import { useMutation } from "@tanstack/react-query";

const useUpdateProfileImage = () => {
  return useMutation({
    mutationKey: ["update-profile-image"],
    mutationFn: (data) => updateUserProfile(data),
  });
};
