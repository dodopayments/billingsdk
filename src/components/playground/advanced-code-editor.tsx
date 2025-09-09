"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FileTabs, FileTab } from "./file-tabs";
import { usePlayground } from "./playground-context";
import { Button } from "@/components/ui/button";
import { Copy, Download, RotateCcw, Save } from "lucide-react";
import { CodeMirrorEditor } from "./codemirror-editor";

export function AdvancedCodeEditor() {
  const { state, updateCode, copyCode, updateStyles } = usePlayground();
  const [activeTab, setActiveTab] = useState("page.tsx");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedUpdateCode = useCallback((code: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      updateCode(code);
    }, 300); 
  }, [updateCode]);

  const tabs: FileTab[] = [
    {
      id: "page.tsx",
      name: "page.tsx",
      content: state.code,
      language: "tsx",
    },
    {
      id: "styles.css",
      name: "styles.css",
      content: state.styles,
      language: "css",
    },
  ];

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content || "";

  // Handle component changes and tab switches
  useEffect(() => {
    if (state.selectedComponent && !isEditing) {
      setEditValue(activeTabContent);
    }
  }, [state.selectedComponent, activeTab, activeTabContent, isEditing]);

  // Reset editing state when component changes
  useEffect(() => {
    if (state.selectedComponent) {
      setIsEditing(false);
    }
  }, [state.selectedComponent]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleEdit = () => {
    setEditValue(activeTabContent);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (activeTab === "page.tsx") {
      // Clear any pending debounced updates and save immediately
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      updateCode(editValue);
    } else if (activeTab === "styles.css") {
      updateStyles(editValue);
    }
    setIsEditing(false);
  };

  const handleEditorChange = (newValue: string) => {
    setEditValue(newValue);
    
    // Auto-save for styles.css, debounce for page.tsx
    if (activeTab === "styles.css") {
      updateStyles(newValue);
    } else if (activeTab === "page.tsx") {
      // Update code immediately for better responsiveness
      updateCode(newValue);
      // Also debounce to avoid excessive re-renders
      debouncedUpdateCode(newValue);
    }
  };

  const handleCancel = () => {
    setEditValue(activeTabContent);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (state.selectedComponent) {
      if (activeTab === "page.tsx") {
        updateCode(state.selectedComponent.defaultCode);
        setEditValue(state.selectedComponent.defaultCode);
      } else if (activeTab === "styles.css") {
        updateStyles("/* Add your custom styles here */");
        setEditValue("/* Add your custom styles here */");
      }
    }
  };

  const handleExport = () => {
    const blob = new Blob([activeTabContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.selectedComponent?.name || "component"}.${activeTab.split('.').pop()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (activeTab === "page.tsx") {
      await copyCode();
    } else {
      await navigator.clipboard.writeText(activeTabContent);
    }
  };

  if (!state.selectedComponent) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-foreground">CODE</h3>
          <p className="text-sm">Select a component to view its code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background" style={{ height: 'calc(100vh - 120px)' }}>
      {/* File Tabs */}
      <FileTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="bg-background"
      />

      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {activeTab === "page.tsx" ? "React Component" : "CSS Styles"}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} variant="default" className="h-7 px-2">
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" onClick={handleCancel} variant="outline" className="h-7 px-2">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={handleEdit} variant="outline" className="h-7 px-2">
                Edit
              </Button>
              <Button size="sm" onClick={handleReset} variant="outline" className="h-7 px-2">
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button size="sm" onClick={handleCopy} variant="outline" className="h-7 px-2">
                <Copy className="h-3 w-3" />
              </Button>
              <Button size="sm" onClick={handleExport} variant="outline" className="h-7 px-2">
                <Download className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto" style={{ height: 'calc(100vh - 200px)' }}>
        <CodeMirrorEditor
          value={isEditing ? editValue : activeTabContent}
          onChange={isEditing ? handleEditorChange : undefined}
          language={activeTab === "page.tsx" ? "tsx" : "css"}
          height="100%"
          readOnly={!isEditing}
        />
      </div>
    </div>
  );
}
