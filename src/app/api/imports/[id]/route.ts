import { NextResponse } from "next/server";
import { getImportJob } from "@/features/csv-import/services/import-job.store";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const job = getImportJob(id);

  if (!job) {
    return NextResponse.json({ error: "Import job not found" }, { status: 404 });
  }

  return NextResponse.json({ data: job });
}
