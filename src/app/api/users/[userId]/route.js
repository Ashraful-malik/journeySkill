import dbConnect from "@/lib/dbConnect";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import User from "@/models/user.model";
import { clerkClient } from "@clerk/express";
import { auth } from "@clerk/nextjs/server";
import { create } from "axios";

// update user details
export async function PUT(req, { params }) {
  try {
    const { userId } = await params;
    const clerkId = (await auth()).userId;
    const { username, fullName, bio, dob, location } = await req.json();
    if (!username && !fullName && !bio && !dob && !location) {
      return createErrorResponse({
        status: 400,
        message: "Field cannot be empty",
      });
    }
    await dbConnect();
    const updateFields = {};
    if (username) {
      try {
        const user = await clerkClient.users.updateUser(clerkId, { username });
        console.log(user);
        if (!user) {
          return createErrorResponse({
            status: 404,
            message: "User not found",
          });
        }
        updateFields.username = username;
      } catch (error) {
        if (error?.errors) {
          const usernameConflict = error.errors.find(
            (error) => error.code === "form_identifier_exists"
          );

          if (usernameConflict) {
            return createErrorResponse({
              status: 400,
              message: "Username already exists",
              errors: usernameConflict.message || "Username already exists",
            });
          }
        }
        return createErrorResponse({
          status: 400,
          message: "Clerk error",
          errors: error.message,
        });
      }
    }
    if (fullName) {
      try {
        const firstName = fullName.split(" ")[0];
        const lastName = fullName.split(" ")[1] || "";
        await clerkClient.users.updateUser(clerkId, {
          firstName: firstName,
          lastName: lastName,
        });
        updateFields.fullName = fullName;
      } catch (error) {
        return createErrorResponse({
          status: 400,
          message: "Clerk error",
          errors: error.message,
        });
      }
    }
    if (bio) updateFields.bio = bio;
    if (dob) updateFields.dob = dob;
    if (location) updateFields.location = location;
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
