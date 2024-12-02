import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  publicId: { type: String, required: true },
  url: { type: String, required: true },
  originalSize: {
    type: String,
  },
  compressedSize: {
    type: String,
  },
  duration: {
    type: String,
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});
postSchema.index({ postId: 1 });

const Video = mongoose.models.videos || mongoose.model("Video", videoSchema);
export default Video;
