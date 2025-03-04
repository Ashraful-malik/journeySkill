import mongoose, { Schema } from "mongoose";
import { Challenge } from "./challenge.model";
const postSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    text: {
      type: String,
    },

    image: {
      type: String, //cloudinary url
    },

    imagePublicId: {
      type: String, //cloudinary public id
      unique: true,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    likeCount: {
      type: Number,
      default: 0,
    },

    link: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

postSchema.index({ challengeId: 1, isPublic: 1 });

export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
