import { streakMilestones } from "@/lib/constants";
import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import Badge from "@/models/badge.model";
import { Challenge } from "@/models/challenge.model";
import { Post } from "@/models/post.model";
import { UploadedImage } from "@/models/uploadedImage.model";
import User from "@/models/user.model";
import mongoose from "mongoose";

export async function POST(req) {
  await dbConnect();

  const { userId, challengeId, text, link, imageUrl, imagePublicId, isPublic } =
    await req.json();

  if (!userId || !challengeId) {
    return createErrorResponse({
      success: false,
      status: 400,
      message: "User ID and Challenge ID are required.",
    });
  }

  if (!text && !link && !imageUrl) {
    return createErrorResponse({
      success: false,
      status: 400,
      message: "At least one of text, link, or image is required.",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return createErrorResponse({
      success: false,
      status: 404,
      message: "User not found.",
    });
  }

  const MAX_RETRIES = 3;
  let retryCount = 0;
  let newPost;

  while (retryCount < MAX_RETRIES) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const challenge = await Challenge.findById(challengeId).session(
          session
        );
        if (!challenge) {
          throw new Error("Challenge not found.");
        }

        if (challenge.endDate < new Date() || challenge.isCompleted) {
          throw new Error("Challenge has ended. You cannot create a post.");
        }

        if (imagePublicId) {
          await UploadedImage.updateOne(
            { publicId: imagePublicId },
            { status: "used" },
            { session }
          );
        }

        newPost = new Post({
          owner: userId,
          challengeId,
          text: text || "",
          link: link || "",
          image: imageUrl || "",
          isPublic: isPublic || false,
          imagePublicId,
        });

        const now = new Date();

        const lastActiveDate = challenge.lastActivityDate
          ? new Date(challenge.lastActivityDate)
          : null;

        const isSameDay = lastActiveDate
          ? now.toDateString() === lastActiveDate.toDateString()
          : false;

        const requiredInterval =
          challenge.consistencyIncentiveDays * 24 * 60 * 60 * 1000;

        // **Only count ONE post per day towards the challenge progress**
        let isTaskCounted = challenge.tasksCompleted === 0 || !isSameDay;

        if (isTaskCounted) {
          if (lastActiveDate && now - lastActiveDate <= requiredInterval) {
            challenge.currentStreak += 1; // Increase streak if within interval
          } else {
            challenge.currentStreak = 1; // Reset streak if too much time has passed
          }
        }
        challenge.lastActivityDate = now;

        // Completion Check
        const meetsTaskRequirement =
          challenge.tasksCompleted >= challenge.tasksRequired;

        const meetsStreakRequirement =
          challenge.consistencyIncentiveDays <= 1 ||
          challenge.currentStreak >= challenge.consistencyIncentiveDays;

        if (meetsTaskRequirement && meetsStreakRequirement) {
          challenge.isCompleted = true;
          challenge.completionDate = now;
        }

        // Update challenge efficiently
        await Challenge.updateOne(
          { _id: challenge._id },
          {
            $push: {
              taskLogs: { taskId: newPost._id, taskCompletionDate: now },
            },
            $set: {
              currentStreak: challenge.currentStreak,
              isCompleted: challenge.isCompleted,
              completionDate: challenge.completionDate,
              lastActivityDate: now,
            },
            $inc: {
              tasksCompleted: isTaskCounted ? 1 : 0,
            },
          },
          { session }
        );

        await newPost.save({ session });
      });

      session.endSession(); // Close session after successful transaction
      break; // Exit retry loop
    } catch (error) {
      session.endSession(); // Ensure session is closed before retrying

      if (
        error.name === "TransientTransactionError" ||
        error.message.includes("WriteConflict")
      ) {
        retryCount++;
        console.warn(
          `Retrying transaction (${retryCount}/${MAX_RETRIES})...`,
          error
        );
        if (retryCount === MAX_RETRIES) {
          return createErrorResponse({
            success: false,
            status: 500,
            message: "Transaction failed after multiple retries.",
          });
        }
      } else {
        return createErrorResponse({
          success: false,
          status: 500,
          message: error.message || "Error creating post.",
        });
      }
    }
  }

  return createResponse({
    success: true,
    status: 201,
    message: "Post created successfully.",
    data: { post: newPost },
  });
}
