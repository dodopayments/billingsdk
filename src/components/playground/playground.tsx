"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PlaygroundHeader } from "./playground-header";
import { CodePanel } from "./code-panel";
import { PreviewPanel } from "./preview-panel";
import { PlaygroundProvider, usePlayground } from "./playground-context";
import { componentRegistry } from "./component-registry";

import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";

function PlaygroundContent() {
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [showPreviewPanel, setShowPreviewPanel] = useState(true);
  const searchParams = useSearchParams();
  const { setSelectedComponent } = usePlayground();

  const toggleCodePanel = () => setShowCodePanel(!showCodePanel);
  const togglePreviewPanel = () => setShowPreviewPanel(!showPreviewPanel);

  // Handle component parameter from URL
  useEffect(() => {
    const componentParam = searchParams.get('component');
    if (componentParam) {
      // Find the component in the registry by name or id
      const component = componentRegistry.find(comp => 
        comp.name === componentParam || 
        comp.id === componentParam.toLowerCase() ||
        comp.name.toLowerCase() === componentParam.toLowerCase()
      );
      if (component) {
        // Small delay to ensure context is ready
        setTimeout(() => {
          setSelectedComponent(component);
        }, 100);
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
        
        {/* Main Content - Responsive Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - CODE */}
          {showCodePanel && (
            <div className={cn(
              "border-r border-border",
              showPreviewPanel ? "w-1/2" : "w-full"
            )}>
              <CodePanel />
            </div>
          )}

          {/* Right Panel - PREVIEW */}
          {showPreviewPanel && (
            <div className={cn(
              showCodePanel ? "w-1/2" : "w-full"
            )}>
              <PreviewPanel />
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
