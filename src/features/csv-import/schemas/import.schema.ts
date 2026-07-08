import { z } from "zod";

export const CRM_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "title",
  "website",
  "address",
  "city",
  "state",
  "country",
  "postalCode",
  "tags",
  "notes",
] as const;

export type CrmField = (typeof CRM_FIELDS)[number];

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
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
