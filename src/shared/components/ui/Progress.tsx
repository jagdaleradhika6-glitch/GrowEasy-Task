import { cn } from "@/shared/lib/cn";

interface ProgressProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function Progress({ value, className, showLabel = true }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground">{Math.round(clamped)}% complete</p>
      )}
    </div>
  );
}
