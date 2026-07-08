"use client";

import { Menu } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface TopBarProps {
  onMenuClick: () => void;
  title: string;
  description?: string;
}

export function TopBar({ onMenuClick, title, description }: TopBarProps) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-border bg-card px-4 py-4 lg:px-8">
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="mt-0.5 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">{title}</h1>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </header>
  );
}
