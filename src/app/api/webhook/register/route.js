import { headers } from "next/headers";
import { createErrorResponse } from "@/lib/utils/error";
import { createResponse } from "@/lib/utils/response";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Handles incoming POST requests for webhook registration.
 * Connects to the database and verifies the webhook signature using Svix.
 * Processes the event payload based on the event type.
 * - Supports "user.created" event type to create a new user in the database.
 *
 * @param {Object} req - The incoming request object containing headers and JSON payload.
 * @returns {Object} - A response object indicating the result of processing the webhook.
 *
 * Possible responses:
 * - 200: Webhook processed successfully.
 * - 400: Missing Svix headers or error verifying webhook signature.
 * - 400: Missing primary email address for "user.created" event.
 * - 500: Internal server error or error creating user.
 */
export async function POST(req) {
  try {
    await dbConnect();
    // Load Webhook Secret
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error("Missing Clerk Webhook Secret");
      throw new Error(
        "Server configuration error: Missing Clerk Webhook Secret"
      );
    }

    // Create new Svix instance with secret

    // Extract raw request body and headers
    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing Svix headers", {
        svixId,
        svixTimestamp,
        svixSignature,
      });
      return createErrorResponse({
        message: "Missing Svix headers",
        status: 400,
      });
    }
    const wh = new Webhook(WEBHOOK_SECRET);
    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);
    let evt;

    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (error) {
      return createErrorResponse({
        message: "Error verifying webhook signature",
        status: 400,
        errors: error.message,
      });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
      const {
        email_addresses,
        primary_email_address_id,
        username,
        image_url,
        id,
        first_name,
        last_name,
      } = evt.data;

      if (!Array.isArray(email_addresses) || email_addresses.length === 0) {
        return createErrorResponse({
          status: 400,
          message: "Invalid email_addresses structure",
        });
      }

      const primaryEmail = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );
      if (!primaryEmail) {
        return createErrorResponse({
          status: 400,
          message: "Missing primary email address",
        });
      }

      const existingUser = await User.findOne({ clerkId: id });

      if (existingUser) {
        return createResponse({
          status: 200,
          success: true,
          message: "User already exists, no further action needed",
          data: existingUser,
        });
      }
      const fullName = [first_name, last_name].filter(Boolean).join(" ");
      // insert User to database
      try {
        const newUser = await User.create({
          email: primaryEmail.email_address,
          clerkId: id,
          username: username,
          profileImage: {
            imageUrl: image_url,
          },
          firstName: first_name,
          lastName: last_name,
          fullName: fullName,
        });
        if (newUser) {
          const client = await clerkClient();

          await client.users.updateUserMetadata(id, {
            publicMetadata: { userId: newUser._id },
          });
        }
      } catch (error) {
        console.error("Database error:", error.message);
        return createErrorResponse({
          status: 500,
          message: "Database error",
          errors: error.message,
        });
      }
    }
    return createResponse({
      success: true,
      status: 200,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Unhandled error:", error);
    return new createErrorResponse({
      message: "Internal server error",
      status: 500,
      errors: error.message,
    });
  }
}
