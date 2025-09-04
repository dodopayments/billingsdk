"use client";

import React, { useEffect, useState } from "react";
import { usePlayground } from "./playground-context";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { RefreshCw, Maximize2, Minimize2, Monitor, Smartphone, Palette, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { themes, applyScopedTheme } from "@/lib/themes";

type ViewportSize = "desktop" | "mobile";



function ScopedThemeWrapper({ 
  children, 
  theme, 
  isDark 
}: { 
  children: React.ReactNode; 
  theme: typeof themes[0]; 
  isDark: boolean; 
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (ref.current) {
      const element = ref.current;

      const allVars = {...theme.cssVars.light, ...theme.cssVars.dark};
      Object.keys(allVars).forEach(key => {
        element.style.removeProperty(key);
      });

      element.style.removeProperty('font-family');
      element.style.removeProperty('--font-family');
      element.style.removeProperty('--font-mono');
      
      applyScopedTheme(element, theme, isDark);
    }
  }, [theme, isDark]);
  
  return (
    <div 
      ref={ref}
      className={cn(isDark ? "dark" : "", "h-full w-full flex flex-col")}
      style={{
        backgroundColor: isDark ? theme.cssVars.dark['--background'] : theme.cssVars.light['--background'],
        color: isDark ? theme.cssVars.dark['--foreground'] : theme.cssVars.light['--foreground'],
        width: '100%'
      }}
    >
      {children}
    </div>
  );
}

function PreviewPanelContent() {
  const { state } = usePlayground();
  const { previewDarkMode, currentTheme, setTheme, setPreviewDarkMode } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  useEffect(() => {
    if (state.selectedComponent) {
      setComponent(() => state.selectedComponent!.component);
      setError(null);
    }
  }, [state.selectedComponent]);

  
  useEffect(() => {
    
    let styleElement = document.getElementById('playground-custom-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'playground-custom-styles';
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = state.styles;
  }, [state.styles]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setRefreshKey(prev => prev + 1);
    if (state.selectedComponent) {
      setComponent(() => state.selectedComponent!.component);
    }
    
    setIsRefreshing(false);
  };

  const getViewportWidth = () => {
    switch (viewportSize) {
      case "mobile": return "375px";
      default: return "100%";
    }
  };

  const handleThemeSelect = (theme: typeof themes[0]) => {
    setTheme(theme);
    setIsThemeMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setPreviewDarkMode(!previewDarkMode);
  };

  if (!state.selectedComponent) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground dark">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-foreground">PREVIEW</h3>
          <p className="text-sm">Select a component to see it in action</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-full flex flex-col bg-background dark",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Live Preview</span>
          <div className="flex items-center gap-1 ml-2">
            {viewportSize === "mobile" ? (
              <Smartphone className="h-3 w-3 text-muted-foreground" />
            ) : (
              <Monitor className="h-3 w-3 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground capitalize">{viewportSize}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          
          <div className="flex items-center gap-1 mr-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewportSize("mobile")}
              className={cn(
                "h-8 w-8 p-0",
                viewportSize === "mobile" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewportSize("desktop")}
              className={cn(
                "h-8 w-8 p-0",
                viewportSize === "desktop" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>

          
          <div className="flex items-center gap-1 mr-2">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleDarkMode}
              className="h-8 w-8 p-0"
            >
              {previewDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <DropdownMenu open={isThemeMenuOpen} onOpenChange={setIsThemeMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  Themes
                </div>
                <DropdownMenuSeparator />
                {themes.map((theme) => (
                  <DropdownMenuItem
                    key={theme.name}
                    onClick={() => handleThemeSelect(theme)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{theme.label}</span>
                    </div>
                    {currentTheme.name === theme.name && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-7 px-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      
      <ScopedThemeWrapper theme={currentTheme} isDark={previewDarkMode}>
        <div className="flex-1 min-h-0 overflow-auto scroll-smooth">
          <div className="min-h-full flex items-center justify-center p-4">
            {error ? (
              <div className="text-center p-8">
                <div className="text-destructive text-lg font-semibold mb-2">
                  Component Error
                </div>
                <div className="text-muted-foreground mb-4">{error}</div>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            ) : Component ? (
              <div 
                className={cn(
                  "preview-component-wrapper w-full",
                  viewportSize === "mobile" ? "max-w-sm" : "max-w-6xl"
                )}
                style={{ 
                  maxWidth: getViewportWidth(),
                  minHeight: viewportSize === "mobile" ? "600px" : "auto"
                }}
              >
                <ErrorBoundary key={refreshKey} onError={setError}>
                  <Component key={refreshKey} {...state.props} />
                </ErrorBoundary>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Loading component...</p>
              </div>
            )}
          </div>
        </div>
      </ScopedThemeWrapper>
    </div>
  );
}


class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: string) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: (error: string) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <div className="text-destructive text-lg font-semibold mb-2">
            Component Failed to Render
          </div>
          <div className="text-muted-foreground">
            Check the code for syntax errors or invalid props
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function PreviewPanel() {
  return (
    <ThemeProvider>
      <PreviewPanelContent />
    </ThemeProvider>
  );
}
