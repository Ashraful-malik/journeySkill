import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import {
  calculateEndDate,
  createOrUpdateTags,
  removeUnlinkedTags,
} from "@/lib/utils/utilsForChallenge";
import {auth} from "@clerk/nextjs/server";

//get challenge by Challenge id
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!id) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Challenge ID is required or invalid",
      });
    }
    const challenge = await Challenge.findById(id)
      .populate("challengeOwner", "fullName username profileImage.imageUrl")
      .populate("tags", "tag");
    if (!challenge) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Challenge not found",
      });
    }

    return createResponse({ data: challenge, message: "success", status: 200 });
  } catch (error) {
    return createResponse({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}

// updateChallenge
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!id) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Challenge ID is required or invalid",
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
      !challengeName &&
      !challengeDescription &&
      !tags &&
      !challengeDays &&
      !isPublic
    ) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "At least one field is required to update.",
      });
    }
    if (challengeDays !== undefined && days <= 0) {
      return createErrorResponse({
        success: false,
        status: 400,
        message:
          "Days should be a positive number. Please enter a positive number.",
      });
    }

    try {
      const challenge = await Challenge.findById(id);
      if (!challenge) {
        return createErrorResponse({
          success: false,
          status: 404,
          message: "Challenge not found",
        });
      }
      if (challengeName) challenge.challengeName = challengeName;
      if (challengeDescription) challenge.description = challengeDescription;
      if (isPublic) challenge.isPublic = isPublic;
      if (challengeDays) challenge.days = challengeDays;
      if (challengeDays) {
        challenge.endDate = await calculateEndDate(challengeDays);
      }
      if (tags) {
        // Create or update the tags associated with the challenge
        // If the tags array is empty, no action is taken
        // The function returns an array of tag IDs
        // If the array is not empty, the challenge's tags field is updated with the new array of tag IDs
        const updatedTagId = await createOrUpdateTags(tags || [], challenge);
        if (updatedTagId.length > 0) {
          challenge.tags = updatedTagId;
        }
      }
      const updatedChallenge = await challenge.save();
      await removeUnlinkedTags(updatedChallenge._id, updatedChallenge.tags); // Remove unlinked ();
      console.log(updatedChallenge);
      return createResponse({
        success: true,
        message: "challenge updated successfully",
        data: {
          updatedChallenge,
        },
        status: 200,
      });
    } catch (error) {
      console.log(error);
      return createErrorResponse({
        success: false,
        status: 500,
        message: error.message || "Internal server error",
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

// deleteChallenge
export async function DELETE(req, { params }) {
  try {
    const user = await auth();
    const userId = user?.sessionClaims?.user_Id;
    await dbConnect();
    const { id } = await params;
    if (!id) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Challenge ID is required or invalid",
      });
    }

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Challenge not found or Challenge ID is invalid",
      });
    }
    if (!challenge.challengeOwner.equals(userId)) {
      return createErrorResponse({
        status: 401,
        message: "You are not authorized to delete this comment",
      });
    }

    await Challenge.deleteOne({ _id: id });
    await removeUnlinkedTags(challenge._id, challenge.tags);

    return createResponse({
      success: true,
      message: "challenge deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}
