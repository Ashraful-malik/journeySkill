import {
  deleteFileOnCloudinary,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";
import { createResponse } from "@/lib/utils/response";
import { createErrorResponse } from "@/lib/utils/error";
import User from "@/models/user.model";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";

// upload image
export async function POST(req) {
  const { userId, user } = auth();
  console.log("user", user);
  try {
    await dbConnect();
    const data = await req.formData();
    const file = data.get("file");
    const folder = data.get("folder");
    const type = data.get("type");

    if (!file || !folder) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "File or folder is missing",
      });
    }

    // Validate file types
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedImageTypes.includes(file.type)) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Invalid file type. Only images are allowed.",
      });
    }

    // Determine transformations based on the folder (e.g., profile, banner, post)
    let transformations = [];
    if (type === "profile") {
      // if already have profile image delete it first
      // const user = await User.findOne({ clerkId: userId });
      // console.log(user);
      // if (!user) {
      //   return createErrorResponse({
      //     success: false,
      //     status: 400,
      //     message: "User not found",
      //   });
      // }
      // if (user.profileImage) {
      //   await cloudinary.uploader.destroy(user.profileImage.publicId);
      // }

      // Profile image: Resize to square (for avatars)
      transformations = [
        { width: 300, height: 300, crop: "thumb" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ];
    } else if (type === "banner") {
      // if already have banner image delete it first
      // const user = await User.findOne({ clerkId: userId });
      // if (!user) {
      //   return createErrorResponse({
      //     success: false,
      //     status: 400,
      //     message: "User not found",
      //   });
      // }
      // if (user.bannerImage) {
      //   await cloudinary.uploader.destroy(user.bannerImage.publicId);

      // Banner image: Resize for wider aspect ratio
      transformations = [
        { width: 1600, height: 600, crop: "crop" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ];
    } else if (type === "post") {
      // Post image: Resize to fit post feed
      transformations = [
        { width: 1200, height: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ];
    } else {
      return createErrorResponse({
        success: false,
        status: 400,
        message:
          "Invalid post type. Only 'profile', 'banner', and 'post' are allowed.",
      });
    }

    // Upload the image to Cloudinary with the selected transformations
    const result = await uploadImageToCloudinary(file, folder, transformations);
    console.log("result====>", result);
    // Return the response with the image URL
    return createResponse({
      success: true,
      status: 200,
      message: `${folder} image uploaded successfully`,
      data: {
        secure_url: result.secure_url, // Cloudinary URL for the uploaded image
        public_id: result.public_id, // Public ID for possible future operations
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

// delete profile image from cloudinary and database
export async function DELETE() {
  try {
    const { imagePublicId, userId } = await req.json();
    const user = await User.findById(userId);
    if (!user) {
      return createErrorResponse({
        status: 404,
        message: "user not found",
      });
    }
    if (user.profileImage.publicId) {
      await deleteFileOnCloudinary(imagePublicId);
    }
    user.profileImage.ImageUrl = null;
    user.profileImage.publicId = null;
    await user.save();
    return createResponse({
      success: true,
      status: 200,
      message: "Image deleted",
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Internal server error",
      errors: error.message,
    });
  }
}
