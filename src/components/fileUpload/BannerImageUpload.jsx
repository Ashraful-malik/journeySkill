"use client";
import { useUploadBannerImage } from "@/hooks/mutations/useEditProfileImageMutation";
import { useToast } from "@/hooks/use-toast";
import { gradientStyle } from "@/lib/utils/randomGradientGenerator";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { Camera, Upload } from "lucide-react";
import Image from "next/image";

function BannerImageUpload({ userData }) {
  const { mutate: uploadBannerImage, isPending } = useUploadBannerImage();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const handleFileChange = (e) => {
    e.preventDefault();
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
    formData.append("folder", `users/banner_image/${userData?._id}/banner`);

    try {
      uploadBannerImage(
        { userId: userData?._id, formData },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Profile image updated successfully!",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message || "An error occurred.",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div className="relative">
      {/* banner edit overlays button */}
      <div className=" absolute top-0 right-0 bg-black/30 w-full h-full rounded-lg"></div>

      {/* banner edit button */}
      <div className="z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          size="sm"
          arial-label="Change Banner"
          htmlFor="upload-banner-image"
          onClick={handleButtonClick} // Bind the button click to file input trigger
        >
          {isPending ? (
            <span className="flex border px-2 py-1 rounded bg-black/30 animate-bounce shadow-md">
              <Upload className="mr-2" /> uploading...
            </span>
          ) : (
            <span className="flex border px-2 py-1 rounded bg-black/30 ">
              <Camera className="mr-2" /> Change Banner
            </span>
          )}
          <input
            type="file"
            id="upload-banner-image"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Button>
      </div>

      {userData?.bannerImage ? (
        <div className="relative w-full h-[150px] rounded-lg overflow-hidden">
          <Image
            src={
              userData?.tempBannerImage
                ? userData?.tempBannerImage
                : userData?.bannerImage?.imageUrl
            }
            alt="banner image"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      ) : (
        <div
          className={`w-full h-[150px] rounded-lg `}
          style={gradientStyle}
        ></div>
      )}
    </div>
  );
}

export default BannerImageUpload;
