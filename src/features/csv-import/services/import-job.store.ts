import type { ImportJob, ImportRowError } from "@/shared/types/api";
import { contactSchema, type ColumnMapping } from "@/features/csv-import/schemas/import.schema";
import { processBatches } from "@/features/ai-mapping/services/batch-processor.service";
import { logger } from "@/shared/lib/logger";

const jobs = new Map<string, ImportJob>();

const IMPORT_BATCH_SIZE = 50;

function applyMapping(row: Record<string, string>, mappings: ColumnMapping[]): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const mapping of mappings) {
    if (!mapping.targetField) continue;
    const raw = row[mapping.sourceColumn]?.trim() ?? "";
    mapped[mapping.targetField] = raw || undefined;
  }

  return mapped;
}

async function processImportJob(
  jobId: string,
  rows: Record<string, string>[],
  mappings: ColumnMapping[],
) {
  const job = jobs.get(jobId);
  if (!job) return;

  job.status = "processing";
  const errors: ImportRowError[] = [];
  let successCount = 0;

  await processBatches(rows, {
    batchSize: IMPORT_BATCH_SIZE,
    processor: async (batch, batchIndex) => {
      const batchStartIndex = batchIndex * IMPORT_BATCH_SIZE;

      for (let i = 0; i < batch.length; i++) {
        const rowIndex = batchStartIndex + i;
        const row = batch[i]!;
        const mapped = applyMapping(row, mappings);
        const result = contactSchema.safeParse(mapped);

        if (result.success) {
          successCount++;
        } else {
          const firstIssue = result.error.issues[0];
          errors.push({
            rowIndex,
            field: firstIssue?.path.join(".") || undefined,
            message: firstIssue?.message ?? "Validation failed",
          });
        }

        job.processedRows = rowIndex + 1;
        job.successCount = successCount;
        job.errorCount = errors.length;
      }

      return batch;
    },
    delayBetweenBatchesMs: 100,
  });

  job.status = "completed";
  job.errors = errors;
  job.completedAt = new Date().toISOString();

  logger.info("Import job completed", {
    feature: "csv-import",
    action: "process_job",
    importId: jobId,
    successCount,
    errorCount: errors.length,
  });
}

export function createImportJob(
  rows: Record<string, string>[],
  mappings: ColumnMapping[],
): ImportJob {
  const id = crypto.randomUUID();
  const job: ImportJob = {
    id,
    status: "pending",
    totalRows: rows.length,
    processedRows: 0,
    successCount: 0,
    errorCount: 0,
    createdAt: new Date().toISOString(),
    errors: [],
  };

  jobs.set(id, job);

  void processImportJob(id, rows, mappings).catch((error) => {
    const failedJob = jobs.get(id);
    if (failedJob) {
      failedJob.status = "failed";
      failedJob.completedAt = new Date().toISOString();
    }
    logger.error("Import job failed", {
      feature: "csv-import",
      action: "process_job",
      importId: id,
      message: error instanceof Error ? error.message : String(error),
    });
  });

  return job;
}

export function getImportJob(id: string): ImportJob | undefined {
  return jobs.get(id);
}
