import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { Post } from "@/models/post.model";

//Get all users post
export async function GET(req, { params }) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1"); // Default page: 1
  const limit = parseInt(searchParams.get("limit") || "10"); // Default limit: 10
  const skip = (page - 1) * limit;

  try {
    const { userId } = await params;
    if (!userId) {
      return createErrorResponse({
        success: false,
        status: 400,
        message: "User ID not Found or Invalid",
      });
    }
    //connecting database
    await dbConnect();
    const posts = await Post.find({ owner: userId })
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
    const totalPost = await Post.countDocuments({ owner: userId });
    const totalPage = Math.ceil(totalPost / limit);

    return createResponse({
      success: true,
      status: 200,
      message: "Posts fetched successfully",
      data: {
        posts,
        currentPage: page,
        totalPost: totalPost,
        totalPage: totalPage,
      },
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      success: false,
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
