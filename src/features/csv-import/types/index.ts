export type { Contact, ColumnMapping, ImportRequest, ParsedCsv, CrmField } from "../schemas/import.schema";
export { CRM_FIELDS } from "../schemas/import.schema";

export type ImportStep = "upload" | "mapping" | "preview" | "importing" | "complete";

export interface ValidationResult {
  rowIndex: number;
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
  data?: Record<string, unknown>;
}

export interface MappedRow {
  rowIndex: number;
  contact: Record<string, unknown>;
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
}
