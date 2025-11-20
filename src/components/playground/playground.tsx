"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { PlaygroundHeader } from "./playground-header";
import { CodePanel } from "./code-panel";
import { PreviewPanel } from "./preview-panel";
import { PlaygroundProvider, usePlayground } from "./playground-context";
import { discoverComponent } from "./auto-discovery";

import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";

function PlaygroundContent() {
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [showPreviewPanel, setShowPreviewPanel] = useState(true);
  const [splitPercent, setSplitPercent] = useState(50); // Code panel width percent
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const { setSelectedComponent } = usePlayground();

  const toggleCodePanel = () => setShowCodePanel(!showCodePanel);
  const togglePreviewPanel = () => setShowPreviewPanel(!showPreviewPanel);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = (x / rect.width) * 100;
      const clamped = Math.min(70, Math.max(30, percent));
      setSplitPercent(clamped);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Handle component parameter from URL for direct-deep linking from docs
  useEffect(() => {
    const param = searchParams.get("component");

    const trySelect = async (raw: string) => {
      const componentParam = decodeURIComponent(raw).trim();

      // Extract slug from path (e.g., "pricing-table/pricing-table-four" -> "pricing-table-four")
      const slug = componentParam
        .toLowerCase()
        .replaceAll(" ", "-")
        .split("/")
        .filter(Boolean)
        .pop();

      if (!slug) return;

      // Use auto-discovery to load the component
      const component = await discoverComponent(slug);
      if (component) {
        setSelectedComponent(component);
      }
    };

    if (param) {
      void trySelect(param);
      return;
    }

    // If no explicit param, try infer from referrer (docs page)
    if (typeof document !== "undefined" && document.referrer) {
      try {
        const url = new URL(document.referrer);
        const parts = url.pathname.split("/").filter(Boolean);
        const idx = parts.findIndex((p) => p === "docs");
        const compIdx = parts.findIndex((p) => p === "components");
        if (idx !== -1 && compIdx !== -1 && compIdx + 1 < parts.length) {
          const slugPath = parts.slice(compIdx + 1).join("/");
          void trySelect(slugPath);
        }
      } catch {
        // ignore parsing failures
      }
    }
  }, [searchParams, setSelectedComponent]);

  return (
    <div className="bg-background text-foreground flex h-screen flex-col">
      {/* Header */}
      <PlaygroundHeader />

      {/* Panel Controls */}
      <div className="border-border bg-muted/50 flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleCodePanel}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              showCodePanel && "text-foreground bg-accent",
            )}
          >
            <PanelLeft className="mr-1 h-4 w-4" />
            Code
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={togglePreviewPanel}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              showPreviewPanel && "text-foreground bg-accent",
            )}
          >
            <PanelRight className="mr-1 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Main Content - Responsive Split (Resizable) */}
      <div ref={containerRef} className="relative flex flex-1 overflow-hidden">
        {/* Left Panel - CODE */}
        {showCodePanel && (
          <div
            className={cn("border-border border-r")}
            style={{
              width: showPreviewPanel ? `${splitPercent}%` : "100%",
            }}
          >
            <CodePanel />
          </div>
        )}

        {/* Right Panel - PREVIEW */}
        {showPreviewPanel && (
          <div
            className={cn()}
            style={{
              width: showCodePanel ? `${100 - splitPercent}%` : "100%",
            }}
          >
            <PreviewPanel />
          </div>
        )}

        {/* Drag handle (only when both panels visible) */}
        {showCodePanel && showPreviewPanel && (
          <div
            onMouseDown={() => setIsDragging(true)}
            className={cn(
              "absolute top-0 bottom-0 z-10 w-2 cursor-col-resize",
              isDragging && "bg-primary/10",
            )}
            style={{
              left: `${splitPercent}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="bg-border hover:bg-primary mx-auto h-full w-px" />
          </div>
        )}
      </div>
    </div>
  );
}

export function Playground() {
  return (
    <PlaygroundProvider>
      <PlaygroundContent />
    </PlaygroundProvider>
  );
}
