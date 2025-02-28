"use client";
import { useEffect, useState } from "react";
import { IMAGE_FILE_SIZE_LIMIT } from "@/lib/constants";
import { Loader2, Plus } from "lucide-react";
import { useUploadPostImageMutation } from "@/hooks/mutations/useUploadPostImageMutation";
import { useToast } from "@/hooks/use-toast";
import { useGlobalUser } from "@/context/userContent";
import { usePostQuery } from "@/hooks/queries/usePostQuery";
import Image from "next/image";

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

const PostImageUpload = ({ onUploadSuccess, onUploadPending }) => {
  const { mutate: uploadPostImage, isPending } = useUploadPostImageMutation();
  const { toast } = useToast();
  const { user } = useGlobalUser();
  const userId = user?.publicMetadata?.userId;

  const [previewImage, setPreviewImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState(null);
  useEffect(() => {
    if (onUploadPending) {
      onUploadPending(isPending);
    }
  }, [isPending, onUploadPending]);

  const handleFileChange = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    if (!file) {
      showToastError("No file selected");
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      showToastError("Please select a valid image file.");
      return;
    }

    if (file.size > IMAGE_FILE_SIZE_LIMIT) {
      showToastError("File size should be less than 5MB.");
      return;
    }

    setOriginalFileName(file.name);

    uploadPostImage(
      { file, userId },
      {
        onSuccess: (data) => {
          console.log("data from postImage Upload===>", data);
          onUploadSuccess(data);
          setPreviewImage(data);
        },
        onError: (error) => {
          showToastError(error.message || "An error occurred while uploading.");
        },
      }
    );
  };

  const showToastError = (message) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-card-background text-gray-300">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary p-4 rounded-md"
        >
          {isPending ? (
            <div className="flex flex-col items-center">
              <div className="text-center flex gap-2">
                <div className="max-w-[20ch] whitespace-nowrap overflow-hidden text-ellipsis dark:text-neutral-500">
                  {originalFileName}
                </div>
                <Loader2 className="animate-spin" />
              </div>
              <p className="text-primary animate-pulse" aria-live="polite">
                Uploading ...
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center text-primary">
                <Plus />
              </div>
              <span className="mt-2 text-sm font-medium">Upload Image</span>
            </>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isPending}
        />
      </div>

      {previewImage && (
        <div className="mt-4 h-[300px] overflow-hidden relative rounded-lg">
          <div
            className="absolute inset-0 bg-cover bg-center blur-lg opacity-80"
            style={{ backgroundImage: `url(${previewImage?.secure_url})` }}
            aria-hidden="true"
          ></div>
          <div className="relative z-2 flex items-center justify-center h-full">
            <Image
              src={previewImage?.secure_url}
              alt="Uploaded"
              className="object-scale-down "
              fill
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PostImageUpload;
