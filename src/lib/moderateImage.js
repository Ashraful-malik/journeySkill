import axios from "axios";

export const analyzeImage = async (file) => {
  const cloudName = "dxe3cn4ca";
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  try {
    // const formData = new FormData();
    // formData.append("file", file);
    const name = URL.createObjectURL(file);
    const response = await axios.post(
      `https://${apiKey}:${apiSecret}@api.cloudinary.com/v2/analysis/${cloudName}/analyze/ai_vision_moderation`,
      {
        source: {
          uri: name, // URL of the image to analyze
        },
        rejection_questions: [
          "Does the image contain alcohol?",
          "Does the image contain nudity?",
        ],
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Handle moderation results
    const results = response.data;
    // Parse the response
    const analysis = response.data.data.analysis.responses;
    const isSafe = analysis.every((item) => item.value === "no");
    const requestLimit =
      response.data?.limits?.addons_quota?.[0]?.remaining || 0;

    return { isSafe: isSafe, analysis: analysis, limitRemaining: requestLimit };
  } catch (error) {
    throw new Error("Failed to analyze image");
  }
};
