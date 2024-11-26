import dbConnect from "@/lib/dbConnect";
import { createResponse } from "@/lib/utils/response";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const user = {
      name: "Akhil",
      email: "akhil@gmail.com",
    };
    return createResponse({ data: user, message: "success", status: 200 });
  } catch (error) {
    return createResponse({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}
