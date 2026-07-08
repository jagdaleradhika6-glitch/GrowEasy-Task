import { ApiError } from "./errors";
import { logger } from "@/shared/lib/logger";
import { withRetry } from "@/shared/lib/retry";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  retry?: boolean;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? String((payload as { error: string }).error)
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, undefined, payload);
  }

  return payload as T;
}

export async function apiClient<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, retry = false, headers, ...rest } = options;

  const execute = async () => {
    logger.debug("API request", { action: "api_request", url, method: rest.method ?? "GET" });

    const response = await fetch(url, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    return parseResponse<T>(response);
  };

  return retry ? withRetry(execute) : execute();
}
