import mongoose, { Schema } from "mongoose";

const challengeProgressSchema = new Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    week: {
      type: Number,
      required: true,
    },

    postCount: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Progress =
  mongoose.Model.Progress ||
  mongoose.model("Progress", challengeProgressSchema);
