import { POST_PER_INTERVAL } from "@/lib/constants";
import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import { Tag } from "@/models/tag.model";

const createOrUpdateTags = async (tags, challenge) => {
  if (Array.isArray(tags)) {
    const TagIds = [];

    for (const tag of tags) {
      if (!tag.trim()) {
        throw new ApiError(400, "Tag tag cannot be empty.");
      }

      let hashtag = await Tag.findOne({ tag: tag.toLowerCase().trim() });

      if (!hashtag) {
        const saveTag = new Tag({ tag: tag.toLowerCase().trim() });
        await saveTag.save();
      }
      // Ensure the Tag is linked to the challenge
      if (hashtag.challenge.length === 0) {
        hashtag.challenge.push(challenge._id);
        await hashtag.save();
      }

      TagIds.push(hashtag._id);
    }
    return TagIds;
  }
};
const calculateEndDate = async (days) => {
  const endDate = new Date();
  return endDate.setDate(endDate.getDate() + days);
};
//calculatePostsRequired
function calculatePostsRequired(durationInDays, postsPerInterval) {
  return Math.floor(durationInDays / postsPerInterval); // Example: 45 days -> 22 posts (45/2 = 22.5, rounded down to 22)
}
export async function POST(req) {
  try {
    await dbConnect();
    const {
      challengeName,
      challengeDescription,
      tags,
      challengeDays,
      userId,
      isPublic,
    } = await req.json();

    if (
      !challengeName ||
      !challengeDescription ||
      !Array.isArray(tags) ||
      !challengeDays ||
      !userId
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
        challengeOwner: userId,
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
