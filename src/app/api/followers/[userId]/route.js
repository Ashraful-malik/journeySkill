import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Follower } from "@/models/follower.model";

// get all follower of a user
export async function GET(req, { params }) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // userId refers to the ID of the user whose follower list you want to retrieve.
    const { userId } = await params;
    if (!userId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User ID is required or invalid",
      });
    }

    await dbConnect();
    const followers = await Follower.find({ user: userId })
      .populate("follower", "username profileImage firstName lastName")
      .skip(skip)
      .limit(limit)
      .exec();

    if (!followers) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "No followers found",
      });
    }
    const totalFollowers = await Follower.countDocuments({ user: userId });
    const totalPage = Math.ceil(totalFollowers / limit);

    return createResponse({
      data: {
        followers: followers,
        totalFollowers: totalFollowers,
        pagination: {
          totalPage: totalPage,
          currentPage: page,
          limit: limit,
        },
      },
      message: "success",
      status: 200,
    });
  } catch (error) {
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Error getting followers",
      errors: error.message,
    });
  }
}
