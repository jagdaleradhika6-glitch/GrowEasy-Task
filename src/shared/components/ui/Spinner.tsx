import { cn } from "@/shared/lib/cn";

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)} role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
