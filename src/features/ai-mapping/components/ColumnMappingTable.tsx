"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "@/shared/components/table/DataTable";
import { CRM_FIELDS, type ColumnMapping } from "@/features/csv-import/schemas/import.schema";
import { MappingConfidenceBadge } from "./MappingConfidenceBadge";

interface ColumnMappingTableProps {
  mappings: ColumnMapping[];
  onMappingChange: (sourceColumn: string, targetField: ColumnMapping["targetField"]) => void;
  isLoading?: boolean;
}

export function ColumnMappingTable({
  mappings,
  onMappingChange,
  isLoading,
}: ColumnMappingTableProps) {
  const columns = useMemo<ColumnDef<ColumnMapping>[]>(
    () => [
      {
        accessorKey: "sourceColumn",
        header: "CSV Column",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.sourceColumn}</span>
        ),
      },
      {
        accessorKey: "targetField",
        header: "CRM Field",
        cell: ({ row }) => (
          <select
            value={row.original.targetField ?? ""}
            onChange={(e) =>
              onMappingChange(
                row.original.sourceColumn,
                (e.target.value || null) as ColumnMapping["targetField"],
              )
            }
            className="h-9 w-full max-w-[200px] rounded-lg border border-border bg-card px-2 text-sm outline-none focus:border-primary"
          >
            <option value="">— Skip —</option>
            {CRM_FIELDS.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        ),
      },
      {
        accessorKey: "confidence",
        header: "Confidence",
        cell: ({ row }) => (
          <MappingConfidenceBadge confidence={row.original.confidence} />
        ),
      },
    ],
    [onMappingChange],
  );

  return (
    <DataTable
      columns={columns}
      data={mappings}
      isLoading={isLoading}
      emptyMessage="Upload a CSV to generate column mappings."
    />
  );
}
