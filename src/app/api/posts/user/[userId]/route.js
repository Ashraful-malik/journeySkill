import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Post } from "@/models/post.model";
import mongoose from "mongoose";

//Get all users post
export async function GET(req, { params }) {
  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1"); // Default page: 1
    const limit = parseInt(searchParams.get("limit") || "10"); // Default limit: 10
    const skip = (page - 1) * limit;

    const { userId } = await params;
    const isUserId = new mongoose.Types.ObjectId(userId);
    if (!isUserId) {
      return createErrorResponse({
        success: false,
        status: 401,
        message: "userId is invalid",
      });
    }

    //connecting database
    await dbConnect();
    const posts = await Post.find({ owner: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("owner", "fullName username profileImage.imageUrl")
      .populate("challengeId", "challengeName");

    if (!posts) {
      return createErrorResponse({
        success: false,
        status: 404,
        message: "Posts not found",
      });
    }
    const totalPost = await Post.countDocuments({ owner: userId });
    const totalPage = Math.ceil(totalPost / limit);

    return createResponse({
      success: true,
      status: 200,
      message: "Posts fetched successfully",
      data: {
        pages: [
          {
            posts: posts || [],
            pagination: {
              currentPage: page,
              totalPages: totalPage,
              totalPosts: totalPost,
            },
          },
        ],
      },
    });
  } catch (error) {
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Internal Server Error",
      errors: error.message,
    });
  }
}
