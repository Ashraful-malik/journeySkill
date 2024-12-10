import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import User from "@/models/user.model";
//get user profile data
export async function GET(req, { params }) {
  try {
    const { username } = await params;
    if (!username) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Username is required or invalid",
      });
    }
    await dbConnect();
    const user = await User.findOne({ username })
      .populate("badges")
      .populate("challenges")
      .exec();
    if (!user) {
      return createErrorResponse({
        status: 404,
        success: false,
        message: "User not found",
      });
    }
    return createResponse({ data: user, message: "success", status: 200 });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Error getting user profile",
      error: error.message,
    });
  }
}
