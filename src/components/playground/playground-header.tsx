"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Upload } from "lucide-react";
import { usePlayground } from "./playground-context";
import { componentRegistry } from "./component-registry";
import { PlaygroundLogo } from "./playground-logo";

import Link from "next/link";

export function PlaygroundHeader() {
  const { state, setSelectedComponent, updateCode, updateStyles } = usePlayground();
  const [selectedCategory] = useState<string>("all");

  const categories = [
    { id: "pricing", label: "Pricing Tables" },
    { id: "subscription", label: "Subscription" },
    { id: "usage", label: "Usage & Billing" },
    { id: "ui", label: "UI Components" },
  ];

  const filteredComponents = selectedCategory === "all" 
    ? componentRegistry 
    : componentRegistry.filter(comp => comp.category === selectedCategory);

  const handleComponentChange = (componentId: string) => {
    const component = componentRegistry.find(comp => comp.id === componentId);
    if (component) {
      setSelectedComponent(component);
    }
  };

  const handleImportComponent = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.tsx,.ts,.jsx,.js,.css';
    input.multiple = false;
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (content) {
            // Determine file type based on extension
            const extension = file.name.split('.').pop()?.toLowerCase();
            
            if (extension === 'css') {
              // Import as styles
              updateStyles(content);
              console.log(`Imported CSS file: ${file.name}`);
            } else if (['tsx', 'ts', 'jsx', 'js'].includes(extension || '')) {
              // Import as component code
              updateCode(content);
              console.log(`Imported component file: ${file.name}`);
            } else {
              console.warn(`Unsupported file type: ${extension}`);
              alert(`Unsupported file type: ${extension}. Please select a .tsx, .ts, .jsx, .js, or .css file.`);
            }
          }
        };
        reader.onerror = () => {
          console.error('Error reading file');
          alert('Error reading file. Please try again.');
        };
        reader.readAsText(file);
      }
    };
    
    // Trigger file selection
    input.click();
  };

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Play Button, Logo, Component Selector */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <PlaygroundLogo />
          </Link>

          {/* Component Selector */}
          <Select value={state.selectedComponent?.id || ""} onValueChange={handleComponentChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a component">
                {state.selectedComponent?.name || "Select a component"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-64 min-w-64 max-h-96 overflow-y-auto">
              {categories.map(category => (
                <div key={category.id}>
                  <div className="px-3 py-2 text-sm font-semibold text-foreground bg-muted/50 border-b border-border">
                    {category.label}
                  </div>
                  {filteredComponents
                    .filter(comp => comp.category === category.id || category.id === "all")
                    .map(component => (
                      <SelectItem 
                        key={component.id} 
                        value={component.id}
                        className="px-3 py-2"
                      >
                        <span className="font-medium text-sm">{component.name}</span>
                      </SelectItem>
                    ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right Section - Import Button */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleImportComponent}
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            <span className="text-sm">IMPORT</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
