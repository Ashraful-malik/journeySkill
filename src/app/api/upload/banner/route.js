import {
  deleteFileOnCloudinary,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";
import { createResponse } from "@/lib/utils/response";
import { createErrorResponse } from "@/lib/utils/error";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

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

    if (!file) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "File is missing",
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

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    // Delete old banner image if it exists
    if (user.bannerImage?.publicId) {
      await deleteFileOnCloudinary(user.bannerImage.publicId);
    }

    // Upload new banner image
    const result = await uploadImageToCloudinary(file, folder, [
      { width: 1600, height: 600, crop: "crop" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ]);

    // Update user document
    user.bannerImage = {
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
    await user.save();

    // Return response
    return createResponse({
      success: true,
      status: 200,
      message: "Banner image updated successfully",
      data: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message,
    });
  }
}
