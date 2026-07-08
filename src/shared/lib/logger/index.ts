export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  feature?: string;
  action?: string;
  importId?: string;
  batchIndex?: number;
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

function emit(entry: LogEntry) {
  const payload = JSON.stringify(entry);
  switch (entry.level) {
    case "error":
      console.error(payload);
      break;
    case "warn":
      console.warn(payload);
      break;
    default:
      console.log(payload);
  }
}

export const logger = {
  debug(message: string, context?: LogContext) {
    emit({ level: "debug", message, timestamp: new Date().toISOString(), context });
  },
  info(message: string, context?: LogContext) {
    emit({ level: "info", message, timestamp: new Date().toISOString(), context });
  },
  warn(message: string, context?: LogContext) {
    emit({ level: "warn", message, timestamp: new Date().toISOString(), context });
  },
  error(message: string, context?: LogContext) {
    emit({ level: "error", message, timestamp: new Date().toISOString(), context });
  },
};
