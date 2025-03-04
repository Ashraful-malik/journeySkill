import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Follower } from "@/models/follower.model";
import { Following } from "@/models/following.model";
import User from "@/models/user.model";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  // Start a MongoDB session
  let session = null;
  try {
    // Extract userId from params and followerId from request body
    const { userId } = await params; // ID of the user to be followed
    const { followerId } = await req.json(); // ID of the user who wants to follow

    // Validate input
    if (!userId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User ID is required or invalid",
      });
    }
    if (!followerId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Follower ID is required or invalid",
      });
    }
    if (userId === followerId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "You cannot follow yourself",
      });
    }

    // Connect to the database
    await dbConnect();

    // Start a MongoDB session
    session = await mongoose.startSession();
    session.startTransaction();

    // Check if the user is already following
    const existingFollower = await Follower.findOne(
      { user: userId, follower: followerId },
      null,
      { session }
    );
    if (existingFollower) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "You are already following this user",
      });
    }

    // Create Follower and Following records
    await Follower.create([{ user: userId, follower: followerId }], {
      session,
    });
    await Following.create([{ user: followerId, following: userId }], {
      session,
    });

    // Update follower and following counts in the User model
    await User.findByIdAndUpdate(
      followerId,
      { $inc: { followingCount: 1 } },
      { session }
    );
    await User.findByIdAndUpdate(
      userId,
      { $inc: { followerCount: 1 } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();

    // Return a success response
    return createResponse({
      success: true,
      status: 200,
      message: "You are now following this user",
    });
  } catch (error) {
    // Abort transaction if there's an error
    if (session) {
      await session.abortTransaction();
    }

    return createErrorResponse({
      success: false,
      status: 500,
      message: "Error following user",
      errors: error.message,
    });
  } finally {
    // Ensure the session is ended
    if (session) {
      session.endSession();
    }
  }
}

// unfollow
export async function DELETE(req, { params }) {
  let session = null; // Declare session outside the try block
  try {
    // Extract userId and followerId
    const { userId } = await params; // ID of the user being unfollowed
    const { followerId } = await req.json(); // ID of the user who wants to unfollow

    // Validate inputs
    if (!userId || !followerId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User ID and Follower ID are required",
      });
    }

    // Connect to the database
    await dbConnect();
    // Start MongoDB session and transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // Check if the follower relationship exists
    const existingFollower = await Follower.findOne(
      { user: userId, follower: followerId },
      null,
      { session } // Ensure query is part of the transaction
    );

    if (!existingFollower) {
      await session.abortTransaction(); // Abort transaction for invalid operation
      return createErrorResponse({
        success: false,
        status: 400,
        message: "You are not following this user",
      });
    }

    // Delete Follower and Following records
    await Follower.findOneAndDelete(
      { user: userId, follower: followerId },
      { session }
    );
    await Following.findOneAndDelete(
      { user: followerId, following: userId },
      { session }
    );

    // Decrement follower and following counts in the User model
    await User.findByIdAndUpdate(
      followerId,
      { $inc: { followingCount: -1 } },
      { session }
    );
    await User.findByIdAndUpdate(
      userId,
      { $inc: { followerCount: -1 } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();

    // Return success response
    return createResponse({
      success: true,
      status: 200,
      message: "You are no longer following this user",
    });
  } catch (error) {
    // Rollback transaction on error
    if (session) {
      await session.abortTransaction();
    }

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
