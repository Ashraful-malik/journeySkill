import mongoose, { Schema } from "mongoose";
import User from "./user.model";
import { Tag } from "./tag.model";
const TaskLogSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, required: true },
  taskCompletionDate: { type: Date, required: true },
});

const challengeSchema = new Schema(
  {
    challengeOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    challengeName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    days: {
      type: Number,
      required: true, //45,90,days etc
    },

    tasksRequired: {
      type: Number,
      required: true,
    }, // How many posts are required to complete the

    tasksCompleted: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    consistencyIncentiveDays: {
      type: Number,
    },

    taskLogs: [TaskLogSchema],

    lastActivityDate: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionDate: {
      type: Date,
      default: null,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

challengeSchema.index({ isPublic: 1, challengeOwner: 1, tags: 1 });

export const Challenge =
  mongoose.models.Challenge || mongoose.model("Challenge", challengeSchema);
