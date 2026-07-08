"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";
import { FeatureErrorFallback } from "@/shared/components/error-boundary/FeatureErrorFallback";
import { Button } from "@/shared/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Spinner } from "@/shared/components/ui/Spinner";
import { ColumnMappingTable } from "@/features/ai-mapping/components/ColumnMappingTable";
import { useColumnMapping } from "@/features/ai-mapping/hooks/useColumnMapping";
import { useCsvParser } from "../hooks/useCsvParser";
import { useImportJob } from "../hooks/useImportJob";
import { useImportPreview } from "../hooks/useImportPreview";
import type { ImportStep } from "../types";
import { FileUploadZone } from "./FileUploadZone";
import { ImportProgress } from "./ImportProgress";
import { PreviewTable } from "./PreviewTable";
import { ValidationSummary } from "./ValidationSummary";

const STEPS: ImportStep[] = ["upload", "mapping", "preview", "importing", "complete"];

function StepIndicator({ current }: { current: ImportStep }) {
  const currentIndex = STEPS.indexOf(current);

  return (
    <div className="flex flex-wrap gap-2">
      {STEPS.slice(0, 4).map((step, index) => (
        <div
          key={step}
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
            index <= currentIndex
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}

export function ImportWizard() {
  const [step, setStep] = useState<ImportStep>("upload");
  const { parsedCsv, isParsing, parseError, parseFile, reset: resetParser } = useCsvParser();

  const sampleRows = parsedCsv?.rows.slice(0, 5) ?? [];
  const {
    mappings,
    isMapping,
    mappingError,
    batchProgress,
    generateMappings,
    updateMapping,
  } = useColumnMapping({
    headers: parsedCsv?.headers ?? [],
    sampleRows,
  });

  const { mappedRows, validCount, invalidCount, totalCount } = useImportPreview(
    parsedCsv?.rows ?? [],
    mappings,
  );

  const { job, progress, isImporting, importError, startImport, reset: resetImport } =
    useImportJob();
        


    const [hasGenerated, setHasGenerated] = useState(false);

useEffect(() => {
  if (
    step === "mapping" &&
    parsedCsv &&
    !hasGenerated
  ) {
    setHasGenerated(true);
    void generateMappings();
  }
}, [step, parsedCsv, hasGenerated, generateMappings]);

  useEffect(() => {
    if (job?.status === "completed") setStep("complete");
    if (job?.status === "failed") setStep("preview");
  }, [job?.status]);

  const handleFileSelect = useCallback(
    async (file: File) => {
      const result = await parseFile(file);
      if (result) setStep("mapping");
    },
    [parseFile],
  );

  const handleImport = useCallback(async () => {
    if (!parsedCsv || mappings.length === 0) return;

    setStep("importing");
    try {
      await startImport({
        rows: parsedCsv.rows,
        mappings,
        fileName: parsedCsv.fileName,
      });
    } catch {
      setStep("preview");
    }
  }, [parsedCsv, mappings, startImport]);

 const handleReset = useCallback(() => {
  resetParser();
  resetImport();
  setHasGenerated(false);
  setStep("upload");
}, [resetParser, resetImport]);




  const hasRequiredMapping = mappings.some((m) => m.targetField === "email");

  return (
    <ErrorBoundary feature="csv-import">
      <div className="mx-auto max-w-5xl space-y-6">
        <StepIndicator current={step} />

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upload CSV</CardTitle>
                  <CardDescription>
                    Import contacts from a spreadsheet export. AI will suggest field mappings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploadZone onFileSelect={handleFileSelect} isLoading={isParsing} />
                  {parseError && (
                    <p className="mt-4 text-sm text-destructive">{parseError}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "mapping" && (
            <motion.div
              key="mapping"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle>Column Mapping</CardTitle>
                    <CardDescription>
                      {parsedCsv?.fileName} — {parsedCsv?.totalRows} rows detected
                    </CardDescription>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => void generateMappings()}
                    isLoading={isMapping}
                  >
                    <Sparkles className="h-4 w-4" />
                    Re-run AI
                  </Button>
                </CardHeader>
                <CardContent>
                  {isMapping ? (
                    <div className="py-12">
                      <Spinner
                        label={
                          batchProgress.total > 1
                            ? `Analyzing columns (${batchProgress.completed}/${batchProgress.total})…`
                            : "Analyzing columns with AI…"
                        }
                      />
                    </div>
                  ) : mappingError ? (
                    <FeatureErrorFallback
                      title="Mapping failed"
                      description={mappingError}
                      onRetry={() => void generateMappings()}
                    />
                  ) : (
                    <ColumnMappingTable
                      mappings={mappings}
                      onMappingChange={updateMapping}
                    />
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleReset}>
                  <ArrowLeft className="h-4 w-4" />
                  Start over
                </Button>
                <Button
                  onClick={() => setStep("preview")}
                  disabled={!hasRequiredMapping || isMapping}
                >
                  Preview import
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              {!hasRequiredMapping && !isMapping && (
                <p className="text-sm text-warning">Map at least one column to Email to continue.</p>
              )}
            </motion.div>
          )}

          {(step === "preview" || step === "importing") && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-4"
            >
              <ValidationSummary
                validCount={validCount}
                invalidCount={invalidCount}
                totalCount={totalCount}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>Review mapped data before importing.</CardDescription>
                </CardHeader>
                <CardContent>
                  <PreviewTable rows={mappedRows} />
                </CardContent>
              </Card>

              {(step === "importing" || isImporting) && (
                <ImportProgress job={job} progress={progress} isImporting={isImporting} />
              )}

              {importError && (
                <FeatureErrorFallback
                  title="Import failed"
                  description={importError}
                  onRetry={() => void handleImport()}
                />
              )}

              {step === "preview" && (
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep("mapping")}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={() => void handleImport()} disabled={validCount === 0}>
                    Import {validCount} contacts
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {step === "complete" && job && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ImportProgress job={job} progress={100} isImporting={false} />
              <div className="mt-4 flex justify-end">
                <Button onClick={handleReset}>Import another file</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
