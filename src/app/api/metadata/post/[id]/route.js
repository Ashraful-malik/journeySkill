import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import { Post } from "@/models/post.model";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    if (!id) {
      return createErrorResponse({
        status: 400,
        message: "Post ID is required or invalid",
      });
    }

    const post = await Post.findById(id)
      .select("text createdAt")
      .populate("owner", "fullName username ")
      .lean();

    if (!post) {
      return createErrorResponse({
        status: 404,
        message: "Post not found",
      });
    }
    return createResponse({
      status: 200,
      data: post,
      message: "success",
    });
  } catch (error) {
    return createErrorResponse({
      status: 500,
      message: error.message,
    });
  }
}
