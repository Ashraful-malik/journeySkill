import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import { Like } from "@/models/like.model";
import { Post } from "@/models/post.model";

// Get all likes
export async function POST(req) {
  try {
    // target id is post or challenge id
    const { targetId, targetType } = await req.json();
    if (!targetId && !targetType) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "targetId and targetType are required",
      });
    }
    await dbConnect();
    const Model = targetType === "Post" ? Post : Challenge;
    const target = await Model.findById(targetId);
    if (!target) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: `target ${targetType.toLowerCase()} with id ${targetId} not found`,
      });
    }

    const countLike = await Like.countDocuments({ targetId, targetType });

    return createResponse({
      success: true,
      status: 200,
      message: "success",
      data: { totalLikeCount: countLike },
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
