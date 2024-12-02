import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    profileImage: {
      type: String,
    },
    profileImagePublicId: {
      type: String,
    },
    coverImagePublicId: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    coverImage: {
      type: String, //cloudinary url
    },

    bio: {
      type: String,
    },

    dob: {
      type: Date,
      trim: true,
    },
    isSubscribed: { type: Boolean, default: false },

    location: {
      type: String,
    },

    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },

    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ], // Store earned badges
  },

  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
