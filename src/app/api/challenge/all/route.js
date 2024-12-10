import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";

export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1"); // Default page: 1
  const limit = parseInt(searchParams.get("limit") || "10"); // Default limit: 10
  const skip = (page - 1) * limit;

  try {
    await dbConnect();
    const pipeline = [
      { $match: { isPublic: true } },
      {
        $lookup: {
          from: "users",
          localField: "challengeOwner",
          foreignField: "_id",
          as: "owner",
        },
      },
      // Unwind the user array (since $lookup returns an array)
      { $unwind: "$owner" },

      {
        $lookup: {
          from: "Tag",
          localField: "tags",
          foreignField: "_id",
          as: "allChallengeHashtags",
        },
      },
      {
        $project: {
          "owner._id": 1,
          "owner.fullName": 1,
          "owner.username": 1,
          "owner.profileImage": 1,
          challengeName: 1,
          description: 1,
          hashtags: 1,
          createdAt: 1,
          endDate: 1,
          "allChallengeHashtags.tag": 1,
        },
      },

      {
        $facet: {
          // $facet is an aggregation operator that allows you to split the data into multiple groups and perform different aggregation operations on each group
          // It returns an object with a single field for each group, where the value of the field is an array of documents that belong to that group
          // In this case, we are grouping by the "allHashtags" field and returning an array of all the tags associated with each challenge
          challenges: [
            { $sort: { createdAt: 1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];
    const result = await Challenge.aggregate(pipeline);

    const allChallenges = result[0].challenges;

    const total =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;

    const totalPages = Math.ceil(total / limit);

    if (!allChallenges || allChallenges.length === 0) {
      return createResponse({
        message: "No challenge found",
        status: 404,
        data: null,
      });
    }

    return createResponse({
      message: "success",
      status: 200,
      data: {
        allChallenges,
        currentPage: page,
        totalPages: totalPages,
        totalCalledChallenges: total,
      },
    });
  } catch (error) {
    console.error(error);
    return createErrorResponse({
      success: false,
      status: 400,
      message: error.message || "Failed to get challenges. Please try again.",
      error: error,
    });
  }
}
