import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import User from "@/models/user.model";
import { auth } from "@clerk/nextjs/server";
export async function POST() {
  try {
    const { userId } = auth();
    console.log("userId====>", userId);

    if (!userId) {
      return createResponse({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    //for Future use

    try {
      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return createResponse({
          success: false,
          status: 400,
          message: "User not found",
        });
      }

      const subscriptionEnds = new Date();
      subscriptionEnds.setMonth(subscriptionEnds.getMonth() + 1);

      const updatedUser = await User.findOneAndUpdate(
        { clerkId: userId },
        { isSubscribed: true }
      );

      return createResponse({
        success: true,
        status: 200,
        message: "Subscription updated",
        data: updatedUser,
      });
    } catch (error) {
      console.log("error====>", error);

      return createErrorResponse({
        success: false,
        status: 500,
        message: error.message || "Internal server error",
      });
    }
  } catch (error) {
    console.log("error====>", error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
}
