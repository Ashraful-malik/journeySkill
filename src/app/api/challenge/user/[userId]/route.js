import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";

// get all user challenges
export async function GET(req, { params }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User ID is required or invalid",
      });
    }
    await dbConnect();
    // Extract pagination parameters from query
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1"); // Default page: 1
    const limit = parseInt(searchParams.get("limit") || "10"); // Default limit: 10
    const skip = (page - 1) * limit;

    const challenges = await Challenge.find({
      challengeOwner: userId,
    })
      .populate("tags")
      .sort({ createdAt: -1 }) // Sort by latest
      .skip(skip)
      .limit(limit)
      .exec();

    if (!challenges) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Challenge not found",
      });
    }
    const total = await Challenge.countDocuments({
      challengeOwner: userId,
    });
    const totalPages = Math.ceil(total / limit);

    return createResponse({
      success: true,
      message: "success",
      status: 200,
      data: {
        challenges,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
}
