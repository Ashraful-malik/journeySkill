import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Post } from "@/models/post.model";
import mongoose from "mongoose";

// get all public posts by challenge
export async function GET(req, { params }) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1"); // Default page: 1
  const limit = parseInt(searchParams.get("limit") || "10"); // Default limit: 10
  const skip = (page - 1) * limit;
  const { challengeId } = await params;

  const notObjectId = new mongoose.Types.ObjectId(challengeId);
  // Validate challengeId
  if (!challengeId || !notObjectId) {
    return createErrorResponse({
      success: false,
      status: 400,
      message: "Invalid or missing Challenge ID",
    });
  }

  try {
    await dbConnect();
    const posts = await Post.find({ challengeId: challengeId })
      .select("-imagePublicId")
      .skip(skip)
      .limit(limit)
      .where({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate("owner", "username profileImage.imageUrl fullName")
      .populate("challengeId", "challengeName");

    if (!posts.length) {
      // Check for an empty posts array
      return createResponse({
        status: 404,
        success: false,
        message: "post not crated yet",
      });
    }

    const totalPost = await Post.countDocuments({
      challengeId,
      isPublic: true,
    });
    const totalPage = Math.ceil(totalPost / limit);

    return createResponse({
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
      message: "Posts fetched successfully",
      status: 200,
    });
  } catch (error) {
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Internal server error",
      errors: error.message,
    });
  }
}
