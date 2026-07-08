"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface FeatureErrorFallbackProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function FeatureErrorFallback({
  title,
  description = "Please try again or contact support if the issue persists.",
  onRetry,
}: FeatureErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
