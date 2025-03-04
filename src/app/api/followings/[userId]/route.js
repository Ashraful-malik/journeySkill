import { createErrorResponse } from "@/lib/utils/error";
import { Following } from "@/models/following.model";
import dbConnect from "@/lib/dbConnect";
import { createResponse } from "@/lib/utils/response";

// get all following of a user
export async function GET(req, { params }) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    // userId refers to the ID of the user whose following list you want to retrieve.
    const { userId } = await params;
    if (!userId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User ID is required or invalid",
      });
    }
    await dbConnect();
    const following = await Following.find({ user: userId })
      .populate("following", "username profileImage firstName lastName")
      .limit(limit)
      .skip(skip)
      .exec();
    if (!following) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "No following found",
      });
    }
    const totalFollowing = await Following.countDocuments({ user: userId });
    const totalPage = Math.ceil(totalFollowing / limit);
    return createResponse({
      data: {
        following: following,
        totalFollowing: totalFollowing,
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
      message: "Error getting following",
    });
  }
}
