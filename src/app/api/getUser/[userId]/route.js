import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { createResponse } from "@/lib/utils/response";
import User from "@/models/user.model";
import { createErrorResponse } from "@/lib/utils/error";

export async function POST(req, { params }) {
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
    const user = await User.findById(userId);
    if (!user) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    return createResponse({ data: user, message: "success", status: 200 });
  } catch (error) {
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
}
