import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import { Post } from "@/models/post.model";
import { View } from "@/models/views.model";

export async function POST(req, { params }) {
  try {
    const { postId } = await params;
    // postId here is id of post of challenge
    const { contentType, userId } = await req.json();
    if (!contentType || !postId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Content type or post id is required",
      });
    }
    if (!userId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User id is required",
      });
    }

    await dbConnect();
    const onModel = contentType === "Post" ? "Post" : "Challenge";
    //check if the user already viewed the post
    const alreadyViewed = await View.findOne({
      viewer: userId,
      target: postId, //target mean post or challenge
      onModel,
    });
    if (!alreadyViewed) {
      const newView = new View({
        viewer: userId,
        target: postId,
        onModel,
      });
      await newView.save();

      //   update view count
      const Model = contentType === "Post" ? Post : Challenge;
      await Model.findByIdAndUpdate(postId, { $inc: { viewCount: 1 } });
    } else {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User already viewed the post",
      });
    }
    return createResponse({
      success: true,
      status: 200,
      message: "View recorded successfully",
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
