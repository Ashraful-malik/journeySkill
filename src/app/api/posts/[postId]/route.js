import { deleteFileOnCloudinary } from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { Post } from "@/models/post.model";
import { createResponse } from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function GET(req, { params }) {
  try {
    const { postId } = await params;
    if (!postId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Post ID is required or invalid",
      });
    }
    await dbConnect();
    const post = await Post.findById(postId)
      .populate("owner", "profileImage.imageUrl fullName username")
      .populate("challengeId", "challengeName");

    if (!post) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Post not found or Post ID is invalid",
      });
    }
    return createResponse({ data: post, message: "success", status: 200 });
  } catch (error) {
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Error getting post",
      errors: error.message,
    });
  }
}

// update post
export async function PATCH(req, { params }) {
  try {
    const { text, link, imageUrl, imagePublicId } = await req.json();
    const { postId } = await params;
    if (!postId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Post ID is required or invalid",
      });
    }
    if (!text && !link && !imageUrl) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "text, link or image is required",
      });
    }
    await dbConnect();
    const post = await Post.findById(postId);

    if (!post) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Post not found or Post ID is invalid",
      });
    }
    if (imagePublicId) {
      await deleteFileOnCloudinary(post.imagePublicId);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      { _id: postId },
      {
        text: text || post.text,
        link: link || post.link,
        imageUrl: imageUrl || post.imageUrl,
        imagePublicId: imagePublicId || post.imagePublicId,
      },
      { new: true }
    );
    return createResponse({
      success: true,
      status: 200,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Error creating post",
      errors: error.message,
    });
  }
}

//Delete post
export async function DELETE(req, { params }) {
  try {
    const user = await auth();
    const { postId } = await params;
    const id = user?.sessionClaims?.user_Id;

    if (!id) {
      return createErrorResponse({
        success: false,
        status: 401,
        message: "Unauthorized please login",
      });
    }
    if (!postId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Post ID is required or invalid",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Post not found",
      });
    }

    if (!post.owner.equals(id)) {
      return createErrorResponse({
        success: false,
        status: 403,
        message: "You are not authorized to delete this post",
      });
    }

    if (post.imagePublicId) {
      await deleteFileOnCloudinary(post.imagePublicId);
    }
    await Post.deleteOne({ _id: postId });
    return createResponse({
      success: true,
      status: 200,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Something went wrong while deleting the post.",
      errors: error.message,
    });
  }
}
