"use client";
import { useAuth } from "@clerk/nextjs";
import { useRef, useState } from "react";
import axios from "axios"; // Import axios
import { IMAGE_FILE_SIZE_LIMIT } from "@/lib/constants";
import { CircleX, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

const PostImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [progress, setProgress] = useState(0); // Track progress
  const [error, setError] = useState(null);
  const progressRef = useRef(0);
  const { userId } = useAuth();
  const handleFileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setOriginalFile(file);
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (file.size > IMAGE_FILE_SIZE_LIMIT) {
      setError("file size cannot be larger than 5MB");
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
      setError("Please select an image file.");
      return;
    }

    setLoading(true);
    setProgress(0); // Reset progress
    progressRef.current = 0; // Reset ref

    const folder = `user/${userId}/profile`;
    const postType = "profile";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder); // 'profile', 'banner', or 'post'
    formData.append("type", postType);

    try {
      const response = await axios.post("/api/image-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          console.log("Upload Progress:", progressEvent);
          console.log(progressEvent.loaded, progressEvent.total);

          console.log(
            "percentage converter",
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
          if (progressEvent.lengthComputable) {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            console.log("Percentage:", percentage);

            progressRef.current = percentage;
            setProgress(percentage); // Update progress state
          }
        },
      });
      console.log(response);

      // Handle the response after successful upload
      const data = response.data;
      if (data.success) {
        setImageUrl(data.data.secure_url);
        setImagePublicId(data.data.public_id);
        alert(`${folder} image uploaded successfully!`);
      } else {
        alert(data.message || "Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    } finally {
      setLoading(false);
    }
  };

  // delete image
  const deleteImage = async () => {
    try {
      console.log("image deleted ");
      // await deleteFileOnCloudinary(imagePublicId);
    } catch (error) {
      setError(error.message || "Error while deleting image");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center border-2 border-dashed  rounded-lg p-6 bg-card-background text-gray-300">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary p-4 rounded-md"
        >
          {loading ? (
            <div className="flex flex-col items-center">
              {/* Uploading Text and Loader */}
              <div className="text-center flex gap-2">
                <div className="max-w-[20ch] whitespace-nowrap overflow-hidden text-ellipsis dark:text-neutral-500 ">
                  {originalFile?.name}
                </div>
                <Loader2 className="animate-spin" />
              </div>

              {/* Animated */}
              <div className="text-primary" aria-live="polite">
                <p className="animate-pulse">Uploading ...</p>
              </div>
            </div>
          ) : (
            <>
              {error ? (
                <>
                  <div className="flex items-center justify-center ">
                    <CircleX color="#ef4444 " />
                  </div>
                  <span className="mt-2 text-sm font-medium text-red-500">
                    {error}
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center text-primary">
                    <Plus />
                  </div>
                  <span className="mt-2 text-sm font-medium">upload image</span>
                </>
              )}
            </>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          // accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {/* preview image */}
      {imageUrl && (
        <div className="mt-4 h-[300px] overflow-hidden relative rounded-lg">
          <div
            class="absolute inset-0 bg-cover bg-center blur-lg opacity-80 "
            draggable="false"
            style={{
              backgroundImage: `url(${imageUrl})`,
            }}
            aria-hidden="true"
          ></div>

          <div className="relative z-2 flex items-center justify-center h-full ">
            {/* delete image action button */}
            <div className="absolute top-2 right-2 ">
              <Button
                size="icon"
                variant="destructive"
                className="border-2 border-white/40"
                onClick={deleteImage}
              >
                <Trash2 />
              </Button>
            </div>
            <img
              src={imageUrl}
              alt="Uploaded"
              className="object-scale-down w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PostImageUpload;
// <form onSubmit={handleSubmit}>
//   <p className="text-red-500">{error}</p>
//   <input type="file" accept="image/*" onChange={handleFileChange} />
//   {progress > 0 && <p>Uploading... {progress}%</p>}
//   {imageUrl && (
//     <div>
//       <h3>Uploaded Image:</h3>
//       <img src={imageUrl} alt="Uploaded" width="300" />
//     </div>
//   )}
// </form>
