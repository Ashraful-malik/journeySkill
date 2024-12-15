import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import User from "@/models/user.model";

// update user details
export async function POST(req, { params }) {
  try {
    const { userId } = await params;
    const { username, fullName, bio, dob, location } = await req.json();
    if (!username && !fullName && !bio && !dob && !location) {
      return createErrorResponse({
        status: 400,
        message: "Field cannot be empty",
      });
    }
    const updateFields = {};
    if (username) updateFields.username = username;
    if (fullName) updateFields.fullName = fullName;
    if (bio) updateFields.bio = bio;
    if (dob) updateFields.dob = dob;
    if (location) updateFields.location = location;
    if (fullName) updateFields.fullName = fullName;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: updateFields,
      },
      { new: true }
    );
    if (!user) {
      return createErrorResponse({
        status: 404,
        message: "User not found",
      });
    }
    await user.save();

    return createResponse({
      status: 200,
      success: true,
      message: "user detail updated successfully",
    });
  } catch (error) {
    console.log(error);
    return createErrorResponse({
      status: 500,
      message: "Internal server error",
      errors: error.message,
    });
  }
}
