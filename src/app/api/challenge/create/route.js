import { POST_PER_INTERVAL } from "@/lib/constants";
import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import { Tag } from "@/models/tag.model";
import { auth } from "@clerk/nextjs/server";
import {
  createOrUpdateTags,
  calculateEndDate,
} from "@/lib/utils/utilsForChallenge";

//calculatePostsRequired
function calculatePostsRequired(durationInDays, postsPerInterval) {
  return Math.floor(durationInDays / postsPerInterval); // Example: 45 days -> 22 posts (45/2 = 22.5, rounded down to 22)
}
export async function POST(req) {
  try {
    await dbConnect();
    const { sessionClaims } = await auth();
    console.log(sessionClaims);
    const mongoUserId = sessionClaims.user_id;

    if (!mongoUserId) {
      return createErrorResponse({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    const {
      challengeName,
      challengeDescription,
      tags,
      challengeDays,
      isPublic,
    } = await req.json();

    if (
      !challengeName ||
      !challengeDescription ||
      !Array.isArray(tags) ||
      !challengeDays
    ) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "All fields are required",
      });
    }

    if (challengeDays <= 0) {
      return createErrorResponse({
        success: false,
        status: 400,
        message:
          "Days should be a positive number. Please enter a positive number.",
      });
    }
    // Calculate tasks required
    const tasksRequired = calculatePostsRequired(
      challengeDays,
      POST_PER_INTERVAL
    ); // Automatically calculated

    //calculating end date
    const endDate = await calculateEndDate(challengeDays);
    const consistencyIncentiveDays = Math.ceil(challengeDays / tasksRequired);
    try {
      const challenge = new Challenge({
        challengeOwner: mongoUserId,
        challengeName,
        description: challengeDescription,
        days: challengeDays,
        tasksRequired,
        endDate,
        consistencyIncentiveDays,
        isPublic,
      });
      const updatedTagIds = await createOrUpdateTags(tags || [], challenge);
      challenge.tags = updatedTagIds;
      const saveChallenge = await challenge.save();

      return createResponse({
        data: saveChallenge,
        message: "success",
        status: 200,
      });
    } catch (error) {
      console.log("challenge creation error==>", error);
      return createErrorResponse({
        success: false,
        status: 400,
        message: error.message || "Failed to create challenge Please try again",
      });
    }
  } catch (error) {
    console.log("error==>", error);

    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}
