import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import { Comment } from "@/models/comment.model";
import { Post } from "@/models/post.model";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

// create Comment
export async function POST(req) {
  try {
    await dbConnect();
    // id here is post of content like post id or challenge id
    const { content, userId, contentType, id } = await req.json();
    if (!userId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User ID is required or invalid",
      });
    }

    if (!contentType && !mongoose.Types.ObjectId.isValid(id)) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Content type and post id is required",
      });
    }
    let comment;
    if (contentType === "Post") {
      const post = await Post.findById(id);
      if (!post) {
        return createErrorResponse({
          success: false,
          status: 404,
          message: "Post not found or Post ID is invalid",
        });
      }
      comment = new Comment({ content, commentBy: userId, post: id });
    } else if (contentType === "Challenge") {
      const challenge = await Challenge.findById(id);
      if (!challenge) {
        return createErrorResponse({
          success: false,
          status: 404,
          message: "Challenge not found or Challenge ID is invalid",
        });
      }
      comment = new Comment({ content, commentBy: userId, challenge: id });
    } else {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Invalid content type",
      });
    }

    await comment.save();
    return createResponse({ data: comment, message: "success", status: 200 });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Internal server error",
      errors: error.message,
    });
  }
}
