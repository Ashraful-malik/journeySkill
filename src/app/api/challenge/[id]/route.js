import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import { auth } from "@clerk/nextjs/server";
import {
  calculateEndDate,
  createOrUpdateTags,
  removeUnlinkedTags,
} from "@/lib/utils/utilsForChallenge";

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

      return createResponse({
        success: true,
        message: "challenge updated successfully",
        status: 200,
      });
    } catch (error) {}
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

    await Challenge.deleteOne({ _id: id });
    await removeUnlinkedTags();

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
