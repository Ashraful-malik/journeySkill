import mongoose, { Schema } from "mongoose";

const uploadedImageSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publicId: {
      type: String, // Cloudinary public ID
      required: true,
      unique: true,
    },
    ImageUrl: {
      type: String, // Cloudinary 
    },
    status: {
      type: String,
      enum: ["temporary", "used", "error"],
      default: "temporary", // Set to "used" when attached to a post
    },
    errorMessage: {
      type: String,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const UploadedImage =
  mongoose.models.UploadedImage ||
  mongoose.model("UploadedImage", uploadedImageSchema);
