import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Like } from "@/models/like.model";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const postIds = searchParams.getAll("postIds");
    const userId = searchParams.get("userId");
    const targetType = searchParams.get("targetType");

    // Validation
    if (!postIds?.length) {
      return createErrorResponse({
        status: 400,
        message: "postIds must be a non-empty array",
      });
    }

    await dbConnect();
    // convert an object id
    const objectIds = postIds?.map((id) => new mongoose.Types.ObjectId(id));
    console.log(objectIds);
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;
    if (!userObjectId) {
      return createErrorResponse({
        status: 400,
        message: "Invalid or missing userId",
      });
    }
    console.log("userObjectId--->", userObjectId);

    const likesData = await Like.aggregate([
      {
        $match: {
          targetId: { $in: objectIds },
          targetType: targetType,
        },
      },
      {
        $group: {
          _id: "$targetId",
          totalLikes: { $sum: 1 },
          userLiked: {
            $sum: { $cond: [{ $eq: ["$userId", userObjectId] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          postId: "$_id",
          totalLikes: 1,
          userLiked: 1,
          isLiked: { $gt: ["$userLiked", 0] },
        },
      },
    ]);

    // convert to map format
    const likeMap = likesData.reduce((acc, curr) => {
      acc[curr.postId] = {
        count: curr.totalLikes,
        isLiked: curr.isLiked,
        userLiked: curr.userLiked,
      };
      return acc;
    }, {});
    return createResponse({ data: likeMap, message: "success", status: 200 });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
