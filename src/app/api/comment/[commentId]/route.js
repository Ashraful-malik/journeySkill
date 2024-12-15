import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Comment } from "@/models/comment.model";
import dbConnect from "@/lib/dbConnect";

// update comment
export async function PUT(req, { params }) {
  try {
    console.log("update comment");
    await dbConnect();
    const { commentId } = await params;
    const { content } = await req.json();
    console.log(content, commentId);

    if (!commentId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Comment ID is required or invalid",
      });
    }
    if (!content) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "content can not be empty",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Comment not found or Comment ID is invalid",
      });
    }
    comment.content = content;
    await comment.save();
    return createResponse({ message: "comment updated", status: 200 });
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

// delete comment
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { commentId } = await params;
    if (!commentId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Comment ID is required or invalid",
      });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Comment not found or Comment ID is invalid",
      });
    }
    await Comment.findByIdAndDelete(commentId);
    return createResponse({ message: "comment deleted", status: 200 });
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
