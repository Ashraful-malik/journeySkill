import { Challenge } from "@/models/challenge.model";

// get all user challenges
export async function GET(req, { params }) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    await dbConnect();
    const { sessionClaims } = await auth();
    const mongoUserId = sessionClaims.user_id;
    const { userId } = await params;

    const challenge = await Challenge.find({
      challengeOwner: mongoUserId,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("challengeOwner")
      .populate("tags");

    if (!challenge) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Challenge not found",
      });
    }
    const total = await Challenge.countDocuments({
      challengeOwner: mongoUserId,
    });
    const totalPages = Math.ceil(total / limit);

    return createResponse({
      success: true,
      message: "success",
      status: 200,
      data: {
        challenge,
        totalPages,
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
