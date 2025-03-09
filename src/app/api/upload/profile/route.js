import {
  deleteFileOnCloudinary,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";
import { createResponse } from "@/lib/utils/response";
import { createErrorResponse } from "@/lib/utils/error";
import User from "@/models/user.model";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";

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

    if (!file || !folder) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "File or folder is missing",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    // Delete old profile image
    if (user.profileImage?.publicId) {
      await deleteFileOnCloudinary(user.profileImage.publicId);
    }

    // Upload new profile image
    const result = await uploadImageToCloudinary(file, folder, [
      { width: 300, height: 300, crop: "thumb" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ]);

    // Update user's profile image
    user.profileImage = {
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
    await user.save();

    return createResponse({
      success: true,
      status: 200,
      message: "Profile image updated successfully",
      data: { imageUrl: result.secure_url },
    });
  } catch (error) {
    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message,
    });
  }
}
