import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { View } from "@/models/views.model";
import dbConnect from "@/lib/dbConnect";
import { Post } from "@/models/post.model";
import { Challenge } from "@/models/challenge.model";

// get all  views count
export async function POST(req) {
  try {
    await dbConnect();
    const { contentType, postId } = await req.json();
    // postId here is the id of the challenge or post for which we want to record a view.
    if (!postId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Post id is required",
      });
    }
    if (!contentType) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Content type or post postId is required",
      });
    }

    let viewCount;
    if (contentType === "Post") {
      const postViews = await Post.findById(postId).select("viewCount");
      if (!postViews) {
        return createErrorResponse({
          success: false,
          status: 404,
          message: "Post views not  found",
        });
      }
      viewCount = postViews.viewCount;
    } else if (contentType === "Challenge") {
      const challengeViews = await Challenge.findById(postId).select(
        "viewCount"
      );
      if (!challengeViews) {
        return createErrorResponse({
          success: false,
          status: 404,
          message: "Challenge not views found",
        });
      }
      viewCount = challengeViews.viewCount;
    } else {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Invalid content type",
      });
    }
    return createResponse({
      success: true,
      status: 200,
      message: "Views fetched successfully",
      data: { viewCount },
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Error getting user profile",
      errors: error.message,
    });
  }
}
