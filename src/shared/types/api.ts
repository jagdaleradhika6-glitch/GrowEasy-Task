export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type ImportStatus = "pending" | "processing" | "completed" | "failed";

export interface ImportJob {
  id: string;
  status: ImportStatus;
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  createdAt: string;
  completedAt?: string;
  errors: ImportRowError[];
}

export interface ImportRowError {
  rowIndex: number;
  field?: string;
  message: string;
}
