"use client";

import { useMemo } from "react";
import type { ColumnMapping } from "../schemas/import.schema";
import { toMappedRows } from "../services/validation.service";

export function useImportPreview(
  rows: Record<string, string>[],
  mappings: ColumnMapping[],
) {
  const mappedRows = useMemo(
    () => toMappedRows(rows, mappings),
    [rows, mappings],
  );

  const validCount = mappedRows.filter((row) => row.isValid).length;
  const invalidCount = mappedRows.length - validCount;

  return { mappedRows, validCount, invalidCount, totalCount: mappedRows.length };
}
