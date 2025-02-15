import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Challenge } from "@/models/challenge.model";
import { Comment } from "@/models/comment.model";
import { Post } from "@/models/post.model";
import dbConnect from "@/lib/dbConnect";

// get all comments of post or challenge by id
export async function POST(req, { params }) {
  try {
    await dbConnect();
    // id here is post of content like post id or challenge id
    const { id } = await params;
    const { contentType } = await req.json();

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    if (!contentType && !id) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Content type and post id is required",
      });
    }

    let comments;
    if (contentType === "Post") {
      const post = await Post.findById(id);
      if (!post) {
        return createErrorResponse({
          success: false,
          status: 404,
          message: "Post not found or Post ID is invalid",
        });
      }
      comments = await Comment.find({ post: id })
        .populate("commentBy", "fullName username profileImage.imageUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } else if (contentType === "Challenge") {
      const challenge = await Challenge.findById(id);
      if (!challenge) {
        return createErrorResponse({
          success: false,
          status: 404,
          message: "Challenge not found or Challenge ID is invalid",
        });
      }
      comments = await Comment.find({ challenge: id })
        .populate("commentBy", "fullName username profileImage.imageUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "Invalid content type",
      });
    }

    if (!comments) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "No comments found",
      });
    }
    const totalComment = await Comment.countDocuments(
      contentType === "Post" ? { post: id } : { challenge: id }
    );

    const totalPage = Math.ceil(totalComment / limit);

    return createResponse({
      data: {
        comments,
        totalComment,
        pagination: {
          currentPage: page,
          totalPages: totalPage,
          limit,
        },
      },
      message: "success",
      status: 200,
    });
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
