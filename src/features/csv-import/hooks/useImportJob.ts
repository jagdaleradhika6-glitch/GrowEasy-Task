"use client";

import { useCallback, useState } from "react";
import { useOptimisticMutation } from "@/shared/hooks/useOptimisticMutation";
import type { ImportJob } from "@/shared/types/api";
import { pollImportJob, submitImport } from "../services/import.service";
import type { ImportRequest } from "../schemas/import.schema";

const IMPORT_QUERY_KEY = ["import-job"] as const;

export function useImportJob() {
  const [job, setJob] = useState<ImportJob | null>(null);
  const [progress, setProgress] = useState(0);

  const mutation = useOptimisticMutation<ImportJob, ImportRequest>(
    async (request) => {
      const submitted = await submitImport(request);
      setJob(submitted);
      return pollImportJob(submitted.id, (updated) => {
        setJob(updated);
        setProgress(
          updated.totalRows > 0
            ? (updated.processedRows / updated.totalRows) * 100
            : 0,
        );
      });
    },
    {
      queryKey: IMPORT_QUERY_KEY,
      updateFn: (current, request) => ({
        id: current?.id ?? "pending",
        status: "processing",
        totalRows: request.rows.length,
        processedRows: 0,
        successCount: 0,
        errorCount: 0,
        createdAt: new Date().toISOString(),
        errors: [],
      }),
    },
  );

  const reset = useCallback(() => {
    setJob(null);
    setProgress(0);
    mutation.reset();
  }, [mutation]);

  return {
    job,
    progress,
    isImporting: mutation.isPending,
    importError: mutation.error?.message ?? null,
    startImport: mutation.mutateAsync,
    reset,
  };
}
