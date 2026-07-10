import { z } from "zod";

export const CRM_FIELDS = [
  "created_at",
  "name",
  "email",
  "country_code",
  "mobile_without_country_code",
  "company",
  "city",
  "state",
  "country",
  "lead_owner",
  "crm_status",
  "crm_note",
  "data_source",
  "possession_time",
  "description",
] as const;

export type CrmField = (typeof CRM_FIELDS)[number];

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  country_code: z.string().optional(),
  mobile_without_country_code: z.string().optional(),
  company: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  lead_owner: z.string().optional(),
  crm_status: z.string().optional(),
  crm_note: z.string().optional(),
  created_at: z.string().optional(),
  data_source: z.string().optional(),
  possession_time: z.string().optional(),
  description: z.string().optional(),
});

export type Contact = z.infer<typeof contactSchema>;

export const columnMappingSchema = z.object({
  sourceColumn: z.string(),
  targetField: z.enum(CRM_FIELDS).nullable(),
  confidence: z.number().min(0).max(1),
});

export type ColumnMapping = z.infer<typeof columnMappingSchema>;

export const importRequestSchema = z.object({
  rows: z.array(z.record(z.string())),
  mappings: z.array(columnMappingSchema),
  fileName: z.string(),
});

export type ImportRequest = z.infer<typeof importRequestSchema>;

export const parsedCsvSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.record(z.string())),
  fileName: z.string(),
  totalRows: z.number(),
});

export type ParsedCsv = z.infer<typeof parsedCsvSchema>;
