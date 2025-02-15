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
  await dbConnect(); // Ensure database connection

  const session = await mongoose.startSession(); // Create a new MongoDB session
  let retryCount = 0;
  const MAX_RETRIES = 3;
  let newPost; // Declare newPost outside the transaction block

  while (retryCount < MAX_RETRIES) {
    try {
      await session.withTransaction(async () => {
        const {
          userId,
          challengeId,
          text,
          link,
          imageUrl,
          imagePublicId,
          isPublic,
        } = await req.json();

        if (!userId || !challengeId) {
          throw new Error("User ID and Challenge ID are required.");
        }
        if (!text && !link && !imageUrl) {
          throw new Error("At least one of text, link, or image is required.");
        }

        // Fetch user and challenge inside the transaction
        const user = await User.findById(userId).session(session);
        const challenge = await Challenge.findById(challengeId).session(
          session
        );

        if (!user) throw new Error("User not found.");
        if (!challenge) throw new Error("Challenge not found.");
        if (challenge.isCompleted)
          throw new Error("Challenge is already completed.");

        // Update image status if needed
        if (imagePublicId) {
          await UploadedImage.updateOne(
            { publicId: imagePublicId },
            { status: "used" },
            { session }
          );
        }

        // Create new post
        newPost = new Post({
          // Assign to the outer-scoped variable
          owner: userId,
          challengeId,
          text: text || "",
          link: link || "",
          image: imageUrl || "",
          isPublic: isPublic || false,
          imagePublicId,
        });

        // Update challenge progress
        challenge.taskLogs.push({
          taskId: newPost._id,
          taskCompletionDate: new Date(),
        });
        challenge.tasksCompleted += 1;

        // Handle streak logic
        const now = new Date();
        const lastActiveDate = challenge.lastActivityDate
          ? new Date(challenge.lastActivityDate)
          : null;
        const isSameDay =
          lastActiveDate &&
          now.toDateString() === lastActiveDate.toDateString();
        const requiredInterval =
          challenge.consistencyIncentiveDays * 24 * 60 * 60 * 1000;

        if (!isSameDay) {
          challenge.currentStreak =
            lastActiveDate && now - lastActiveDate <= requiredInterval
              ? challenge.currentStreak + 1
              : 1;
        }
        challenge.lastActivityDate = now;

        // Add badge if milestone is reached
        if (streakMilestones.includes(challenge.currentStreak)) {
          const badge = await Badge.findOne({
            streak: challenge.currentStreak,
          }).session(session);
          if (badge && !user.badges.includes(badge._id)) {
            user.badges.push(badge._id);
            await user.save({ session });
          }
        }

        // Check if challenge is completed
        if (
          challenge.tasksCompleted >= challenge.totalTasks &&
          challenge.currentStreak >= challenge.consistencyIncentiveDays
        ) {
          challenge.isCompleted = true;
          challenge.completionDate = new Date();
        }

        // Save post & challenge inside transaction
        await Promise.all([
          newPost.save({ session }),
          challenge.save({ session }),
        ]);
      });

      // If the transaction succeeds, break the retry loop
      break;
    } catch (error) {
      retryCount++;
      if (retryCount === MAX_RETRIES) {
        console.error("Transaction failed after retries:", error);
        return createErrorResponse({
          success: false,
          status: 500,
          message: error.message || "Error creating post",
        });
      }
      console.warn(`Retrying transaction (${retryCount}/${MAX_RETRIES})...`);
    } finally {
      session.endSession(); // Ensure session is closed
    }
  }

  // Now newPost is accessible here
  return createResponse({
    success: true,
    status: 200,
    message: "Post created successfully",
    data: { post: newPost },
  });
}
