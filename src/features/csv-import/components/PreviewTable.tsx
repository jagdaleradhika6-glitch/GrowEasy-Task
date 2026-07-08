"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "@/shared/components/table/DataTable";
import { Badge } from "@/shared/components/ui/Badge";
import type { MappedRow } from "../types";

interface PreviewTableProps {
  rows: MappedRow[];
  isLoading?: boolean;
}

export function PreviewTable({ rows, isLoading }: PreviewTableProps) {
  const columns = useMemo<ColumnDef<MappedRow>[]>(
    () => [
      {
        accessorKey: "rowIndex",
        header: "Row",
        cell: ({ row }) => row.original.rowIndex + 1,
      },
      {
        id: "email",
        header: "Email",
        cell: ({ row }) => String(row.original.contact.email ?? "—"),
      },
      {
        id: "name",
        header: "Name",
        cell: ({ row }) => {
          const first = row.original.contact.firstName ?? "";
          const last = row.original.contact.lastName ?? "";
          return `${first} ${last}`.trim() || "—";
        },
      },
      {
        id: "company",
        header: "Company",
        cell: ({ row }) => String(row.original.contact.company ?? "—"),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) =>
          row.original.isValid ? (
            <Badge variant="success">Valid</Badge>
          ) : (
            <Badge variant="destructive">
              {row.original.errors[0]?.message ?? "Invalid"}
            </Badge>
          ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={rows}
      isLoading={isLoading}
      emptyMessage="No preview data available."
    />
  );
}
