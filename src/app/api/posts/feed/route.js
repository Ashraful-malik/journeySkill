//get all posts for feed
import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Post } from "@/models/post.model";

export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1"); // Default page: 1
  const limit = parseInt(searchParams.get("limit") || "10"); // Default limit: 10
  const skip = (page - 1) * limit;

  try {
    dbConnect();
    const posts = await Post.find({ isPublic: true })
      .select("-imagePublicId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("owner", "fullName username profileImage")
      .populate("challengeId", "challengeName");

    if (!posts) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Posts not found",
      });
    }
    const totalPost = await Post.countDocuments({ isPublic: true });
    const totalPage = Math.ceil(totalPost / limit);
    return createResponse({
      data: {
        posts,
        totalPost: totalPost,
        totalPage: totalPage,
      },
      message: "posts fetched successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Error creating post",
      error: error.message,
    });
  }
}
