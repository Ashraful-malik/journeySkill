import { Challenge } from "@/models/challenge.model";
import { Tag } from "@/models/tag.model";
import { createErrorResponse } from "./error";

export const calculateEndDate = async (days) => {
  const endDate = new Date();
  return endDate.setDate(endDate.getDate() + days);
};
// utils for challenge
export const createOrUpdateTags = async (tags, challenge) => {
  if (Array.isArray(tags)) {
    const TagIds = [];

    for (const tag of tags) {
      const trimmedTag = tag.toLowerCase().trim();
      if (!trimmedTag) {
        throw new ApiError(400, "Tag cannot be empty.");
      }

      let hashtag = await Tag.findOne({ tag: trimmedTag });

      if (!hashtag) {
        hashtag = new Tag({
          tag: trimmedTag,
          challenge: [challenge._id], // Initialize the challenge array
        });
        await hashtag.save();
      } else {
        // Ensure the Tag is linked to the challenge
        if (!hashtag.challenge.includes(challenge._id)) {
          hashtag.challenge.push(challenge._id);
          await hashtag.save();
        }
      }

      TagIds.push(hashtag._id);
    }
    return TagIds;
  }
};

// remove unlinked tags from Challenge
export const removeUnlinkedTags = async (
  updatedChallengeId,
  updatedChallengeTag
) => {
  try {
    // Delete all tags that are not linked to the challenge

    const allTags = await Tag.find({});
    for (const tag of allTags) {
      if (!updatedChallengeTag?.includes(tag._id)) {
        // if the tag is not in the updatedChallengeTag array, then delete it
        await Tag.deleteOne({ _id: tag._id });

        // also remove the tagId from the Challenge
        await Challenge.updateOne(
          { _id: updatedChallengeId },
          { $pull: { tags: tag._id } }
        );
      }
    }
  } catch (error) {
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Error removing unlinked tags",
      error: error.message,
    });
  }
};
