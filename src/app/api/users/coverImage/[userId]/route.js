import { deleteFileOnCloudinary } from "@/lib/cloudinary";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import User from "@/models/user.model";

export async function POST(req, { params }) {
  try {
    const { userId } = await params;
    const { imageUrl, imagePubicId } = await req.json();
    if (!userId) {
      return createErrorResponse({
        status: 400,
        success: false,
        message: "user id is required or not valid",
      });
    }
    if (!imageUrl && !imagePubicId) {
      return createErrorResponse({
        status: 400,
        success: false,
        message: "image url or image public id id required",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return createErrorResponse({
        status: 404,
        message: "user not found",
      });
    }
    if (user.profileImage.publicId) {
      await deleteFileOnCloudinary(user.profileImage.publicId);
    }
    user.bannerImage.ImageUrl = imageUrl;
    user.bannerImage.publicId = imagePubicId;
    await user.save();
    return createResponse({
      success: true,
      status: 200,
      message: "cover image updated successfully",
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      status: 500,
      message: "Internal server error",
      errors: error.message,
    });
  }
}
