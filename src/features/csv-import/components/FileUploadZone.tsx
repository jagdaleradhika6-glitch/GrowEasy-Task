"use client";

import { motion } from "framer-motion";
import { FileSpreadsheet, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  accept?: string;
}

export function FileUploadZone({
  onFileSelect,
  isLoading,
  accept = ".csv,text/csv",
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || isLoading) return;
      onFileSelect(file);
    },
    [isLoading, onFileSelect],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      handleFile(event.dataTransfer.files[0]);
    },
    [handleFile],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed p-10 transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50",
        isLoading && "pointer-events-none opacity-60",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        {isLoading ? (
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <Upload className="h-6 w-6 text-primary" />
        )}
      </div>
      <div className="text-center">
        <p className="font-medium">Drop your CSV here or click to browse</p>
        <p className="mt-1 text-sm text-muted-foreground">Supports .csv files up to 10MB</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FileSpreadsheet className="h-4 w-4" />
        Contacts, leads, or custom exports
      </div>
    </motion.div>
  );
}
