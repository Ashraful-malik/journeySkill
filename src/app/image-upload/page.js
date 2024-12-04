"use client";
import { useAuth } from "@clerk/nextjs";
import { useRef, useState } from "react";
import axios, { all } from "axios"; // Import axios
import { IMAGE_FILE_SIZE_LIMIT } from "@/lib/constants";

const ImageUploadForm = () => {
  const [loading, setLoading] = useState(false);
  const [publicId, setPublicId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [progress, setProgress] = useState(0); // Track progress
  const [error, setError] = useState(null);
  const progressRef = useRef(0);

  const { userId } = useAuth();

  const handleFileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
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
        setPublicId(data.data.public_id);
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

  const handleSubmit = async (e) => {};

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-red-500">{error}</p>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {progress > 0 && <p>Uploading... {progress}%</p>}

      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" width="300" />
        </div>
      )}
    </form>
  );
};

export default ImageUploadForm;
