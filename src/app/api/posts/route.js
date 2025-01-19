import { streakMilestones } from "@/lib/constants";
import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import {
  abortSession,
  commitSession,
  startSession,
} from "@/lib/utils/mongodbSession";
import { createResponse } from "@/lib/utils/response";
import Badge from "@/models/badge.model";
import { Challenge } from "@/models/challenge.model";
import { Post } from "@/models/post.model";
import { UploadedImage } from "@/models/uploadedImage.model";
import User from "@/models/user.model";

//create new post
export async function POST(req) {
  const session = await startSession();
  try {
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
      return createErrorResponse({
        success: false,
        status: 400,
        message: "user id and challenge id is required or invalid",
      });
    }
    if (!text && !link && !imageUrl) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "At least one of text, link, or image is required",
      });
    }
    await dbConnect(); // Ensure the database is connected before proceeding

    if (imagePublicId) {
      await UploadedImage.updateOne(
        { publicId: imagePublicId },
        { status: "used" },
        {
          session,
        }
      );
    }

    const userPromise = User.findById(userId).session(session);
    const challengePromise = Challenge.findById(challengeId).session(session);

    const [user, challenge] = await Promise.all([
      userPromise,
      challengePromise,
    ]);

    if (!user) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "User not found",
      });
    }
    if (!challenge) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Challenge not found",
      });
    }

    if (challenge.isCompleted) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Challenge is already completed",
      });
    }

    const newPost = new Post({
      owner: userId,
      challengeId,
      text: text || "",
      link: link || "",
      image: imageUrl || "",
      isPublic: isPublic || false,
      imagePublicId,
    });

    challenge.taskLogs.push({
      taskId: newPost._id,
      taskCompletionDate: new Date(),
    });

    challenge.tasksCompleted += 1;

    // Handle streak logic
    const now = new Date();
    // Get the last activity date of the challenge. If the challenge has no activity
    // yet, set it to null. We use this to determine if the user has maintained
    // their streak.
    const lastActiveDate = challenge.lastActivityDate
      ? new Date(challenge.lastActivityDate)
      : null;

    // Check if the last activity date is on the same day as now
    const isSameDay =
      lastActiveDate &&
      now.toDateString() === new Date(lastActiveDate).toDateString();

    const requiredInterval =
      challenge.consistencyIncentiveDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    if (!isSameDay) {
      if (
        !lastActiveDate ||
        now - new Date(lastActiveDate) <= requiredInterval
      ) {
        challenge.currentStreak += 1;
      } else {
        challenge.currentStreak = 1;
      }
    }
    challenge.lastActivityDate = now;

    //adding streak badge
    if (streakMilestones.includes(challenge.currentStreak)) {
      const badge = await Badge.findOne({
        streak: challenge.currentStreak,
      }).session(session);
      if (badge && !user.badges.includes(badge._id)) {
        user.badges.push(badge._id);
        await user.save({ session });
      }
    }

    const isTasksCompleted = challenge.tasksCompleted >= challenge.totalTasks;
    const isConsistencyMet =
      challenge.currentStreak >= challenge.consistencyIncentiveDays;

    if (isTasksCompleted && isConsistencyMet) {
      challenge.isCompleted = true;
      challenge.completionDate = new Date();
    }
    // Save challenge and post in parallel

    const [savedPost] = await Promise.all([
      newPost.save({ session }),
      challenge.save({ session }),
    ]);

    await commitSession(session);
    return createResponse({
      success: true,
      status: 200,
      message: "Post created successfully",
      data: {
        post: savedPost,
      },
    });
  } catch (error) {
    await abortSession(session);
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Error creating post",
      errors: error.message,
    });
  }
}
