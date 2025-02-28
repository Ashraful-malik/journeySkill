import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Comment } from "@/models/comment.model";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const targetType = searchParams.get("targetType"); // "post" or "challenge"
    const postIds = searchParams.get("postIds");
    console.log(targetType, postIds);
    if (!targetType || !["Post", "Challenge"].includes(targetType)) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Invalid targetType. Must be 'Post' or 'Challenge'",
      });
    }

    if (!postIds) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "postIds query parameter is required",
      });
    }

    let parsedEntityIds;
    try {
      parsedEntityIds = JSON.parse(postIds);
    } catch (error) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "postIds must be a valid JSON array",
      });
    }

    if (!Array.isArray(parsedEntityIds) || parsedEntityIds.length === 0) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "postIds must be a non-empty JSON array",
      });
    }

    // Validate each ID
    const invalidIds = parsedEntityIds.filter(
      (id) => !mongoose.isValidObjectId(id)
    );
    if (invalidIds.length > 0) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: `Invalid entity IDs: ${invalidIds.join(", ")}`,
      });
    }

    // Connect to the database
    await dbConnect();

    const commentCounts = await Comment.aggregate([
      {
        $match: {
          [targetType.toLowerCase()]: {
            $in: parsedEntityIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
      { $group: { _id: `$${targetType.toLowerCase()}`, count: { $sum: 1 } } },
    ]);

    // Convert result into a key-value map { entityId: count }
    const countsMap = {};
    commentCounts.forEach(({ _id, count }) => {
      countsMap[_id.toString()] = count;
    });
    console.log(countsMap);

    return createResponse({
      success: true,
      data: countsMap,
      status: 200,
      message: "success",
    });
  } catch (error) {
    console.error("Error in GET /api/comments/count:", error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Internal server error",
      errors: error.message || "Internal server error",
    });
  }
}
