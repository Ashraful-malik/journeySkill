import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import mongoose from "mongoose";
// API endpoint to get analytics for a challenge
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { challengeId } = await params;
    const { userId } = await req.json();

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

    const analytic = await Challenge.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(challengeId),
          challengeOwner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        // $project is an aggregation operator that allows us to select and transform the fields of the documents in the pipeline
        // In this case, we are selecting the challengeName field and renaming it to challengeName
        $project: {
          challengeName: "$challengeName",
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
          viewCount: 1,
        },
      },
    ]);
    const result = analytic[0];

    return createResponse({
      success: true,
      data: result,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      errors: error.message,
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
}
