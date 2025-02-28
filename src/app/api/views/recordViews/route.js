import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import { Post } from "@/models/post.model";
import { View } from "@/models/views.model";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const { contentType, postIds, userId } = await req.json();
    console.log(contentType, postIds, userId);

    // Validate required fields
    if (!contentType || !postIds || !userId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Content type, post IDs, and user ID are required.",
      });
    }

    // Validate postIds and userId
    if (!Array.isArray(postIds) || postIds.length === 0) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Post IDs must be a non-empty array.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Invalid user ID.",
      });
    }

    // Connect to the database
    await dbConnect();

    const onModel = contentType === "Post" ? Post : Challenge;
    const viewerId = new mongoose.Types.ObjectId(userId);

    // Filter out posts already viewed in the last 24 hours
    const alreadyViewedPostIds = await View.find({
      viewer: viewerId,
      target: { $in: postIds.postId },
      onModel: contentType,
      viewedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
    }).distinct("target");

    const alreadyViewedPostIdsSet = new Set(
      alreadyViewedPostIds.map((id) => id.toString())
    );

    // Determine the new posts to record views for

    const newPostIds = postIds.filter(
      (postId) =>
        !alreadyViewedPostIdsSet.has(postId.toString()) && // Exclude already viewed posts
        mongoose.Types.ObjectId.isValid(postId) // Ensure postId is valid
    );

    if (newPostIds.length === 0) {
      return createResponse({
        success: true,
        status: 200,
        message: "No new views to record. All posts already viewed.",
      });
    }

    // Start MongoDB session for transaction
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Record new views with upsert
      for (const postId of newPostIds) {
        await View.updateOne(
          { viewer: viewerId, target: postId, onModel: contentType },
          {
            $set: {
              viewer: viewerId,
              target: postId,
              onModel: contentType,
              viewedAt: new Date(),
            },
          },
          { upsert: true, session }
        );
      }

      // Increment view counts for the posts
      await onModel.updateMany(
        { _id: { $in: newPostIds } },
        { $inc: { viewCount: 1 } },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();

      return createResponse({
        success: true,
        status: 200,
        message: "Views recorded successfully.",
        data: { recordedPostIds: newPostIds },
      });
    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      console.error("Transaction error:", error);
      return createErrorResponse({
        success: false,
        status: 500,
        message: "Failed to record views due to a transaction error.",
        errors: error.message,
      });
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error recording views:", error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "An unexpected error occurred while recording views.",
      errors: error.message,
    });
  }
}
