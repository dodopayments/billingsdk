"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { PlaygroundHeader } from "./playground-header";
import { CodePanel } from "./code-panel";
import { PreviewPanel } from "./preview-panel";
import { PlaygroundProvider, usePlayground } from "./playground-context";
import { componentRegistry } from "./component-registry";
import type { ComponentConfig } from "./types";

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
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Handle component parameter from URL for direct-deep linking from docs
  useEffect(() => {
    const param = searchParams.get('component');
    const trySelect = async (raw: string) => {
      const componentParam = decodeURIComponent(raw).trim();
      const byRegistry = componentRegistry.find((comp) =>
        comp.name === componentParam ||
        comp.id === componentParam.toLowerCase() ||
        comp.name.toLowerCase() === componentParam.toLowerCase()
      );
      if (byRegistry) {
        setSelectedComponent(byRegistry);
        return;
      }

      // Global fallback: dynamically load billingsdk component by slug
      const slug = componentParam
        .toLowerCase()
        .replaceAll(' ', '-')
        .split('/')
        .filter(Boolean)
        .pop();
      if (!slug) return;

      const pascal = slug
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
      const exportName = pascal; // e.g., PricingTableFour
      const importPath = `@/components/billingsdk/${slug}`;

      try {
        const mod: any = await import(/* @vite-ignore */ importPath);
        const Comp = mod[exportName] || mod.default;
        if (!Comp) return;

        // Default fallback snippet
        let inferredCode = `<${exportName} />`;

        // Try to fetch usage snippet from public runtime registry (no code edits required)
        try {
          const res = await fetch(`/r/${slug}.json`);
          if (res.ok) {
            const text = await res.text();
            const tag = exportName;
            const selfClosing = new RegExp(`<${tag}[^>]*?/>`, 's');
            const wrapped = new RegExp(`<${tag}[^>]*?>[\n\s\S]*?<\/${tag}>`, 's');
            const match = text.match(selfClosing) || text.match(wrapped);
            if (match) {
              inferredCode = match[0];
            }
          }
        } catch {
          // ignore fetch failures, keep fallback
        }

        const dynamicConfig: ComponentConfig = {
          id: slug,
          name: exportName.replace(/([A-Z])/g, ' $1').trim(),
          description: "Dynamically loaded component",
          category: "dynamic",
          component: Comp,
          imports: [importPath],
          defaultCode: inferredCode,
          defaultProps: {},
        };
        setSelectedComponent(dynamicConfig);
      } catch {
        // ignore if dynamic import fails
      }
    };

    if (param) {
      void trySelect(param);
      return;
    }

    // If no explicit param, try infer from referrer (docs page)
    if (typeof document !== 'undefined' && document.referrer) {
      try {
        const url = new URL(document.referrer);
        const parts = url.pathname.split('/').filter(Boolean);
        const idx = parts.findIndex((p) => p === 'docs');
        const compIdx = parts.findIndex((p) => p === 'components');
        if (idx !== -1 && compIdx !== -1 && compIdx + 1 < parts.length) {
          const slugPath = parts.slice(compIdx + 1).join('/');
          void trySelect(slugPath);
        }
      } catch {
        // ignore parsing failures
      }
    }
  }, [searchParams, setSelectedComponent]);

  return (
      <div className="flex flex-col bg-background text-foreground h-screen">
        {/* Header */}
        <PlaygroundHeader />
        
        {/* Panel Controls */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleCodePanel}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                showCodePanel && "text-foreground bg-accent"
              )}
            >
              <PanelLeft className="h-4 w-4 mr-1" />
              Code
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={togglePreviewPanel}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                showPreviewPanel && "text-foreground bg-accent"
              )}
            >
              <PanelRight className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>
        
        {/* Main Content - Responsive Split (Resizable) */}
        <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
          {/* Left Panel - CODE */}
          {showCodePanel && (
            <div
              className={cn(
                "border-r border-border"
              )}
              style={{
                width: showPreviewPanel ? `${splitPercent}%` : '100%'
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
                width: showCodePanel ? `${100 - splitPercent}%` : '100%'
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
                "absolute top-0 bottom-0 w-2 cursor-col-resize z-10",
                isDragging && "bg-primary/10"
              )}
              style={{
                left: `${splitPercent}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="h-full w-px bg-border hover:bg-primary mx-auto" />
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
