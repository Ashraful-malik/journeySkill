import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

export async function POST(req, { params }) {
  const session = await auth();
  const userId = session?.sessionClaims?.user_Id;

  try {
    await dbConnect();
    const { challengeId } = await params;

    if (!challengeId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Challenge ID is required or invalid",
      });
    }
    if (!userId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User ID is required or invalid",
      });
    }
    const challenge = await Challenge.findById(challengeId, {
      challengeOwner: 1,
    }).populate("challengeOwner", "_id");
    if (!challenge || !challenge.challengeOwner) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Challenge not found or missing owner",
      });
    }
    if (userId !== challenge.challengeOwner._id.toString()) {
      return createErrorResponse({
        success: false,
        status: 403, // Change to 403 Forbidden
        message: "You are not authorized to access this challenge analytics",
      });
    }

    const analytic = await Challenge.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(challengeId),
          challengeOwner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $facet: {
          dailyProgress: [
            { $unwind: "$taskLogs" },
            {
              $addFields: {
                day: {
                  $add: [
                    {
                      $dateDiff: {
                        startDate: "$startDate",
                        endDate: "$taskLogs.taskCompletionDate",
                        unit: "day",
                      },
                    },
                    1, // To start counting days from 1
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$day",
                tasks: { $sum: 1 },
                taskDates: { $push: "$taskLogs.taskCompletionDate" },
              },
            },
            {
              $project: {
                _id: 0,
                day: "$_id",
                tasks: 1,
                taskDates: 1,
              },
            },
            { $sort: { day: 1 } },
          ],
          challengeDetails: [
            {
              $project: {
                _id: 0,
                challengeName: 1,
                totalTasks: "$tasksRequired",
                completedTasks: "$tasksCompleted",
                completionPercentage: {
                  $multiply: [
                    { $divide: ["$tasksCompleted", "$tasksRequired"] },
                    100,
                  ],
                },
                currentStreak: 1,
                consistencyIncentiveDays: 1,
                isCompleted: 1,
                lastActivityDate: 1,
                completionDate: 1,
                isPublic: 1,
                startDate: 1,
                endDate: 1,
                viewCount: 1,
                _id: 1,
              },
            },
          ],
        },
      },
    ]);

    const result = analytic[0];

    return createResponse({
      success: true,
      data: {
        challengeDetails: result.challengeDetails[0],
        dailyProgress: result.dailyProgress,
      },
      status: 200,
    });
  } catch (error) {
    return createErrorResponse({
      errors: error.message,
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
}
