import { apiClient } from "@/shared/lib/api/client";
import type { ImportJob } from "@/shared/types/api";
import type { ImportRequest } from "../schemas/import.schema";

const BASE = "/api/imports";

export async function submitImport(request: ImportRequest): Promise<ImportJob> {
  const response = await apiClient<{ data: ImportJob }>(BASE, {
    method: "POST",
    body: request,
    retry: true,
  });
  return response.data;
}

export async function fetchImportJob(id: string): Promise<ImportJob> {
  const response = await apiClient<{ data: ImportJob }>(`${BASE}/${id}`, { retry: true });
  return response.data;
}

export async function pollImportJob(
  id: string,
  onProgress?: (job: ImportJob) => void,
): Promise<ImportJob> {
  const pollIntervalMs = 800;
  const maxAttempts = 120;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const job = await fetchImportJob(id);
    onProgress?.(job);

    if (job.status === "completed" || job.status === "failed") {
      return job;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error("Import timed out");
}
