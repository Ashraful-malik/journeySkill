import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { createResponse } from "@/lib/utils/response";
import { createErrorResponse } from "@/lib/utils/error";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(request) {
  const userId = auth();
  if (!userId) {
    return createResponse({
      success: false,
      status: 401,
      message: "Unauthorized",
    });
  }
  try {
    const formDate = await request.formData();
    const file = formDate.get("file");
    if (!file) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "File is required",
      });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "journeySkill-cloudinaryUploads",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    return createResponse({
      data: {
        public_id: result.public_id,
      },
      message: "success",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}
