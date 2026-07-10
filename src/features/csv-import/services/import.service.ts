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

export async function pollImportJob(id: string): Promise<ImportJob> {
  return fetchImportJob(id);
}
