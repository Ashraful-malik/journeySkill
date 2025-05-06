import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import User from "@/models/user.model";
import { auth } from "@clerk/nextjs/server";

// get value of onboarding page from user
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = req.nextUrl;
    const page = searchParams.get("page");
    const userId = searchParams.get("userId");

    const user = await User.findById(userId);

    if (!user) {
      return createErrorResponse({
        status: 404,
        message: "User not found",
      });
    }
    const onboarding = user?.onboarding;
    return createResponse({
      status: 200,
      message: "User found",
      data: {
        completed: onboarding[page] === true,
      },
    });
  } catch (error) {
    return createErrorResponse({
      status: 500,
      message: "Internal server error",
      errors: error.message,
    });
  }
}

// update onboarding page value

/*
@param {id} userId - The ID of the user
 @param {string} page - The onboarding page to check
 these are the pages of onboarding,
 {challengePage,homePage,profilePage,analyticsPage}
*/
export async function POST(req) {
  try {
    await dbConnect();
    // const { searchParams } = req.nextUrl;
    // const page = searchParams.get("page");
    const { userId, page } = await req.json();

    const user = await User.updateOne(
      { _id: userId },
      {
        $set: {
          [`onboarding.${page}`]: true,
        },
      }
    );
    if (!user) {
      return createErrorResponse({
        status: 404,
        message: "User not found",
      });
    }
    return createResponse({
      status: 200,
      message: "User updated",
      data: {
        completed: true,
      },
    });
  } catch (error) {
    return createErrorResponse({
      status: 500,
      message: "Internal server error",
      errors: error.message,
    });
  }
}
