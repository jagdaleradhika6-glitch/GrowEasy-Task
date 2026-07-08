import { z } from "zod";
import { CRM_FIELDS } from "@/features/csv-import/schemas/import.schema";

export const aiMappingRequestSchema = z.object({
  headers: z.array(z.string()).min(1),
  sampleRows: z.array(z.record(z.string())).max(5),
});

export type AiMappingRequest = z.infer<typeof aiMappingRequestSchema>;

export const aiMappingResponseSchema = z.object({
  mappings: z.array(
    z.object({
      sourceColumn: z.string(),
      targetField: z.enum(CRM_FIELDS).nullable(),
      confidence: z.number().min(0).max(1),
      reasoning: z.string().optional(),
    }),
  ),
});

export type AiMappingResponse = z.infer<typeof aiMappingResponseSchema>;

export type AiMappingSuggestion = AiMappingResponse["mappings"][number];
