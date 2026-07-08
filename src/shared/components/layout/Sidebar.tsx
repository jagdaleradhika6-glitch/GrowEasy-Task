"use client";

import { LayoutDashboard, Upload, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

const navItems = [
  { href: "/", label: "Import", icon: Upload },
  { href: "#", label: "Contacts", icon: Users },
  { href: "#", label: "Dashboard", icon: LayoutDashboard },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!isOpen && !isDesktop) return null;

  return (
    <>
      {!isDesktop && isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card",
          "lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-200",
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="text-lg font-bold tracking-tight">Grow CRM</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
