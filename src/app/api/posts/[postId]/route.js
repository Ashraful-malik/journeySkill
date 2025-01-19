import { deleteFileOnCloudinary } from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { Post } from "@/models/post.model";
import { createResponse } from "@/lib/utils/response";

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
    const { postId } = await params;
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
        message: "Post not found or Post ID is invalid",
      });
    }
    await deleteFileOnCloudinary(post.imagePublicId);
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
      message: "Error deleting post",
      errors: error.message,
    });
  }
}
