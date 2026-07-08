"use client";

import { Search } from "lucide-react";

interface DataTableToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DataTableToolbar({
  value,
  onChange,
  placeholder = "Search…",
}: DataTableToolbarProps) {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
