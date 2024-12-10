import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema(
  {
    tag: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [1, "Hashtag tag must be at least 1 character long"],
      maxlength: [
        50,
        "Hashtag tag must be less than or equal to 50 characters",
      ],
    },
    challenge: [
      {
        type: Schema.Types.ObjectId,
        ref: "Challenge",
      },
    ],
  },
  { timestamps: true }
);

export const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema);
