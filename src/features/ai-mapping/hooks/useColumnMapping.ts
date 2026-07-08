"use client";

import { useCallback, useState } from "react";
import type { ColumnMapping } from "@/features/csv-import/schemas/import.schema";
import { CRM_FIELDS } from "@/features/csv-import/schemas/import.schema";
import { fetchColumnMappingsBatched } from "../services/ai-mapping.service";

interface UseColumnMappingOptions {
  headers: string[];
  sampleRows: Record<string, string>[];
}

export function useColumnMapping({ headers, sampleRows }: UseColumnMappingOptions) {
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [isMapping, setIsMapping] = useState(false);
  const [mappingError, setMappingError] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState({ completed: 0, total: 0 });

  const generateMappings = useCallback(async () => {
    if (headers.length === 0) return;

    setIsMapping(true);
    setMappingError(null);

    try {
      const response = await fetchColumnMappingsBatched(
        headers,
        sampleRows,
        (completed, total) => setBatchProgress({ completed, total }),
      );

      setMappings(
        response.mappings.map(({ sourceColumn, targetField, confidence }) => ({
          sourceColumn,
          targetField:
            targetField && (CRM_FIELDS as readonly string[]).includes(targetField)
              ? targetField
              : null,
          confidence,
        })),
      );
    } catch (error) {
      setMappingError(error instanceof Error ? error.message : "AI mapping failed");
    } finally {
      setIsMapping(false);
    }
  }, [headers, sampleRows]);

  const updateMapping = useCallback((sourceColumn: string, targetField: ColumnMapping["targetField"]) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.sourceColumn === sourceColumn ? { ...m, targetField, confidence: 1 } : m,
      ),
    );
  }, []);

  return {
    mappings,
    isMapping,
    mappingError,
    batchProgress,
    generateMappings,
    updateMapping,
    setMappings,
  };
}
