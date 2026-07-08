import { NextResponse } from "next/server";
import { aiMappingRequestSchema, aiMappingResponseSchema } from "@/features/ai-mapping/types";
import { mapColumnsWithGemini } from "@/features/ai-mapping/services/gemini-mapper.service";
import { logger } from "@/shared/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = aiMappingRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    logger.info("AI column mapping requested", {
      feature: "ai-mapping",
      action: "map_columns",
      headerCount: parsed.data.headers.length,
    });

    const response = await mapColumnsWithGemini(parsed.data);
    const validated = aiMappingResponseSchema.parse(response);

    return NextResponse.json(validated);
  } catch (error) {
    logger.error("AI mapping failed", {
      feature: "ai-mapping",
      action: "map_columns",
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Mapping failed" }, { status: 500 });
  }
}
