"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/shared/components/ui/Progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import type { ImportJob } from "@/shared/types/api";

interface ImportProgressProps {
  job: ImportJob | null;
  progress: number;
  isImporting: boolean;
}

export function ImportProgress({ job, progress, isImporting }: ImportProgressProps) {
  if (!isImporting && !job) return null;

  const isComplete = job?.status === "completed";
  const isFailed = job?.status === "failed";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {isComplete && <CheckCircle2 className="h-5 w-5 text-success" />}
            {isFailed && <XCircle className="h-5 w-5 text-destructive" />}
            {isImporting ? "Importing contacts…" : isComplete ? "Import complete" : "Import failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isImporting && <Progress value={progress} />}
          {job && (
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Processed</p>
                <p className="font-medium">
                  {job.processedRows} / {job.totalRows}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Imported</p>
                <p className="font-medium text-success">{job.successCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Errors</p>
                <p className="font-medium text-destructive">{job.errorCount}</p>
              </div>
            </div>
          )}
          {job && job.errors.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-border p-3 text-xs">
              {job.errors.slice(0, 10).map((err) => (
                <p key={`${err.rowIndex}-${err.message}`} className="text-destructive">
                  Row {err.rowIndex + 1}: {err.message}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
