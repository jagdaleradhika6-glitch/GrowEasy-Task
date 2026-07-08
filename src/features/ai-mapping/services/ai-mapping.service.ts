import { apiClient } from "@/shared/lib/api/client";
import { withRetry } from "@/shared/lib/retry";
import { logger } from "@/shared/lib/logger";
import type { AiMappingRequest, AiMappingResponse } from "../types";

const AI_MAP_ENDPOINT = "/api/ai/map-columns";

export async function fetchColumnMappings(
  request: AiMappingRequest,
): Promise<AiMappingResponse> {
  return withRetry(
    () =>
      apiClient<AiMappingResponse>(AI_MAP_ENDPOINT, {
        method: "POST",
        body: request,
      }),
    {
      maxAttempts: 3,
      shouldRetry: (error) => {
        const status = (error as { status?: number }).status;
        return status === undefined || status >= 500;
      },
      onRetry: (error, attempt) => {
        logger.warn("Retrying AI mapping request", {
          feature: "ai-mapping",
          action: "fetch_mappings",
          attempt,
          error: error instanceof Error ? error.message : String(error),
        });
      },
    },
  );
}

export async function fetchColumnMappingsBatched(
  headers: string[],
  sampleRows: Record<string, string>[],
  onProgress?: (completed: number, total: number) => void,
): Promise<AiMappingResponse> {
  const response = await fetchColumnMappings({
    headers,
    sampleRows,
  });

  onProgress?.(1, 1);

  return response;
}