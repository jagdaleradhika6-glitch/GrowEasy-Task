import Papa from "papaparse";
import { logger } from "@/shared/lib/logger";
import { parsedCsvSchema, type ParsedCsv } from "../schemas/import.schema";

export async function parseCsvFile(file: File): Promise<ParsedCsv> {
  return new Promise((resolve, reject) => {
    logger.info("Parsing CSV file", { feature: "csv-import", action: "parse", fileName: file.name });

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          const message = results.errors.map((e) => e.message).join("; ");
          logger.error("CSV parse failed", { feature: "csv-import", action: "parse", message });
          reject(new Error(message));
          return;
        }

        const headers = results.meta.fields ?? [];
        const rows = results.data.filter((row) =>
          Object.values(row).some((value) => value?.trim()),
        );

        const parsed = parsedCsvSchema.parse({
          headers,
          rows,
          fileName: file.name,
          totalRows: rows.length,
        });

        logger.info("CSV parsed successfully", {
          feature: "csv-import",
          action: "parse",
          totalRows: parsed.totalRows,
        });

        resolve(parsed);
      },
      error: (error) => {
        logger.error("CSV parse error", { feature: "csv-import", action: "parse", message: error.message });
        reject(error);
      },
    });
  });
}
