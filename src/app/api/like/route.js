import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import { Like } from "@/models/like.model";
import { Post } from "@/models/post.model";
import mongoose from "mongoose";

export async function POST(req) {
  let session = null; // Declare session outside the try block
  try {
    // Extract request body
    const { targetId, targetType, userId } = await req.json();

    // Input validation
    if (!targetId || !targetType) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "targetId and targetType are required",
      });
    }
    if (!userId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User ID is required",
      });
    }

    // Connect to the database
    await dbConnect();

    // Determine the target model
    const Model = targetType === "Post" ? Post : Challenge;

    // Start a MongoDB session
    session = await mongoose.startSession();
    session.startTransaction();

    // Check for existing like
    const existingLike = await Like.findOne({
      userId,
      targetId,
      targetType,
    }).session(session);

    if (existingLike) {
      // If a like exists, remove it
      await Like.findOneAndDelete({ _id: existingLike._id }, { session });
      await Model.findByIdAndUpdate(
        targetId,
        { $inc: { likeCount: -1 } },
        { session }
      );
      // Commit the transaction
      await session.commitTransaction();
      return createResponse({
        success: true,
        status: 200,
        message: "Unliked",
      });
    } else {
      // Otherwise, create a new like
      const newLike = new Like({ userId, targetId, targetType });
      await newLike.save({ session });
      await Model.findByIdAndUpdate(
        targetId,
        { $inc: { likeCount: 1 } },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();

      return createResponse({
        success: true,
        status: 200,
        message: "Liked",
      });
    }
  } catch (error) {
    // Rollback transaction on error
    if (session) {
      await session.abortTransaction();
    }
    console.error("Error in like API:", error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Internal server error",
      errors: error.message,
    });
  } finally {
    // Ensure session is ended
    if (session) {
      session.endSession();
    }
  }
}
