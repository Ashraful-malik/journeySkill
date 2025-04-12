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

// create challenge
export async function POST(req) {
  try {
    await dbConnect();
    const session = await auth();
    const userId = await session?.sessionClaims?.user_Id;
    if (!userId) {
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
      days,
      isPublic,
      banner,
    } = await req.json();

    console.log(
      challengeName,
      challengeDescription,
      tags,
      days,
      isPublic,
      banner
    );

    if (
      !challengeName ||
      !challengeDescription ||
      !Array.isArray(tags) ||
      !days
    ) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "All fields are required",
      });
    }

    if (days <= 0) {
      return createErrorResponse({
        success: false,
        status: 400,
        message:
          "Days should be a positive number. Please enter a positive number.",
      });
    }
    // Calculate tasks required
    const tasksRequired = calculatePostsRequired(days, POST_PER_INTERVAL); // Automatically calculated

    //calculating end date
    const endDate = await calculateEndDate(days);
    // Consistency incentive is the number of days user should maintain consistency in completing the task
    // It is calculated by dividing the total number of days in the challenge by the number of tasks required
    // For example, if the challenge is 30 days and 15 tasks are required, then the consistency incentive is 2 days
    // This means that the user should complete at least 1 task every 2 days to maintain consistency
    const consistencyIncentiveDays = Math.ceil(days / tasksRequired);
    try {
      const challenge = new Challenge({
        challengeOwner: userId,
        challengeName,
        description: challengeDescription,
        days: days,
        tasksRequired,
        endDate,
        consistencyIncentiveDays,
        isPublic,
        banner: {
          imageUrl: banner?.imageUrl || "",
          ImagePublicId: banner?.ImagePublicId || "", // make sure to match your schema key
        },
      });
      const updatedTagIds = await createOrUpdateTags(tags || [], challenge);
      challenge.tags = updatedTagIds;
      const saveChallenge = await challenge.save();
      console.log(saveChallenge);

      return createResponse({
        data: saveChallenge,
        message: "success",
        status: 200,
      });
    } catch (error) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: error.message || "Failed to create challenge Please try again",
      });
    }
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}
