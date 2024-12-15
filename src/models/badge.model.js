import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  image: { type: String, required: true }, // URL of the badge image
  massage: { type: String }, // Optional description of the badge
  streak: { type: Number }, // Number of streak days needed to earn the badge
});

const Badge = mongoose.models.Badge || mongoose.model("Badge", badgeSchema);
export default Badge;
