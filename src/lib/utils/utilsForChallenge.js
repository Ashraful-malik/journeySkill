import { Challenge } from "@/models/challenge.model";
import { Tag } from "@/models/tag.model";

export const calculateEndDate = async (days) => {
  const endDate = new Date();
  return endDate.setDate(endDate.getDate() + days);
};
// utils for challenge
export const createOrUpdateTags = async (tags, challenge) => {
  if (Array.isArray(tags)) {
    const TagIds = [];

    for (const tag of tags) {
      if (!tag.trim()) {
        throw new ApiError(400, "Tag  cannot be empty.");
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

// remove unlinked tags from Challenge
export const removeUnlinkedTags = async (
  updatedChallengeId,
  updatedChallengeTag
) => {
  try {
    // Delete all tags that are not linked to the challenge
    //how to check if the tag is linked to the challenge
    const allTags = await Tag.find({});

    for (const tag of allTags) {
      if (!updatedChallengeTag.includes(tag._id)) {
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
    console.log(error);
    throw new ApiError(400, error, "Error removing unlinked Tags");
  }
};
