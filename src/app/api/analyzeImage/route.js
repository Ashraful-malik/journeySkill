import { analyzeImage } from "@/lib/moderateImage";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";

export async function POST(req) {
  try {
    // const { imageUrl } = await req.json();
    const data = await req.formData();
    const file = data.get("file");
    console.log(file);

    const moderationResult = await analyzeImage(file);
    console.log(moderationResult);
    if (!moderationResult) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Image not found",
      });
    }
    return createResponse({
      status: 200,
      success: true,
      data: moderationResult,
    });
  } catch (error) {
    console.error("Error while analysing image:", error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message || "Internal Server Error",
      errors: error.message,
    });
  }
}
