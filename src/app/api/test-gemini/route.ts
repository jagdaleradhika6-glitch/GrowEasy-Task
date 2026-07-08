import { NextResponse } from "next/server";
import { gemini } from "@/shared/lib/ai/gemini";

export async function GET() {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Reply with exactly: Gemini API is working successfully.",
    });

    return NextResponse.json({
      success: true,
      message: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}