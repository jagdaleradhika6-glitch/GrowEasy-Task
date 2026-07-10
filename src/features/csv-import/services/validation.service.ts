import { contactSchema, type ColumnMapping, type Contact } from "../schemas/import.schema";
import type { MappedRow, ValidationResult } from "../types";

function applyMapping(
  row: Record<string, string>,
  mappings: ColumnMapping[],
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const mapping of mappings) {
    if (!mapping.targetField) continue;
    const raw = row[mapping.sourceColumn]?.trim() ?? "";
    mapped[mapping.targetField] = raw || undefined;
  }

  return mapped;
}

export function validateMappedRows(
  rows: Record<string, string>[],
  mappings: ColumnMapping[],
): ValidationResult[] {
  return rows.map((row, rowIndex) => {
    const mapped = applyMapping(row, mappings);
    const result = contactSchema.safeParse(mapped);

    if (result.success) {
      return { rowIndex, isValid: true, errors: [], data: result.data };
    }

    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "unknown",
      message: issue.message,
    }));

    return { rowIndex, isValid: false, errors, data: mapped };
  });
}

export function toMappedRows(
  rows: Record<string, string>[],
  mappings: ColumnMapping[],
): MappedRow[] {
  return validateMappedRows(rows, mappings).map((result) => ({
    rowIndex: result.rowIndex,
    contact: result.data ?? {},
    isValid: result.isValid,
    errors: result.errors,
  }));
}

export function getValidContacts(mappedRows: MappedRow[]): Contact[] {
  return mappedRows
    .filter((row) => row.isValid)
    .map((row) => contactSchema.parse(row.contact));
}
