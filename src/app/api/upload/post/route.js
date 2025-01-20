import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { createResponse } from "@/lib/utils/response";
import { createErrorResponse } from "@/lib/utils/error";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { UploadedImage } from "@/models/uploadedImage.model";

// upload post image
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

    if (!file) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "File is missing",
      });
    }

    // Upload new post image
    const result = await uploadImageToCloudinary(file, "posts", [
      { width: 1200, height: 800, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ]);

    // Save to UploadedImage schema
    const uploadedImage = new UploadedImage({
      userId,
      publicId: result.public_id,
      imageUrl: result.secure_url,
      status: "temporary",
    });
    await uploadedImage.save();

    return createResponse({
      success: true,
      status: 200,
      message: "image uploaded successfully",
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error("Error in post image upload:", error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message,
    });
  }
}
