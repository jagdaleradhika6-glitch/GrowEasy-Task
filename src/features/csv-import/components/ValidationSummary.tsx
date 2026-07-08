"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";

interface ValidationSummaryProps {
  validCount: number;
  invalidCount: number;
  totalCount: number;
}

export function ValidationSummary({ validCount, invalidCount, totalCount }: ValidationSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Validation Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="text-2xl font-semibold">{validCount}</p>
              <p className="text-xs text-muted-foreground">Valid rows</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-2xl font-semibold">{invalidCount}</p>
              <p className="text-xs text-muted-foreground">Invalid rows</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <Badge variant="outline">{totalCount} total</Badge>
            <p className="text-sm text-muted-foreground">Only valid rows will be imported</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
