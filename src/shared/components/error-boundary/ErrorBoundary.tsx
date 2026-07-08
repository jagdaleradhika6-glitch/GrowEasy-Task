"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { logger } from "@/shared/lib/logger";
import { Button } from "@/shared/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  feature?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("Unhandled render error", {
      feature: this.props.feature,
      action: "error_boundary",
      message: error.message,
      componentStack: info.componentStack,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <Button variant="secondary" onClick={this.handleReset}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
