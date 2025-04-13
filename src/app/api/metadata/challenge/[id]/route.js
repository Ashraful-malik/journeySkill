import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!id) {
      return createErrorResponse({
        status: 400,
        message: "Challenge ID is required or invalid",
      });
    }
    const challenge = await Challenge.findById(id)
      .select("challengeName description createdAt banner.imageUrl")
      .populate("challengeOwner", "fullName username ")
      .lean();
    if (!challenge) {
      return createErrorResponse({
        status: 404,
        message: "Challenge not found",
      });
    }
    return createResponse({
      status: 200,
      data: challenge,
      message: "success",
    });
  } catch (error) {
    return createErrorResponse({
      status: 500,
      message: error.message,
    });
  }
}
