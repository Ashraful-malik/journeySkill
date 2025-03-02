"use client";
import React from "react";
import { CameraIcon, ImageUp, User } from "lucide-react";
import { useUploadProfileImage } from "@/hooks/mutations/useEditProfileImageMutation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function UpdateProfileImage({ userData }) {
  // console.log(userData.image);
  const { mutate: uploadProfileImage, isPending } = useUploadProfileImage();
  const { toast } = useToast();
  const handleFileChange = (e) => {
    e.preventDefault();
    console.log(e.target.files);
    const file = e.target.files[0];
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No file selected",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size should be less than 5MB",
      });
      return;
    }
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedImageTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an image file.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", `user/${userData?._id}/profile`);
    formData.append("type", "profile");

    try {
      uploadProfileImage(
        { userId: userData?._id, formData },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Profile image updated successfully!",
            });
          },
          onError: (error) => {
            console.error("Error in form submission:", error);
            // console.log(error.response);
            toast({
              title: "Error",
              description: error.message || "An error occurred.",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      // console.log(error.response);
      toast({
        title: "Error",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };
  return (
    <>
      <div className="relative w-24 h-24">
        {/* <!-- Inner Content --> */}
        <div className="absolute inset-0 rounded-full  flex items-center justify-center">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            {/* <!-- Image --> */}
            <Image
              src={
                userData?.tempProfileImage
                  ? userData?.tempProfileImage
                  : userData?.profileImage?.imageUrl
              }
              alt="Profile image"
              className="object-cover "
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24px"
            />
          </div>
        </div>

        {/* <!-- Upload Icon --> */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 rounded-full cursor-pointer">
          {isPending ? (
            <ImageUp className="animate-bounce text-slate-200" />
          ) : (
            <CameraIcon className="text-slate-200 " />
          )}
        </div>

        {/* <!-- File Input --> */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer "
        />
      </div>
    </>
  );
}

export default UpdateProfileImage;
