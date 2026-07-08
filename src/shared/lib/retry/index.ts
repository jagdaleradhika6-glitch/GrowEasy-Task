import { logger } from "@/shared/lib/logger";

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, "shouldRetry" | "onRetry">> = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 8000,
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function exponentialBackoff(attempt: number, baseDelayMs: number, maxDelayMs: number) {
  const jitter = Math.random() * 100;
  return Math.min(baseDelayMs * 2 ** (attempt - 1) + jitter, maxDelayMs);
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { maxAttempts, baseDelayMs, maxDelayMs } = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const canRetry =
        attempt < maxAttempts &&
        (options.shouldRetry?.(error, attempt) ?? true);

      if (!canRetry) break;

      logger.warn("Retrying operation", { action: "retry", attempt, maxAttempts });
      options.onRetry?.(error, attempt);
      await delay(exponentialBackoff(attempt, baseDelayMs, maxDelayMs));
    }
  }

  throw lastError;
}
