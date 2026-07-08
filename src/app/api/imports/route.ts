import { NextResponse } from "next/server";
import { importRequestSchema } from "@/features/csv-import/schemas/import.schema";
import { createImportJob } from "@/features/csv-import/services/import-job.store";
import { logger } from "@/shared/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = importRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid import request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    logger.info("Import job created", {
      feature: "csv-import",
      action: "create_job",
      fileName: parsed.data.fileName,
      rowCount: parsed.data.rows.length,
    });

    const job = createImportJob(parsed.data.rows, parsed.data.mappings);

    return NextResponse.json({ data: job }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create import job", {
      feature: "csv-import",
      action: "create_job",
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Failed to create import" }, { status: 500 });
  }
}
