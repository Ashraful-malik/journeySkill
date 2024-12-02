import dbConnect from "@/lib/dbConnect";
import Video from "@/models/video.model";

export async function GET(params) {
  try {
    await dbConnect();
    await Video.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {}
}
