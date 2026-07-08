import { logger } from "@/shared/lib/logger";

export interface BatchProcessorOptions<TInput, TOutput> {
  batchSize: number;
  processor: (batch: TInput[], batchIndex: number) => Promise<TOutput[]>;
  onBatchComplete?: (batchIndex: number, results: TOutput[]) => void;
  delayBetweenBatchesMs?: number;
}

export async function processBatches<TInput, TOutput>(
  items: TInput[],
  options: BatchProcessorOptions<TInput, TOutput>,
): Promise<TOutput[]> {
  const { batchSize, processor, onBatchComplete, delayBetweenBatchesMs = 0 } = options;
  const results: TOutput[] = [];
  const totalBatches = Math.ceil(items.length / batchSize);

  for (let i = 0; i < items.length; i += batchSize) {
    const batchIndex = Math.floor(i / batchSize);
    const batch = items.slice(i, i + batchSize);

    logger.info("Processing batch", {
      feature: "ai-mapping",
      action: "batch_process",
      batchIndex,
      totalBatches,
      batchSize: batch.length,
    });

    const batchResults = await processor(batch, batchIndex);
    results.push(...batchResults);
    onBatchComplete?.(batchIndex, batchResults);

    if (delayBetweenBatchesMs > 0 && i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatchesMs));
    }
  }

  return results;
}

export function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
