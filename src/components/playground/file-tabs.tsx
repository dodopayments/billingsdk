"use client";

import { cn } from "@/lib/utils";

export interface FileTab {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface FileTabsProps {
  tabs: FileTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function FileTabs({ tabs, activeTab, onTabChange, className }: FileTabsProps) {
  return (
    <div className={cn("flex border-b border-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === tab.id
              ? "border-primary text-foreground bg-muted/50"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
