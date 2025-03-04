import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { View } from "@/models/views.model";
import dbConnect from "@/lib/dbConnect";
import { Post } from "@/models/post.model";
import { Challenge } from "@/models/challenge.model";
import mongoose from "mongoose";

// get all  views count
export async function POST(req) {
  try {
    await dbConnect();
    const { contentType, postIds } = await req.json();
    // postId here is the id of the challenge or post for which we want to record a view.

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Post IDs are required and must be an array",
      });
    }

    if (!contentType || !["Post", "Challenge"].includes(contentType)) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Invalid or missing content type",
      });
    }
    // Map content types to corresponding models
    const modelMap = {
      Post: Post,
      Challenge: Challenge,
    };
    const Model = modelMap[contentType];
    // Fetch all view counts for the provided IDs
    const views = await Model.find({ _id: { $in: postIds } }).select(
      "_id viewCount"
    );
    // Create a map of postId -> viewCount
    const viewsMap = postIds.reduce((acc, id) => {
      const view = views.find((v) => v._id.toString() === id);
      acc[id] = view?.viewCount || 0; // Default to 0 if not found
      return acc;
    }, {});

    return createResponse({
      success: true,
      status: 200,
      message: "Views fetched successfully",
      data: viewsMap,
    });
  } catch (error) {
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Error getting user profile",
      errors: error.message,
    });
  }
}
