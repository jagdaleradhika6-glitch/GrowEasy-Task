"use client";

import { useCallback, useState } from "react";
import { parseCsvFile } from "../services/csv-parser.service";
import type { ParsedCsv } from "../schemas/import.schema";

interface UseCsvParserReturn {
  parsedCsv: ParsedCsv | null;
  isParsing: boolean;
  parseError: string | null;
  parseFile: (file: File) => Promise<ParsedCsv | null>;
  reset: () => void;
}

export function useCsvParser(): UseCsvParserReturn {
  const [parsedCsv, setParsedCsv] = useState<ParsedCsv | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const parseFile = useCallback(async (file: File) => {
    setIsParsing(true);
    setParseError(null);

    try {
      const result = await parseCsvFile(file);
      setParsedCsv(result);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to parse CSV";
      setParseError(message);
      return null;
    } finally {
      setIsParsing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setParsedCsv(null);
    setParseError(null);
  }, []);

  return { parsedCsv, isParsing, parseError, parseFile, reset };
}
