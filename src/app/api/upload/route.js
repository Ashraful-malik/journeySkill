import {
  deleteFileOnCloudinary,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";
import { createResponse } from "@/lib/utils/response";
import { createErrorResponse } from "@/lib/utils/error";
import User from "@/models/user.model";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { v2 as cloudinary } from "cloudinary";
import { Post } from "@/models/post.model";

// Constants
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
// Helper function: Fetch and validate user
const findAndValidateUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// upload image
// Helper function: Handle image transformations
const getTransformations = (type) => {
  switch (type) {
    case "profile":
      return [
        { width: 300, height: 300, crop: "thumb" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ];
    case "banner":
      return [
        { width: 1600, height: 600, crop: "crop" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ];
    case "post":
      return [
        { width: 1200, height: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ];
    default:
      throw new Error(
        "Invalid type. Allowed types are 'profile', 'banner', and 'post'."
      );
  }
};

// Main handler
export async function POST(req) {
  try {
    const session = await auth();
    const userId = session?.sessionClaims?.user_Id;
    if (!userId) {
      return createErrorResponse({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    await dbConnect();
    const data = await req.formData();
    const file = data.get("file");
    const folder = data.get("folder");
    const type = data.get("type");

    // Validate request data
    if (!file || !folder || !type) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "File, folder, or type is missing.",
      });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Invalid file type Only images are allowed.",
      });
    }

    // Get image transformations based on type
    const transformations = getTransformations(type);

    // Handle different types
    let result;
    if (type === "profile" || type === "banner") {
      const user = await findAndValidateUser(userId);
      const imageField = type === "profile" ? "profileImage" : "bannerImage";

      // Delete existing image if available
      if (user[imageField]?.publicId) {
        await deleteFileOnCloudinary(user[imageField].publicId);
      }

      // Upload new image
      result = await uploadImageToCloudinary(file, folder, transformations);

      // Update user model
      user[imageField] = {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
      await user.save();
    } else if (type === "post") {
      // Check if the user already has a post
      const existingPost = await Post.findOne({ owner: userId });

      // Delete existing image if applicable
      if (existingPost?.imagePublicId) {
        await deleteFileOnCloudinary(existingPost.imagePublicId);
      }

      // Upload new image
      result = await uploadImageToCloudinary(file, folder, transformations);

      if (existingPost) {
        // Update existing post
        existingPost.image = result.secure_url;
        existingPost.imagePublicId = result.public_id;
        await existingPost.save();
      } else {
        // Create a new post
        const newPost = new Post({
          owner: userId,
          image: result.secure_url,
          imagePublicId: result.public_id,
        });
        await newPost.save();
      }
    } else {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Invalid type specified.",
      });
    }

    // Return success response
    return createResponse({
      success: true,
      status: 200,
      message: "Image uploaded successfully",
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
      errors: error.stack,
    });
  }
}
