import { deleteFileOnCloudinary } from "@/lib/cloudinary";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { UploadedImage } from "@/models/uploadedImage.model";

const BATCH_SIZE = 100;

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }
    let processedCount = 0;

    while (true) {
      const orphanedImages = await UploadedImage.find({ status: "pending" })
        .limit(BATCH_SIZE)
        .exec();

      if (orphanedImages.length === 0) break;

      await Promise.all(
        orphanedImages.map(async (image) => {
          try {
            await deleteFileOnCloudinary(image.publicId);
            await image.remove();
          } catch (error) {
            console.error(`Failed to clean up image: ${image.publicId}`, error);
            const errorMessage = error?.message || "Unknown error occurred";
            await UploadedImage.updateOne(
              { _id: image._id },
              { $set: { status: "error", errorMessage: errorMessage } }
            );
          }
        })
      );

      processedCount += orphanedImages.length;
    }

    // Retry logic for "error" images
    const erroredImages = await UploadedImage.find({ status: "error" })
      .limit(BATCH_SIZE)
      .exec();

    for (const image of erroredImages) {
      try {
        await deleteFileOnCloudinary(image.publicId);
        await image.remove(); // Delete the document if successful
        console.log(
          `Successfully retried deletion for image: ${image.publicId}`
        );
      } catch (retryError) {
        console.error(`Retry failed for image: ${image.publicId}`, retryError);
        // Optionally update errorMessage for tracking
        await UploadedImage.updateOne(
          { _id: image._id },
          { $set: { errorMessage: retryError?.message || "Retry failed" } }
        );
      }
    }
    return createResponse({
      status: 200,
      success: true,
      message: `Cleaned up ${processedCount} orphaned images and retried ${erroredImages.length} errored images.`,
    });
  } catch (error) {
    console.error("Cleanup failed:", error);
    return createErrorResponse(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
